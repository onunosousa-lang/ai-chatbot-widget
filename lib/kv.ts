import { Redis } from '@upstash/redis';

// Initialize Upstash Redis client
export const kv = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

export interface Client {
  client_id: string;
  company: {
    name: string;
    website: string;
    industry: string;
    country: string;
    service_area: string[];
    languages: string[];
    website_default_language: string;
    privacy_url: string;
    contact: {
      lead_notification_email: string;
      lead_notification_phone?: string;
      contact_hours?: string;
    };
  };
  assistant: {
    assistant_id?: string;
    openai_assistant_id?: string;
  };
  branding: {
    bot_display_name: string;
    tone: string;
    primary_color: string;
    logo_url?: string;
  };
  metadata: {
    status: 'pending' | 'active' | 'paused' | 'archived';
    created_at: string;
    updated_at: string;
    created_by: string;
    source: string;
  };
}

export async function getAllClients(): Promise<Client[]> {
  if (!kv) return [];

  try {
    const clientIds = await kv.smembers('clients:list');
    const clients: Client[] = [];

    for (const id of clientIds) {
      const client = await kv.get<Client>(`client:${id}`);
      if (client) clients.push(client);
    }

    return clients;
  } catch (error) {
    console.error('Error getting clients:', error);
    return [];
  }
}

export async function getClient(clientId: string): Promise<Client | null> {
  if (!kv) return null;

  try {
    return await kv.get<Client>(`client:${clientId}`);
  } catch (error) {
    console.error('Error getting client:', error);
    return null;
  }
}

export async function saveClient(client: Client): Promise<void> {
  if (!kv) return;

  try {
    await kv.set(`client:${client.client_id}`, client);
    await kv.sadd('clients:list', client.client_id);
  } catch (error) {
    console.error('Error saving client:', error);
    throw error;
  }
}

export async function deleteClient(clientId: string): Promise<void> {
  if (!kv) return;

  try {
    await kv.del(`client:${clientId}`);
    await kv.srem('clients:list', clientId);
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}
