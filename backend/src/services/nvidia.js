import OpenAI from 'openai';

const DEFAULT_NVIDIA_MODELS = [
  'minimaxai/minimax-m2.5',
  'mistralai/mistral-small-4-119b-2603',
  'moonshotai/kimi-k2-instruct',
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

export async function generateWithNvidia(prompt, apiKey = process.env.NVIDIA_API_KEY) {
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY not set');
  }

  const client = new OpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey,
  });

  const modelCandidates = parseModelCandidates(
    process.env.NVIDIA_MODEL_CANDIDATES,
    DEFAULT_NVIDIA_MODELS,
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
        throw new Error(`Invalid response from NVIDIA for model ${model}`);
      }

      const content = getMessageText(res.choices[0].message.content);
      if (!content) {
        throw new Error(`Empty response from NVIDIA for model ${model}`);
      }

      return content;
    } catch (error) {
      lastError = error;
      console.warn(`NVIDIA model ${model} failed: ${error.message}`);
    }
  }

  throw new Error(`All configured NVIDIA models failed. Last error: ${lastError?.message || 'Unknown error'}`);
}
