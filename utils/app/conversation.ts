import { User, useUser } from '@supabase/auth-helpers-react';
import { Conversation, ConversationIdentifiable, ConversationSummary, Message } from '../../types/chat';
import { supabase } from '../supabase-client';
import { createDatabaseOperation } from './createDBOperation';

export const updateConversation = (
  updatedConversation: Conversation,
  allConversations: ConversationSummary[]
) => {
  console.log("update conversation is called")
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

export const createConversation = (conversation: ConversationIdentifiable,user:User) => {
  const operation = () => 
    supabase.from('conversation').insert({
      user_id : user?.id,
      name    : conversation.name,
    })
    .select('id');
  

  return createDatabaseOperation(operation);
};

export const updateConversationWithNewMessage = (conversation:ConversationIdentifiable,message:Message) => {
  const operation = () => 
    supabase.from('conversation').update({
      name : conversation.name,
    }).eq('id',conversation.id);
    supabase.from('message').
    upsert({
      conversation_id : conversation.id,
      content         : message.content,
      role            : message.role,
    }).eq('id',conversation.id);
  

  return createDatabaseOperation(operation);
}

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
