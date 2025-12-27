import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, threadId } = req.body;
    
    const thread = threadId ? { id: threadId } : await openai.beta.threads.create();
    
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });
    
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID
    });
    
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    let attempts = 0;
    
    while (runStatus.status !== 'completed' && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      attempts++;
      
      if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed');
      }
    }
    
    const messages = await openai.beta.threads.messages.list(thread.id);
    const response = messages.data[0].content[0].text.value;
    
    return res.status(200).json({ response, threadId: thread.id });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
