import { Conversation } from '@/types/chat';
import { OpenAIModelID, OpenAIModels } from '@/types/openai';
import { defaultPrompt } from './prompts';

export const cleanSelectedConversation = (conversation: Conversation) => {
  // added model for each conversation (3/20/23)
  // added system prompt for each conversation (3/21/23)
  // added folders (3/23/23)
  // added prompts (3/26/23)

  let updatedConversation = conversation;

  // check for model on each conversation
  if (!updatedConversation.model) {
    updatedConversation = {
      ...updatedConversation,
      model: updatedConversation.model || OpenAIModels[OpenAIModelID.GPT_3_5]
    };
  }

  // check for system prompt on each conversation
  if (!updatedConversation.promptId) {
    updatedConversation = {
      ...updatedConversation,
      promptId: updatedConversation.promptId ?? defaultPrompt.id
    };
  }

  if (!updatedConversation.folderId) {
    updatedConversation = {
      ...updatedConversation,
      folderId: updatedConversation.folderId || null
    };
  }

  return updatedConversation;
};

export const cleanConversationHistory = (history: any[]): Conversation[] => {
  if (!Array.isArray(history)) {
    console.warn('history is not an array. Returning an empty array.');
    return [];
  }

  return history.reduce((acc: any[], conversation) => {
    try {
      if (!conversation.model) {
        conversation.model = OpenAIModels[OpenAIModelID.GPT_3_5];
      }

      if (!conversation.promptId) {
        conversation.prompt = defaultPrompt.id;
      }

      if (!conversation.folderId) {
        conversation.folderId = null;
      }

      acc.push(conversation);
      return acc;
    } catch (error) {
      console.warn(
        `error while cleaning conversations' history. Removing culprit`,
        error
      );
    }
    return acc;
  }, []);
};

export const cleanLocalStorage = () => {
  // Clear all information saved in local storage
  localStorage.removeItem('prompts');
  localStorage.removeItem('selectedConversation');
  localStorage.removeItem('conversationHistory');
  localStorage.removeItem('folders');
};
