import { User, useUser } from '@supabase/auth-helpers-react';
import { Conversation, ConversationIdentifiable, ConversationSummary, Message } from '../../types/chat';
import { supabase } from '../supabase-client';
import { createDatabaseOperation } from './createDBOperation';
import { OpenAIModels } from 'types/openai';
import { DEFAULT_SYSTEM_PROMPT } from './const';

export const updateConversation = async (
  updatedConversation: Conversation,
  allConversations: ConversationSummary[]
) => {

};

export const createConversation = async (conversation: ConversationIdentifiable, user: User) => {
  const { data } = await supabase
    .from('conversation')
    .insert({
      name: conversation.name,
      user_id: user.id,
    })
    .select()
    .throwOnError()
    .single();

  return {
    id: data?.id,
    name: data?.name,
    model: OpenAIModels['gpt-3.5-turbo'],
    prompt: DEFAULT_SYSTEM_PROMPT,
    messages: [],
    folderId: data?.folder_id,
  } as Conversation;

}

export const updateConversationWithNewMessage = async (conversation: ConversationIdentifiable, message: Message) => {

}

export const retriveConversation = async (conversationId: number) => {
  const { data, error } = await supabase
    .from('conversation')
    .select(`
    id,
    name,
    created_at,
    updated_at
    messages ( role, content, created_at, updated_at, user_id)
  `)
    .eq('id', conversationId)
    .order('created_at', { ascending: false })
    .single() as any;

  if (error) {
    throw error;
  }
  // @ts-nocheck
  return {
    id: data?.id, // no error
    name: data?.name,
    model: OpenAIModels['gpt-3.5-turbo'],
    prompt: DEFAULT_SYSTEM_PROMPT,
    messages: data?.messages,
  } as Conversation;
}

export const retriveConversations = async (userId: string) => {
  const {data,error} = await supabase
    .from('conversation')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((c)=>{
    return {
      id: c.id,
      name: c.name,
      model: OpenAIModels['gpt-3.5-turbo'],
      prompt: DEFAULT_SYSTEM_PROMPT,
      folderId: c.folder_id,
    } as ConversationSummary;
  })
};


export const saveConversations = (conversations: ConversationSummary[]) => {
  console.log("save list of conversation is called")
  // localStorage.setItem('conversationHistory', JSON.stringify(conversations));
};

export const saveConversation = (conversation: Conversation) => {
  console.log("save conversation is called")
  // localStorage.setItem('conversation', JSON.stringify(conversation));
}

// export const updateConversation = (conversation: Conversation) => {
//   console.log("update conversation is called")
//   // localStorage.setItem('conversation', JSON.stringify(conversation));
// }
