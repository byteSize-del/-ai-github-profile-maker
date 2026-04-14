# Backend — Complete Implementation

## Provider Services

### `src/services/groq.js`

```js
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateWithGroq(prompt) {
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2000,
  });
  return res.choices[0].message.content;
}
```

### `src/services/openrouter.js`

```js
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function generateWithOpenRouter(prompt) {
  const res = await client.chat.completions.create({
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    messages: [{ role: 'user', content: prompt }],
  });
  return res.choices[0].message.content;
}
```

### `src/services/nvidia.js`

```js
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
});

export async function generateWithNvidia(prompt) {
  const res = await client.chat.completions.create({
    model: 'meta/llama-3.3-70b-instruct',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2000,
  });
  return res.choices[0].message.content;
}
```

### `src/services/provider.js`

```js
import { generateWithGroq } from './groq.js';
import { generateWithOpenRouter } from './openrouter.js';
import { generateWithNvidia } from './nvidia.js';

const providers = {
  groq: generateWithGroq,
  openrouter: generateWithOpenRouter,
  nvidia: generateWithNvidia,
};

export async function generateReadme(prompt) {
  const order = process.env.AI_PROVIDER_ORDER.split(',');
  for (const name of order) {
    try {
      const result = await providers[name.trim()](prompt);
      return { result, provider: name.trim() };
    } catch (err) {
      console.warn(`Provider ${name} failed:`, err.message);
    }
  }
  throw new Error('All AI providers failed');
}
```

## Routes

### `src/routes/generate.js`

```js
import { Router } from 'express';
import { generateReadme } from '../services/provider.js';
import { buildPrompt } from '../utils/prompt.js';
import { checkCredits, deductCredits } from '../middleware/credits.js';

const router = Router();

router.post('/', checkCredits, async (req, res) => {
  try {
    const { userData } = req.body;
    const prompt = buildPrompt(userData);
    const { result, provider } = await generateReadme(prompt);
    
    const creditsRemaining = deductCredits(req.body.userId);
    
    res.json({
      readme: result,
      creditsUsed: 1,
      creditsRemaining,
      provider,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
```

### `src/routes/credits.js`

```js
import { Router } from 'express';
import { getCredits } from '../db/credits.js';

const router = Router();

router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const { credits, resetAt } = getCredits(userId);
  res.json({ credits, resetAt });
});

export default router;
```

## Middleware

### `src/middleware/rateLimit.js`

```js
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
```

### `src/middleware/credits.js`

```js
import { getCredits, deductCredits as deductCreditsFromDb } from '../db/credits.js';

export function checkCredits(req, res, next) {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const { credits, resetAt } = getCredits(userId);
  if (credits <= 0) {
    return res.status(429).json({
      error: 'No credits remaining',
      resetAt,
      creditsRemaining: 0,
    });
  }
  next();
}

export function deductCredits(userId) {
  return deductCreditsFromDb(userId);
}
```
