import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, ConversationSummary, Message } from '@/types/chat';
import { AppThunk, useAppSelector } from './store';
import {
  createConversation,
  insertMessage,
  replaceLastMessage,
  retrieveConversation
} from '@/utils/app/conversation';
import { Session } from '@supabase/auth-helpers-react';
import { addConversation } from './conversationsSlice';
import { randomPlaceholderConversation } from '@/utils/app/conversation';

interface SelectedConversationState {
  conversation: Conversation | undefined;
  currentMessage: Message | undefined;
  messageIsStreaming: boolean;
  loading: boolean;
}

const initialState: SelectedConversationState = {
  conversation: undefined,
  currentMessage: undefined,
  messageIsStreaming: false,
  loading: false
};

const currentConversationSlice = createSlice({
  name: 'selectedConversation',
  initialState,
  reducers: {
    selectCurrentConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversation = action.payload;
    },
    clearSelectedConversation: (state) => {
      state.conversation = undefined;
    },
    userSent(state, action: PayloadAction<Message>) {
      const { conversation } = state;
      if (!conversation) {
        console.error('No conversation found');
        return;
      }
      conversation.messages.push(action.payload);
      state.conversation = conversation;
    },
    appendLastAssistantMessage: (state, action: PayloadAction<string>) => {
      const { conversation } = state;
      if (!conversation) return;
      const messages = conversation.messages;
      if (!messages) return;
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) return;
      if (lastMessage.role !== 'assistant') {
        messages.push({
          content: action.payload,
          role: 'assistant'
        });
        state.conversation = {
          ...conversation,
          messages
        };
      } else {
        lastMessage.content += action.payload;
      }
    },
    removeLastAssistantMessage: (state) => {
      const { conversation } = state;
      if (!conversation) return;
      const messages = conversation.messages;
      if (!messages) return;
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) return;
      if (lastMessage.role === 'assistant') {
        messages.pop();
        state.conversation = {
          ...conversation,
          messages
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.messageIsStreaming = action.payload;
    },
    clearSource: (state) => {
      const { conversation } = state;
      if (!conversation) return;
      const messages = conversation?.messages;
      if (!messages) return;
      const updatedMessage = messages.map((message) => {
        if (message.role === 'assistant') {
          // Find place in the string where the source is mentioned
          const sourceIndex = message.content.indexOf('<h3>Sources</h3>');
          if (sourceIndex !== -1 && message) {
            // Remove the source from the message content
            message.content = message.content.substring(0, sourceIndex);
          }
        }
        return message;
      });
      state.conversation = {
        ...conversation,
        messages: updatedMessage
      };
    }
  }
});

const thunkRetrieveConversationDetails =
  (summary: ConversationSummary): AppThunk =>
    async (dispatch) => {
      const tempConversation: Conversation = {
        ...summary,
        messages: []
      };
      dispatch(selectCurrentConversation(tempConversation));
      try {
        const conversation = await retrieveConversation(tempConversation.id);
        dispatch(selectCurrentConversation(conversation));
      } catch (e) {
        dispatch(clearSelectedConversation());
      }
    };

const thunkUserSent =
  (message: Message, user_id: string): AppThunk<Conversation | undefined> =>
    async (dispatch, getState) => {
      let { conversation } = getState().currentConversation;

      if (!conversation) {
        const placeholder = randomPlaceholderConversation();
        dispatch(selectCurrentConversation(placeholder));
        try {
          // We don't need to update the UI after this since
          // the new conversation is already in the UI
          const dbConversation = await createConversation(placeholder);
          conversation = dbConversation;
          dispatch(addConversation(dbConversation));
        } catch (e) {
          console.error(e);
          // TODO: ERROR: Failed to create new conversation
          dispatch(setLoading(false));
          return;
        }
      }

      dispatch(userSent(message));
      dispatch(setLoading(true));

      try {
        if (!conversation) {
          throw new Error('No conversation found, this should never happen');
        }
        const messages = conversation.messages;
        // insert message to db
        await insertMessage(
          message,
          messages.length - 1,
          conversation.id,
          user_id
        );
      } catch (e) {
        // TODO: ERROR: Failed to sync message history with database
        dispatch(clearSelectedConversation());
        throw e;
      }

      return conversation;
    };

