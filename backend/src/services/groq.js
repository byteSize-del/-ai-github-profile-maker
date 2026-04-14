import Groq from 'groq-sdk';

export async function generateWithGroq(prompt, apiKey = process.env.GROQ_API_KEY) {
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not set');
  }

  const groq = new Groq({ apiKey });
  
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
