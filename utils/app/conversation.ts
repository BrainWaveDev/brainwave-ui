import { Conversation, ConversationSummary, Message } from '@/types/chat';
import { supabase } from '../supabase-client';
import { isGeneratedId, randomNumberId } from './createDBOperation';
import { OpenAIModels } from 'types/openai';
import { defaultPrompt } from './prompts';
import { get, remove, removeAll, set } from './localcache';
import { SupabaseClient } from '@supabase/supabase-js';

export const randomPlaceholderConversation = (promptId?:number) => {
  return {
    id: randomNumberId(),
    name: 'New conversation',
    model: OpenAIModels['gpt-3.5-turbo'],
    promptId: promptId || defaultPrompt.id,
    messages: [],
    folderId: null,
    isPlaceholder:true
  } as Conversation;
};

export const updateConversation = async (
  updatedConversation: ConversationSummary
) => {
  try {
    const { data, error } = await supabase
      .from('conversation')
      .update({
        name: updatedConversation.name,
        folder_id: updatedConversation.folderId
      })
      .eq('id', updatedConversation.id)
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

export const replacePlaceholderConversation = async (conversation: Conversation) => {
  if(!conversation.isPlaceholder){
    throw new Error("cannot re-create conversation")
  }

  // Save conversation to the local storage
  set('conversation', conversation.id.toString(), conversation);

  try {
    let res = await supabase
      .from('conversation')
      .insert({
        name: conversation.name,
        prompt_id: conversation.promptId,
        model: OpenAIModels['gpt-3.5-turbo'].name
      })
      .select()
      .single()
      .throwOnError();

    return res.data!;
  } catch (err) {
    // Clear conversation from local storage
    remove('conversation', conversation.id.toString());

    // TODO: Better error handling
    console.error('Error creating conversation:', err);
    throw Error('Error creating conversation in the database');
  }
};

export const retrieveConversation = async (conversationId: number) => {
  // Get conversation from local storage
  const { exist, resource } = get('conversation', conversationId.toString());

  if (exist) return resource as Conversation;

  const { data, error } = (await supabase
    .from('conversation')
    .select(
      `
    id,
    name,
    created_at,
    folder_id,
    prompt_id,
    messages ( id,role, content, user_id, index)
  `
    )
    .eq('id', conversationId)
    .single()) as any;

  if (error) {
    // Set conversation to the version in local storage
    if (exist) return resource as Conversation;
    throw error;
  }
  const resMessages: Message[] = data?.messages.map(
    (m: any) => {
      return ({
        id: m.id,
        role: m.role,
        content: m.content,
        index: m.index
      } as Message)
    }
  )
  const res = {
    id: data?.id, // no error
    name: data?.name,
    model: OpenAIModels['gpt-3.5-turbo'],
    promptId: data.prompt_id ?? defaultPrompt.id,
    folderId: data.folder_id ?? null,
    messages: resMessages
  } as Conversation;

  // Remove previously saved conversation if it's a placeholder
  if (exist) remove('conversation', conversationId.toString());
  set('conversation', conversationId.toString(), res); // @ts-nocheck

  // @ts-nocheck
  return res;
};

export const fetchAllConversations = async (
  supabaseClient?: SupabaseClient
) => {
  const { data, error } = await (supabaseClient ?? supabase)
    .from('conversation')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data.map((c) => {
    return {
      id: c.id,
      name: c.name,
      model: OpenAIModels['gpt-3.5-turbo'],
      promptId: c.prompt_id,
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
  let to_upsert = {
    name: conversation.name,
    user_id: user_id
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
      let res = {
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
    promptId: defaultPrompt.id,
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

export const clearAllConversations = async () => {
  removeAll('conversation');
  // Delete cannot be used without WHERE clause
  await supabase.from('conversation').delete().neq('id', -1).throwOnError();
};

export const insertMessage = async (
  message: Message,
  conversation_id: number,
  user_id: string
) => {
  console.debug('inserting message, conversation id = ', conversation_id);
  const { data } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversation_id,
      content: message.content,
      role: message.role,
      user_id: user_id,
      index: message.index!
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

export const replaceLastMessage = async (
  message: Message,
  conversation_id: number,
  index: number
) => {
  const { data } = await supabase
    .from('messages')
    .update({
      content: message.content,
      role: message.role,
      index: index
    })
    .eq('conversation_id', conversation_id)
    .eq('index', index)
    .limit(1)
    .order('index', { ascending: false })
    .select()
    .throwOnError();

  const { exist, resource } = get('conversation', conversation_id.toString());
  if (exist && data && data[0]) {
    resource!.messages[resource!.messages.length - 1] = {
      id: data[0].id,
      role: data[0].role,
      content: data[0].content
    } as Message;
    set('conversation', conversation_id.toString(), resource!);
  }

  return data;
};