export const thunkStreamingResponse =
  (session: Session, search_space: number[]): AppThunk =>
    async (dispatch, getState) => {
      if (!getState().loading) dispatch(setLoading(true));

      const { conversation } = getState().currentConversation;
      if (!conversation) {
        console.error(`there is no conversation, this should never happen`);
        return;
      }
      const messages = conversation.messages;
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || lastMessage.role === 'assistant') {
        //something went wrong, gotta fix
        console.error(
          `${lastMessage} is not a user message or there is no last message`
        );
        return;
      }
      dispatch(setIsStreaming(true));
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jwt: session?.access_token,
          messages: messages,
          model: conversation.model,
          search_space: search_space
        })
      });

      if (!response.ok || !response.body) {
        dispatch(setLoading(false));
        dispatch(setIsStreaming(false));

        // TODO: Implement proper error handling
        console.error(`response is not ok or there is no body`);
        return;
      }

      dispatch(setLoading(false));

      const data = response.body;

      if (!data) {
        console.error(`there is no data`);
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunkValue = decoder.decode(value);
        dispatch(
          currentConversationSlice.actions.appendLastAssistantMessage(chunkValue)
        );
      }
      dispatch(setLoading(false));
      dispatch(setIsStreaming(false));
      const updatedConversation = getState().currentConversation.conversation!;
      const updatedLastMessage =
        updatedConversation?.messages[updatedConversation?.messages.length - 1];
      if (updatedLastMessage?.role != 'assistant') {
        console.error(
          `something went wrong, last message is not assistant message`
        );
        return;
      }
      await insertMessage(
        updatedLastMessage,
        updatedConversation.messages.length - 1,
        updatedConversation.id,
        session.user?.id
      );
    };

export const thunkRegenerateResponse =
  (session: Session, search_space: number[]): AppThunk =>
    async (dispatch, getState) => {
      dispatch(setLoading(true));

      dispatch(currentConversationSlice.actions.removeLastAssistantMessage());
      const { conversation } = getState().currentConversation;

      if (!conversation) {
        console.error(`there is no conversation, this should never happen`);
        return;
      }
      const messages = getState().currentConversation.conversation?.messages;
      if(!messages) {
        console.error(`there is no messages, this should never happen`);
        return;
      }
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || lastMessage.role === 'assistant') {
        //something went wrong, gotta fix
        console.error(
          `${lastMessage} is not a user message or there is no last message`
        );
        return;
      }
      dispatch(currentConversationSlice.actions.removeLastAssistantMessage());

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jwt: session?.access_token,
          messages: messages,
          model: conversation.model,
          search_space: search_space
        })
      });

      if (!response.ok || !response.body) {
        // TODO: Implement proper error handling
        console.error(`response is not ok or there is no body`);
        return;
      }

      dispatch(setLoading(false));

      const data = response.body;

      if (!data) {
        console.error(`there is no data`);
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder('utf-8');

      dispatch(setIsStreaming(true));
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunkValue = decoder.decode(value);
        dispatch(
          currentConversationSlice.actions.appendLastAssistantMessage(chunkValue)
        );
      }
      dispatch(setIsStreaming(false));
      const updatedConversation = getState().currentConversation.conversation!;
      const updatedLastMessage =
        updatedConversation?.messages[updatedConversation?.messages.length - 1];
      if (updatedLastMessage?.role != 'assistant') {
        console.error(
          `something went wrong, last message is not assistant message`
        );
        return;
      }
      await replaceLastMessage(
        updatedLastMessage,
        updatedConversation.messages.length - 1,
        updatedConversation.id,
      )
    };

export const optimisticCurrentConversationAction = {
  retrieveAndSelectConversation: thunkRetrieveConversationDetails,
  userSent: thunkUserSent,
  startStreaming: thunkStreamingResponse,
  regenerateResponse: thunkRegenerateResponse
};

export const {
  clearSelectedConversation,
  userSent,
  setLoading,
  setIsStreaming,
  selectCurrentConversation
} = currentConversationSlice.actions;

export const getCurrentConversationFromStore = () =>
  useAppSelector((state) => state.currentConversation);

export default currentConversationSlice.reducer;
