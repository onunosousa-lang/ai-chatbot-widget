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
    const { message, threadId, clientId = 'default' } = req.body;

    // Get client-specific configuration
    const clientConfig = getClientConfig(clientId);

    const thread = threadId ? { id: threadId } : await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: clientConfig.assistantId
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    let attempts = 0;

    while (runStatus.status !== 'completed' && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      attempts++;

      // Handle function calling
      if (runStatus.status === 'requires_action') {
        const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
        const toolOutputs = [];

        for (const toolCall of toolCalls) {
          if (toolCall.function.name === 'save_lead') {
            const args = JSON.parse(toolCall.function.arguments);

            // Get conversation history from thread
            const conversationSummary = await getConversationSummary(thread.id);

            // Save the lead with client-specific webhook, clientId, and conversation
            await saveLead(args, clientConfig.webhookUrl, clientId, conversationSummary);

            toolOutputs.push({
              tool_call_id: toolCall.id,
              output: JSON.stringify({ success: true, message: 'Lead saved successfully' })
            });
          }
        }

        // Submit function outputs
        await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
          tool_outputs: toolOutputs
        });

        continue;
      }

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

// Function to get client-specific configuration
function getClientConfig(clientId) {
  // Try client-specific env vars first, fall back to default
  const assistantId = process.env[`CLIENT_${clientId.toUpperCase()}_ASSISTANT_ID`] || process.env.OPENAI_ASSISTANT_ID;
  const webhookUrl = process.env[`CLIENT_${clientId.toUpperCase()}_WEBHOOK_URL`] || process.env.LEAD_WEBHOOK_URL;

  if (!assistantId) {
    throw new Error(`No assistant ID configured for client: ${clientId}`);
  }

  return {
    assistantId,
    webhookUrl,
    clientId
  };
}

// Function to get conversation summary from thread
async function getConversationSummary(threadId) {
  try {
    const messages = await openai.beta.threads.messages.list(threadId, { limit: 20 });

    // Format messages as conversation transcript
    const transcript = messages.data
      .reverse() // Oldest first
      .map(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        const content = msg.content[0]?.text?.value || '';
        return `${role}: ${content}`;
      })
      .join('\n\n');

    return transcript;
  } catch (error) {
    console.error('Error getting conversation summary:', error);
    return '';
  }
}

// Function to save leads
async function saveLead(leadData, webhookUrl, clientId, conversationSummary = '') {
  const { name, email, phone, preferred_time, notes } = leadData;

  console.log('📧 New Lead Collected:', leadData);

  // Send lead via webhook (Zapier, Make.com, etc.)
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          preferred_time,
          notes,
          conversationSummary,
          clientId,
          timestamp: new Date().toISOString(),
          source: 'chatbot'
        })
      });
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }

  return true;
}
