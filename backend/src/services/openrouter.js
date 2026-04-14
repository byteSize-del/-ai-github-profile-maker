import OpenAI from 'openai';

const DEFAULT_OPENROUTER_MODELS = [
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-3-27b-it:free',
];

function parseModelCandidates(rawValue, defaults) {
  if (!rawValue) {
    return defaults;
  }

  const parsed = rawValue
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return parsed.length ? [...new Set(parsed)] : defaults;
}

function getMessageText(content) {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === 'string' ? part.text : ''))
      .join('')
      .trim();
  }

  return '';
}

export async function generateWithOpenRouter(prompt, apiKey = process.env.OPENROUTER_API_KEY) {
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not set');
  }

  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
  });

  const modelCandidates = parseModelCandidates(
    process.env.OPENROUTER_MODEL_CANDIDATES,
    DEFAULT_OPENROUTER_MODELS,
  );

  let lastError = null;

  for (const model of modelCandidates) {
    try {
      const res = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 3000,
        temperature: 0.7,
      });

      if (!res.choices || !res.choices[0] || !res.choices[0].message) {
        throw new Error(`Invalid response from OpenRouter for model ${model}`);
      }

      const content = getMessageText(res.choices[0].message.content);
      if (!content) {
        throw new Error(`Empty response from OpenRouter for model ${model}`);
      }

      return content;
    } catch (error) {
      lastError = error;
      console.warn(`OpenRouter model ${model} failed: ${error.message}`);
    }
  }

  throw new Error(`All configured OpenRouter models failed. Last error: ${lastError?.message || 'Unknown error'}`);
}
