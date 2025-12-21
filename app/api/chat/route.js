import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    const { message, threadId } = await request.json();
    
    // Create or reuse thread
    const thread = threadId 
      ? { id: threadId }
      : await openai.beta.threads.create();
    
    // Add user message
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });
    
    // Run assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID
    });
    
    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed');
      }
    }
    
    // Get assistant response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    const response = lastMessage.content[0].text.value;
    
    return Response.json({ 
      response, 
      threadId: thread.id 
    });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
