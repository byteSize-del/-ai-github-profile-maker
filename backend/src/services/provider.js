import { generateWithGroq } from './groq.js';
import { generateWithOpenRouter } from './openrouter.js';
import { generateWithNvidia } from './nvidia.js';

const providers = {
  groq: { generator: generateWithGroq, envPrefix: 'GROQ' },
  openrouter: { generator: generateWithOpenRouter, envPrefix: 'OPENROUTER' },
  nvidia: { generator: generateWithNvidia, envPrefix: 'NVIDIA' },
};

const providerRotationIndex = {
  groq: 0,
  openrouter: 0,
  nvidia: 0,
};

function parseKeyList(rawValue) {
  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function getProviderKeyDiagnostics(envPrefix) {
  const singleKey = process.env[`${envPrefix}_API_KEY`]?.trim();
  const listKeys = parseKeyList(process.env[`${envPrefix}_API_KEYS`]);

  let numberedCount = 0;
  for (let i = 1; i <= 10; i += 1) {
    if (process.env[`${envPrefix}_API_KEY_${i}`]?.trim()) {
      numberedCount += 1;
    }
  }

  const mergedUnique = getProviderKeys(envPrefix);

  return {
    totalUnique: mergedUnique.length,
    hasLegacySingle: !!singleKey,
    listCount: listKeys.length,
    numberedCount,
  };
}

export function getProviderPoolSummary() {
  return {
    groq: getProviderKeyDiagnostics('GROQ'),
    openrouter: getProviderKeyDiagnostics('OPENROUTER'),
    nvidia: getProviderKeyDiagnostics('NVIDIA'),
  };
}

function getProviderKeys(envPrefix) {
  const keys = [];

  const singleKey = process.env[`${envPrefix}_API_KEY`];
  if (singleKey?.trim()) {
    keys.push(singleKey.trim());
  }

  keys.push(...parseKeyList(process.env[`${envPrefix}_API_KEYS`]));

  for (let i = 1; i <= 10; i += 1) {
    const numberedKey = process.env[`${envPrefix}_API_KEY_${i}`];
    if (numberedKey?.trim()) {
      keys.push(numberedKey.trim());
    }
  }

  return [...new Set(keys)];
}

function getRotatedKeys(providerName, keys) {
  if (!keys.length) {
    return [];
  }

  const startIndex = providerRotationIndex[providerName] % keys.length;
  providerRotationIndex[providerName] = (startIndex + 1) % keys.length;

  return keys.map((_, offset) => keys[(startIndex + offset) % keys.length]);
}

function getErrorStatus(error) {
  return error?.status || error?.response?.status || null;
}

function resolveProviderOrder() {
  const configuredProviders = Object.entries(providers)
    .filter(([, { envPrefix }]) => getProviderKeys(envPrefix).length > 0)
    .map(([name]) => name);

  if (!configuredProviders.length) {
    return [];
  }

  const requestedOrder = (process.env.AI_PROVIDER_ORDER || '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  if (!requestedOrder.length) {
    return configuredProviders;
  }

  const knownRequested = requestedOrder.filter((name) => !!providers[name]);
  const unknownRequested = requestedOrder.filter((name) => !providers[name]);

  if (unknownRequested.length) {
    console.warn(`Unknown providers in AI_PROVIDER_ORDER ignored: ${unknownRequested.join(', ')}`);
  }

  const order = [...knownRequested];
  for (const providerName of configuredProviders) {
    if (!order.includes(providerName)) {
      order.push(providerName);
    }
  }

  return order;
}

export async function generateReadme(prompt) {
  const totalConfiguredKeys = Object.values(providers)
    .map(({ envPrefix }) => getProviderKeys(envPrefix).length)
    .reduce((sum, count) => sum + count, 0);

  if (!totalConfiguredKeys) {
    console.error('No API keys found. Please set at least one API key in .env');
    throw new Error('No API keys configured. Set GROQ_API_KEY_1..N, OPENROUTER_API_KEY_1..N, NVIDIA_API_KEY_1..N, or *_API_KEYS');
  }

  const order = resolveProviderOrder();
  if (!order.length) {
    throw new Error('No valid AI providers configured. Check AI_PROVIDER_ORDER and provider keys.');
  }

  console.log(`Trying providers in order: ${order.join(', ')}`);
  
  const allErrors = [];
  
  for (const name of order) {
    const providerConfig = providers[name];
    if (!providerConfig) {
      console.warn(`Unknown provider: ${name}`);
      continue;
    }

    const providerKeys = getProviderKeys(providerConfig.envPrefix);
    if (!providerKeys.length) {
      console.warn(`Skipping ${name}: no API key configured`);
      continue;
    }

    const rotatedKeys = getRotatedKeys(name, providerKeys);
    console.log(`Attempting ${name} with ${rotatedKeys.length} configured key(s)`);
    
    for (let keyIndex = 0; keyIndex < rotatedKeys.length; keyIndex += 1) {
      const key = rotatedKeys[keyIndex];

      try {
        const result = await providerConfig.generator(prompt, key);
        console.log(`${name} succeeded with key slot ${keyIndex + 1}/${rotatedKeys.length}`);
        return { result, provider: name };
      } catch (err) {
        const status = getErrorStatus(err);
        console.error(`Provider ${name} failed on key slot ${keyIndex + 1}/${rotatedKeys.length}:`, err.message);
        allErrors.push({ provider: name, keySlot: keyIndex + 1, status, error: err.message });

        // Rate limit or transient upstream failure: try the next key/provider quickly.
        if (status === 429 || status === 503) {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
      }
    }
  }
  
  console.error('All providers failed:', JSON.stringify(allErrors, null, 2));
  throw new Error('All AI providers failed. Check your API keys and .env configuration.');
}
