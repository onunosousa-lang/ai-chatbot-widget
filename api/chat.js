// api/chat.js
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, botId } = req.body || {};

    if (!message) {
      res.status(400).json({ error: 'Missing message' });
      return;
    }

    // Simple per-bot config (MVP: only Groenvastbouw)
    const bots = {
      groenvastbouw: {
        name: 'Groenvastbouw',
        summary:
          'Groenvastbouw builds sustainable, energy-efficient passive houses in the Netherlands. ' +
          'They focus on high-insulation, airtight construction and a healthy indoor climate ' +
          'for families who want low energy bills and long-term comfort.',
        language: 'nl',
      },
    };

    const botConfig = bots[botId] || bots.groenvastbouw;

    const systemPrompt =
      `You are an AI assistant for ${botConfig.name}. ` +
      `Answer in ${botConfig.language} by default, unless the user clearly uses another language. ` +
      `Use ONLY the following company information as your source:\n\n` +
      `${botConfig.summary}\n\n` +
      `If you are unsure or the question is outside this scope, say you do not know ` +
      `and suggest contacting the company.`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || '';

    res.status(200).json({ response: reply });
  } catch (err) {
    console.error('Chat API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


