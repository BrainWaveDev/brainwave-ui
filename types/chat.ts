import { OpenAIModel } from './openai';

export interface Message {
  id?: number;
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';

export interface RequestBody {
  jwt: string;
  model: OpenAIModel;
  messages: Message[];
}

export interface ConversationIdentifiable {
  id: number;
  name: string;
}

export interface ConversationSummary extends ConversationIdentifiable {
  model: OpenAIModel;
  prompt: string;
  folderId: number | null;
}


export interface Conversation extends ConversationSummary{
  id: number;
  messages: Message[];
  isPlaceholder?: boolean;
}



