import { OpenAIModel } from './openai';

export interface Message {
  id?: number;
  role: Role;
  content: string;
  index?: number;
}

export type Role = 'assistant' | 'user';

export interface RequestBody {
  jwt: string;
  model: OpenAIModel;
  messages: Message[];
  search_space?: number[];
}

export interface RequestMatchDocumentChunks {
  user_id: string;
  embedding: number[];
  match_count: number;
  match_threshold: number;
  min_content_length: number;
  search_space?: number[];
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

export interface Conversation extends ConversationSummary {
  id: number;
  messages: Message[];
  isPlaceholder?: boolean;
}
