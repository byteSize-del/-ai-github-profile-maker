import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
});

export async function generateWithNvidia(prompt) {
  if (!process.env.NVIDIA_API_KEY) {
    throw new Error('NVIDIA_API_KEY not set');
  }
  
  const res = await client.chat.completions.create({
    model: 'moonshotai/kimi-k2-instruct',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 3000,
    temperature: 0.7,
  });
  
  if (!res.choices || !res.choices[0] || !res.choices[0].message) {
    throw new Error('Invalid response from NVIDIA');
  }
  
  return res.choices[0].message.content;
}
