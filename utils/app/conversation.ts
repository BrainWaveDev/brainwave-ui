import { User } from '@supabase/auth-helpers-react';
import {
  Conversation,
  ConversationIdentifiable,
  ConversationSummary,
  Message
} from '../../types/chat';
import { supabase } from '../supabase-client';
import { isGeneratedId, randomNumberId } from './createDBOperation';
import { OpenAIModels } from 'types/openai';
import { DEFAULT_SYSTEM_PROMPT } from './prompts';
import { clear, get, remove, set } from './localcache';


export const randomPlaceholderConveration = () => {
  return {
    id: randomNumberId(),
    name: "new conversation",
    model: OpenAIModels['gpt-3.5-turbo'],
    prompt: DEFAULT_SYSTEM_PROMPT,
    messages: [],
    isPlaceholder: true,
    folderId: null
  } as Conversation;
};

export const updateConversation = async (
  updatedConversation: ConversationSummary
) => {
  try {
    var builder: any = supabase
      .from('conversation')
    if (updatedConversation.folderId) {
      builder = builder.update({
        name: updatedConversation.name,
        folder_id: updatedConversation.folderId
      })
    } else {
      builder = builder.update({
        name: updatedConversation.name,
      })
    }
    const { data, error } = await builder.eq('id', updatedConversation.id)
      .select();

    if (error) {
      console.error('Error updating conversation:', error);
      return false;
    }

    if (data) {
      remove('conversation', updatedConversation.id.toString());
      return true;
    }
  } catch (err) {
    console.error('Error updating conversation:', err);
    return false;
  }

  return false;
};

export const updateConversationFolder = async (
  conversationId: number,
  folderId: number | null
) => {
  try {
    const { data } = await supabase
      .from('conversation')
      .update({
        folder_id: folderId
      })
      .eq('id', conversationId)
      .throwOnError()
      .select();
    if (data) {
      remove('conversation', conversationId.toString());
      return true;
    }
  } catch (err) {
    console.error('Error updating conversation folder:', err);
    return false;
  }
  return false;
};

export const createConversation = async (
  conversation: ConversationIdentifiable,
  user_id: string
) => {
  const { data } = await supabase
    .from('conversation')
    .insert({
      name: conversation.name,
      user_id: user_id,
    })
    .select()
    .throwOnError()
    .single();

  const res = {
    id: data?.id,
    name: data?.name,
    model: OpenAIModels['gpt-3.5-turbo'],
    prompt: DEFAULT_SYSTEM_PROMPT,
    messages: [],
    folderId: data?.folder_id
  } as Conversation;

  set('conversation', res.id.toString(), res);
  return res;
};

export const retriveConversation = async (conversationId: number) => {
  const { exist, resource } = get('conversation', conversationId.toString());
  if (exist) {
    return resource!;
  }
  const { data, error } = (await supabase
    .from('conversation')
    .select(
      `
    id,
    name,
    created_at,
    folder_id,
    messages ( id,role, content, user_id, index)
  `
    )
    .eq('id', conversationId)
    .order('created_at', { ascending: false })
    .single()) as any;

  if (error) {
    throw error;
  }
  const res = {
    id: data?.id, // no error
    name: data?.name,
    model: OpenAIModels['gpt-3.5-turbo'],
    prompt: DEFAULT_SYSTEM_PROMPT,
    messages: data?.messages
  } as Conversation;
  set('conversation', conversationId.toString(), res); // @ts-nocheck
  // @ts-nocheck
  return res;
};

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
      folderId: c.folder_id
    } as ConversationSummary;
  });
};

export const deleteConversation = async (conversationId: number) => {
  remove('conversation', conversationId.toString());
  await supabase
    .from('conversation')
    .delete()
    .eq('id', conversationId)
    .throwOnError();
};

export const saveConversation = async (
  conversation: Conversation,
  user_id: string
) => {
  var to_upsert = {
    name: conversation.name,
    user_id: user_id,
  } as any;

  if (!isGeneratedId(conversation.id)) {
    to_upsert.id = conversation.id;
  } else {
    console.warn('save conversation is called with generated id');
  }

  const { data } = await supabase
    .from('conversation')
    .upsert(to_upsert)
    .throwOnError()
    .select()
    .single();

  const messages = conversation.messages
    .map((m, idx) => {
      var res = {
        conversation_id: data!.id,
        content: m.content,
        role: m.role,
        user_id: user_id,
        index: idx
      } as any;
      if (m.id) {
        res.id = m.id;
      }
      return res;
    })
    .filter((m) => !m.id);
  const messages_res = await supabase
    .from('messages')
    .upsert(messages)
    .select()
    .throwOnError();

  const res = {
    id: data?.id,
    name: data?.name,
    model: OpenAIModels['gpt-3.5-turbo'],
    prompt: DEFAULT_SYSTEM_PROMPT,
    folderId: data?.folder_id,
    messages: messages_res.data?.map((m) => {
      return {
        id: m.id,
        role: m.role,
        content: m.content
      } as Message;
    })
  } as Conversation;

  set('conversation', res.id.toString(), res);
  return res;
};

export const clearAllConversations = async (user_id: string) => {
  clear();
  await supabase
    .from('conversation')
    .delete()
    .eq('user_id', user_id)
    .throwOnError();
};

export const inseartMessage = async (
  message: Message,
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
      index: index
    })
    .select()
    .throwOnError()
    .single();

  const newMessage = {
    id: data?.id,
    role: data?.role,
    content: data?.content
  } as Message;

  const { exist, resource } = get('conversation', conversation_id.toString());
  if (exist) {
    resource!.messages.push(newMessage);
    set('conversation', conversation_id.toString(), resource!);
  }

  return newMessage;
};
