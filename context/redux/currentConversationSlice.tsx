import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, ConversationSummary, Message } from '@/types/chat';
import { AppThunk, useAppSelector } from './store';
import { insertMessage, retrieveConversation } from '@/utils/app/conversation';
import { Session } from '@supabase/auth-helpers-react';

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
  loading: true
};

const currentConversationSlice = createSlice({
  name: 'selectedConversation',
  initialState,
  reducers: {
    updateCurrentConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversation = action.payload;
    },
    selectCurrentConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversation = action.payload;
    },
    clearSelectedConversation: (state) => {
      state.conversation = undefined;
    },
    userSent(state, action: PayloadAction<Message>) {
      const { conversation } = state;
      if (!conversation) return;
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

export const thunkUserSent =
  (message: Message, user_id: string): AppThunk =>
  async (dispatch, getState) => {
    dispatch(userSent(message));
    try {
      const { conversation } = getState().currentConversation;
      if (!conversation) return;

      const messages = conversation.messages;
      // insert message to db
      await insertMessage(
        message,
        messages.length - 1,
        conversation.id,
        user_id
      );
    } catch (e) {
      // TODO: better error handling
      console.error(e);
      dispatch(clearSelectedConversation());
    }
  };

export const thunkStreamingResponse =
  (session: Session, search_space: number[]): AppThunk =>
  async (dispatch, getState) => {
    const { conversation } = getState().currentConversation;

    if (!conversation) return;
    const messages = conversation.messages;
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role === 'assistant') {
      //something went wrong, gotta fix
      console.error(
        `${lastMessage} is not a user message or there is no last message`
      );
      return;
    }
    dispatch(currentConversationSlice.actions.setIsStreaming(true));
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
      console.error(`response is not ok or there is no body`);
    }

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
    dispatch(currentConversationSlice.actions.setIsStreaming(false));
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

export const optimisticCurrentConversationAction = {
  retrieveAndSelectConversation: thunkRetrieveConversationDetails,
  userSent: thunkUserSent,
  startStreaming: thunkStreamingResponse
};

export const {
  clearSelectedConversation,
  userSent,
  selectCurrentConversation
} = currentConversationSlice.actions;

export const getCurrentConversationStateFromStore = () =>
  useAppSelector((state) => state.currentConversation);

export default currentConversationSlice.reducer;
