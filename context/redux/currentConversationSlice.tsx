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
import { addConversation, deleteConversation } from './conversationsSlice';
import { randomPlaceholderConversation } from '@/utils/app/conversation';

interface SelectedConversationState {
  conversation: Conversation | undefined;
  currentMessage: Message | undefined;
  fetchingConversation: boolean;
  messageIsStreaming: boolean;
  loading: boolean;
  stopConversation: boolean;
}

const initialState: SelectedConversationState = {
  conversation: undefined,
  currentMessage: undefined,
  fetchingConversation: false,
  messageIsStreaming: false,
  loading: false,
  stopConversation: false
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
    setMessagesInCurrentConversations: (
      state,
      action: PayloadAction<Message[]>
    ) => {
      if (state.conversation) state.conversation.messages = action.payload;
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
          role: 'assistant',
          index: messages.length
        });
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
    clearLastAssistantMessage: (state) => {
      const { conversation } = state;
      if (!conversation) return;
      const messages = conversation.messages;
      if (!messages) return;
      const lastMessage = messages[messages.length - 1];
      if (lastMessage === undefined || lastMessage.role !== 'assistant') return;
      messages.pop();
    },
    setFetchingConversation: (state, action: PayloadAction<boolean>) => {
      state.fetchingConversation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.messageIsStreaming = action.payload;
    },
    setStopConversation: (state, action: PayloadAction<boolean>) => {
      state.stopConversation = action.payload;
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
    dispatch(setFetchingConversation(true));
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
    } finally {
      dispatch(setFetchingConversation(false));
    }
  };

const thunkUserSent =
  (content: string, user_id: string): AppThunk =>
  async (dispatch, getState) => {
    let { conversation } = getState().currentConversation;
    const newConversation = conversation === undefined;

    if (newConversation) {
      conversation = randomPlaceholderConversation();
      dispatch(addConversation(conversation));
      dispatch(selectCurrentConversation(conversation));
    }

    const message: Message = {
      content,
      role: 'user',
      index: newConversation ? 0 : conversation!.messages.length
    };

    // TODO: Remove this
    console.log('userSent', message);

    dispatch(userSent(message));
    dispatch(setLoading(true));

    // Show empty assistant message to render loading animation
    dispatch(currentConversationSlice.actions.appendLastAssistantMessage(''));

    // Create conversation in db
    if (newConversation) {
      try {
        await createConversation(conversation!);
      } catch (e) {
        // Delete conversation which failed to upload
        dispatch(setLoading(false));
        dispatch(clearSelectedConversation());
        dispatch(deleteConversation(conversation!));
        console.error('Failed to create conversation in database');
        return;
      }
    }

    const messages = conversation!.messages;
    try {
      // Insert message to db
      await insertMessage(message, conversation!.id, user_id);
    } catch (e: any) {
      dispatch(setLoading(false));
      // Clear last two messages in the conversation
      dispatch(setMessagesInCurrentConversations(messages.slice(0, -2)));
      // TODO: ERROR: Failed to sync message history with database
      console.error('Failed to sync message history with database');
    }
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
    if (!lastMessage) {
      //something went wrong, gotta fix
      console.error('There is no last message');
      return;
    }
    dispatch(setIsStreaming(true));
    const controller = new AbortController();
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
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

    let done = false;

    while (!done) {
      if (getState().currentConversation.stopConversation) {
        controller.abort();
        done = true;
        break;
      }

      const { value, done: doneReading } = await reader.read();
      done = doneReading;
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
    if (getState().currentConversation.stopConversation) {
      // Change stop conversation response back to false
      dispatch(setStopConversation(false));

      // Clear last assistant message if the stream was stopped
      if (updatedLastMessage.content === '') {
        dispatch(clearLastAssistantMessage());
        return;
      }
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
  setStopConversation,
  selectCurrentConversation,
  setMessagesInCurrentConversations,
  clearLastAssistantMessage,
  setFetchingConversation
} = currentConversationSlice.actions;

export const getCurrentConversationFromStore = () =>
  useAppSelector((state) => state.currentConversation);

export default currentConversationSlice.reducer;
