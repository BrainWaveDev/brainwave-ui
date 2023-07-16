import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Conversation,
  ConversationSummary,
  Message,
  RequestBody
} from '@/types/chat';
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
import { optimisticErrorActions } from './errorSlice';
import { defaultPrompt } from '@/utils/app/prompts';

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
        throw Error('No conversation found');
      }
      conversation.messages.push(action.payload);
      state.conversation = conversation;
    },
    appendLastAssistantMessage: (state, action: PayloadAction<string>) => {
      const { conversation } = state;
      if (!conversation) {
        throw Error('No conversation found');
      }
      const messages = conversation.messages;
      if (!messages) {
        throw Error('No messages found');
      }
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) {
        throw Error('No last message found');
      }
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
      if (!conversation) {
        throw Error('No conversation found');
      }
      const messages = conversation.messages;
      if (!messages) {
        throw Error('No messages found');
      }
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) {
        throw Error('No last message found');
      }
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
      if (!conversation) {
        throw Error('No conversation found');
      }
      const messages = conversation.messages;
      if (!messages) {
        throw Error('No messages found');
      }
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
      if (!conversation) {
        throw Error('No conversation found');
      }
      const messages = conversation?.messages;
      if (!messages) {
        throw Error('No messages found');
      }
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
    },
    selectPrompt: (state, action: PayloadAction<number>) => {
      const { conversation } = state;
      if (!conversation) throw Error('No conversation found');
      else conversation.promptId = action.payload;
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
        dispatch(
          optimisticErrorActions.addErrorWithTimeout(
            'Failed to retrieve conversation details'
          )
        );
        dispatch(clearSelectedConversation());
      } finally {
        dispatch(setFetchingConversation(false));
      }
    };

const thunkSelectPrompt =
  (promptId: number): AppThunk =>
    async (dispatch, getState) => {
      const { currentConversation, prompts } = getState();
      if (!currentConversation.conversation) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }
      const prompt = prompts.prompts.find((p) => p.id === promptId);
      dispatch(
        currentConversationSlice.actions.selectPrompt(
          prompt ? prompt.id : defaultPrompt.id
        )
      );
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
          dispatch(
            optimisticErrorActions.addErrorWithTimeout(
              'Failed to create conversation'
            )
          );
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
        dispatch(
          optimisticErrorActions.addErrorWithTimeout(
            'Failed to update conversation messages'
          )
        );
      }
    };

export const thunkStreamingResponse =
  (session: Session, search_space: number[]): AppThunk =>
    async (dispatch, getState) => {
      if (!getState().loading) dispatch(setLoading(true));

      const { conversation } = getState().currentConversation;
      if (!conversation) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }
      const messages = [...conversation.messages];
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      } else if (lastMessage.content === '' && lastMessage.role === 'assistant') {
        // Remove empty assistant message
        messages.pop();
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
          search_space: search_space,
          promptId: conversation.promptId
        } as RequestBody)
      });

      if (!response.ok || !response.body) {

        dispatch(setLoading(false));
        dispatch(setIsStreaming(false));
        if (response.status === 429) {
          dispatch(
            optimisticErrorActions.addErrorWithTimeout(
              'Too many requests, please try again later'
            )
          );
        } else {
          dispatch(
            optimisticErrorActions.addErrorWithTimeout(
              'Failed to get response from the server'
            )
          );
        }
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
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
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

      try {
        await insertMessage(
          updatedLastMessage,
          updatedConversation.id,
          session.user?.id
        );
      } catch (e) {
        dispatch(
          optimisticErrorActions.addErrorWithTimeout(
            'Failed to update conversation messages'
          )
        );
      }
    };

export const thunkRegenerateResponse =
  (session: Session, search_space: number[]): AppThunk =>
    async (dispatch, getState) => {
      dispatch(setLoading(true));

      dispatch(currentConversationSlice.actions.removeLastAssistantMessage());
      const { conversation } = getState().currentConversation;

      if (!conversation) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }
      const messages = getState().currentConversation.conversation?.messages;
      if (!messages) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || lastMessage.role === 'assistant') {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
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
        } as RequestBody)
      });

      if (!response.ok || !response.body) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }

      dispatch(setLoading(false));

      const data = response.body;

      if (!data) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Server error'));
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
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }
      try {
        await replaceLastMessage(
          updatedLastMessage,
          updatedConversation.messages.length - 1,
          updatedConversation.id
        );
      } catch (e) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Server error'));
      }
    };

export const optimisticCurrentConversationAction = {
  retrieveAndSelectConversation: thunkRetrieveConversationDetails,
  userSent: thunkUserSent,
  startStreaming: thunkStreamingResponse,
  regenerateResponse: thunkRegenerateResponse,
  selectConversationPrompt: thunkSelectPrompt
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
  setFetchingConversation,
  selectPrompt
} = currentConversationSlice.actions;

export const getCurrentConversationFromStore = () =>
  useAppSelector((state) => state.currentConversation);

export default currentConversationSlice.reducer;
