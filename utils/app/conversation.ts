import { Conversation } from '../../types/chat';
import { supabase } from '../supabase-client';

export const updateConversation = (
  updatedConversation: Conversation,
  allConversations: Conversation[]
) => {
  const updatedConversations = allConversations.map((c) => {
    if (c.id === updatedConversation.id) {
      return updatedConversation;
    }

    return c;
  });

  saveConversation(updatedConversation);
  saveConversations(updatedConversations);

  return {
    single: updatedConversation,
    all: updatedConversations
  };
};

export const saveConversation = (conversation: Conversation) => {
  console.log('saving conversation', conversation);
  supabase.from('conversation').upsert({
    id: conversation.db_id? conversation.db_id : null,
    name: conversation.name,
    folder_id: conversation.folderId,
  }).then((res) => {
    console.log(res);
  })
};

export const saveConversations = (conversations: Conversation[]) => {
  console.log('saving conversations', conversations);
  localStorage.setItem('conversationHistory', JSON.stringify(conversations));
};
