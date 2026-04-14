import Groq from 'groq-sdk';

const DEFAULT_GROQ_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3-32b',
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

export async function generateWithGroq(prompt, apiKey = process.env.GROQ_API_KEY) {
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not set');
  }

  const groq = new Groq({ apiKey });

  const modelCandidates = parseModelCandidates(
    process.env.GROQ_MODEL_CANDIDATES,
    DEFAULT_GROQ_MODELS,
  );

  let lastError = null;

  for (const model of modelCandidates) {
    try {
      const res = await groq.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 3000,
        temperature: 0.7,
      });

      if (!res.choices || !res.choices[0] || !res.choices[0].message) {
        throw new Error(`Invalid response from Groq for model ${model}`);
      }

      const content = getMessageText(res.choices[0].message.content);
      if (!content) {
        throw new Error(`Empty response from Groq for model ${model}`);
      }

      return content;
    } catch (error) {
      lastError = error;
      console.warn(`Groq model ${model} failed: ${error.message}`);
    }
  }

  throw new Error(`All configured Groq models failed. Last error: ${lastError?.message || 'Unknown error'}`);
}
