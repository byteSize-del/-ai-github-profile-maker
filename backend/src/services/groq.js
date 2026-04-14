import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateWithGroq(prompt) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not set');
  }
  
  const res = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 3000,
    temperature: 0.7,
  });
  
  if (!res.choices || !res.choices[0] || !res.choices[0].message) {
    throw new Error('Invalid response from Groq');
  }
  
  return res.choices[0].message.content;
}
