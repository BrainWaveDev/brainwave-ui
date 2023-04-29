import { User, useUser } from '@supabase/auth-helpers-react';
import { Conversation, Message } from '../../types/chat';
import { supabase } from '../supabase-client';
import { createDatabaseOperation } from './createDBOperation';

// export const updateConversation = (
//   updatedConversation: Conversation,
//   allConversations: Conversation[]
// ) => {
//   const updatedConversations = allConversations.map((c) => {
//     if (c.id === updatedConversation.id) {
//       return updatedConversation;
//     }

//     return c;
//   });

//   saveConversation(updatedConversation);
//   saveConversations(updatedConversations);

//   return {
//     single: updatedConversation,
//     all: updatedConversations
//   };
// };

export const createConversation = (conversation: Conversation,user:User) => {
  const operation = () => {
    supabase.from('conversation').insert({
      user_id : user?.id,
      name    : conversation.name,
    }).select();
  }

  return createDatabaseOperation(operation);
};

export const updateConversationWithNewMessage = (conversation:Conversation,message:Message) => {
  const operation = () => {
    const messages = conversation.messages
    supabase.from('conversation').update({
      name : conversation.name,
    }).eq('id',conversation.id);
    supabase.from('message').
    upsert({
      conversation_id : conversation.id,
      content         : messages[messages.length-1].content,
      role            : messages[messages.length-1].role,
    }).eq('id',conversation.id);
  }

  return createDatabaseOperation(operation);
}

// export const saveConversations = (conversations: Conversation[]) => {
//   console.log('saving conversations', conversations);
//   localStorage.setItem('conversationHistory', JSON.stringify(conversations));
// };
