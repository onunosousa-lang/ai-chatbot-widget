import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function listAssistants() {
  try {
    const assistants = await openai.beta.assistants.list({
      limit: 100,
    });
    return assistants.data;
  } catch (error) {
    console.error('Error listing assistants:', error);
    return [];
  }
}

export async function getAssistant(id: string) {
  try {
    return await openai.beta.assistants.retrieve(id);
  } catch (error) {
    console.error('Error getting assistant:', error);
    return null;
  }
}

export async function createAssistant(data: {
  name: string;
  instructions: string;
  model: string;
  tools?: any[];
}) {
  try {
    return await openai.beta.assistants.create({
      name: data.name,
      instructions: data.instructions,
      model: data.model,
      tools: data.tools || [{ type: 'file_search' }],
    });
  } catch (error) {
    console.error('Error creating assistant:', error);
    throw error;
  }
}

export async function updateAssistant(
  id: string,
  data: {
    name?: string;
    instructions?: string;
    model?: string;
    tools?: any[];
  }
) {
  try {
    return await openai.beta.assistants.update(id, data);
  } catch (error) {
    console.error('Error updating assistant:', error);
    throw error;
  }
}

export async function deleteAssistant(id: string) {
  try {
    return await openai.beta.assistants.del(id);
  } catch (error) {
    console.error('Error deleting assistant:', error);
    throw error;
  }
}
