import { generateWithGroq } from './groq.js';
import { generateWithOpenRouter } from './openrouter.js';
import { generateWithNvidia } from './nvidia.js';

const providers = {
  groq: generateWithGroq,
  openrouter: generateWithOpenRouter,
  nvidia: generateWithNvidia,
};

export async function generateReadme(prompt) {
  // Check if .env is properly configured
  if (!process.env.AI_PROVIDER_ORDER) {
    console.error('AI_PROVIDER_ORDER not set in .env file');
    throw new Error('No AI providers configured. Please set AI_PROVIDER_ORDER in your .env file (e.g., groq,openrouter,nvidia)');
  }

  // Check if at least one API key exists
  const hasKeys = process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY || process.env.NVIDIA_API_KEY;
  if (!hasKeys) {
    console.error('No API keys found. Please set at least one API key in .env');
    throw new Error('No API keys configured. Please set GROQ_API_KEY, OPENROUTER_API_KEY, or NVIDIA_API_KEY in your .env file');
  }

  const order = process.env.AI_PROVIDER_ORDER.split(',');
  console.log(`Trying providers in order: ${order.join(', ')}`);
  
  let allErrors = [];
  
  for (const name of order) {
    const trimmedName = name.trim();
    if (!providers[trimmedName]) {
      console.warn(`Unknown provider: ${trimmedName}`);
      continue;
    }
    
    // Check if this provider has an API key
    const hasKeyForProvider = 
      (trimmedName === 'groq' && process.env.GROQ_API_KEY) ||
      (trimmedName === 'openrouter' && process.env.OPENROUTER_API_KEY) ||
      (trimmedName === 'nvidia' && process.env.NVIDIA_API_KEY);
    
    if (!hasKeyForProvider) {
      console.warn(`Skipping ${trimmedName}: no API key configured`);
      continue;
    }
    
    try {
      console.log(`Attempting ${trimmedName}...`);
      const result = await providers[trimmedName](prompt);
      console.log(`${trimmedName} succeeded!`);
      return { result, provider: trimmedName };
    } catch (err) {
      console.error(`Provider ${trimmedName} failed:`, err.message);
      allErrors.push({ provider: trimmedName, error: err.message });
      
      // If rate limited, add a small delay before trying next provider
      if (err.status === 429) {
        console.log(`${trimmedName} rate limited, trying next provider...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  console.error('All providers failed:', JSON.stringify(allErrors, null, 2));
  throw new Error('All AI providers failed. Check your API keys and .env configuration.');
}
