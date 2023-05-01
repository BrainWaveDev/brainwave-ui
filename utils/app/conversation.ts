import { User, useUser } from '@supabase/auth-helpers-react';
import { Conversation, ConversationIdentifiable, ConversationSummary, Message } from '../../types/chat';
import { supabase } from '../supabase-client';
import { createDatabaseOperation, isGeneratedId } from './createDBOperation';
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
    folder_id,
    messages ( id,role, content, user_id, index)
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
  const { data, error } = await supabase
    .from('conversation')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((c) => {
    return {
      id: c.id,
      name: c.name,
      model: OpenAIModels['gpt-3.5-turbo'],
      prompt: DEFAULT_SYSTEM_PROMPT,
      folderId: c.folder_id,
    } as ConversationSummary;
  })
};

export const deleteConversation = async (conversationId: number) => {
  await supabase
    .from('conversation')
    .delete()
    .eq('id', conversationId)
    .throwOnError();

}


export const saveConversation = async (conversation: Conversation, user_id: string) => {
  var to_upsert = {
    name: conversation.name,
    user_id: user_id,
    model: conversation.model.name,
    folder_id: conversation.folderId,
  } as any
  if (!isGeneratedId(conversation.id)) {
    to_upsert.id = conversation.id;
  } else {
    console.warn("save conversation is called with generated id")
  }

  const { data } = await supabase
    .from('conversation')
    .upsert(to_upsert)
    .throwOnError()
    .select()
    .single();

  console.debug("save conversation is called,data is", data)
  const messages = conversation.messages.map((m, idx) => {
    var res = {
      conversation_id: data!.id,
      content: m.content,
      role: m.role,
      user_id: user_id,
      index: idx,
    } as any
    if (m.id) {
      res.id = m.id
    }
    return res
  }).filter(m => !m.id)
  console.debug("save conversation is called,message is", messages)
  const messages_res = await supabase
    .from('messages')
    .upsert(messages)
    .select()
    .throwOnError();

  return {
    id: data?.id,
    name: data?.name,
    model: OpenAIModels['gpt-3.5-turbo'],
    prompt: DEFAULT_SYSTEM_PROMPT,
    folderId: data?.folder_id,
    messages: messages_res.data?.map(m => {
      return {
        id: m.id,
        role: m.role,
        content: m.content,
      } as Message
    }),
  } as Conversation
}

export const clearAllConversations = async (user_id: string) => {
  await supabase
    .from('conversation')
    .delete()
    .eq('user_id', user_id)
    .throwOnError();

}

export const inseartMessage = async (message: Message,
  index: number,
  conversation_id: number,
  user_id: string
) => {
  const { data } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversation_id,
      content: message.content,
      role: message.role,
      user_id: user_id,
      index: index,
    })
    .select()
    .throwOnError()
    .single();

  return {
    id: data?.id,
    role: data?.role,
    content: data?.content,
  } as Message
}


// export const updateConversation = (conversation: Conversation) => {
//   console.log("update conversation is called")
//   // localStorage.setItem('conversation', JSON.stringify(conversation));
// }
