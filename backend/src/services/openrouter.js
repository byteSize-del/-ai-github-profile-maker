import OpenAI from 'openai';

export async function generateWithOpenRouter(prompt, apiKey = process.env.OPENROUTER_API_KEY) {
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not set');
  }

  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
  });
  
  const res = await client.chat.completions.create({
    // Use a more reliable free model
    model: 'meta-llama/llama-3.1-8b-instruct',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 3000,
    temperature: 0.7,
  });
  
  if (!res.choices || !res.choices[0] || !res.choices[0].message) {
    throw new Error('Invalid response from OpenRouter');
  }
  
  return res.choices[0].message.content;
}
