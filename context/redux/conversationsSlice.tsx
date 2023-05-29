'use client';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  Conversation,
  ConversationIdentifiable,
  ConversationSummary
} from 'types/chat';
import { AppThunk, useAppSelector } from './store';
import { randomNumberId } from '@/utils/app/createDBOperation';
import { OpenAIModels } from 'types/openai';
import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/prompts';
import {
  clearAllConversations,
  createConversation,
  deleteConversation as deleteConversationFromDB,
  fetchAllConversations,
  updateConversation as updateConversationDB
} from '@/utils/app/conversation';
import {
  clearSelectedConversation,
  selectCurrentConversation
} from './currentConversationSlice';
import { SupabaseClient } from '@supabase/supabase-js';

type ConversationsState = ConversationSummary[];

const initialState = [] as ConversationsState;

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    addConversation(state, action: PayloadAction<ConversationSummary>) {
      return [...state, action.payload];
    },
    setConversations(state, action: PayloadAction<ConversationSummary[]>) {
      return action.payload;
    },
    deleteConversation(state, action: PayloadAction<{ id: number }>) {
      return state.filter(
        (conversation) => conversation.id !== action.payload.id
      );
    },
    updateConversation(state, action: PayloadAction<ConversationSummary>) {
      return state.map((conversation) => {
        // Substitute the updated conversation
        if (conversation.id === action.payload.id) {
          return {
            ...conversation,
            ...action.payload
          };
        } else {
          return conversation;
        }
      });
    },
    clearConversations() {
      return [];
    },
    replaceWithDBConversation(
      state,
      action: PayloadAction<{
        tempConversation: ConversationIdentifiable;
        dbConversation: ConversationSummary;
      }>
    ) {
      const index = state.findIndex(
        (conversation) => conversation.id === action.payload.tempConversation.id
      );
      if (index !== -1) {
        state[index] = action.payload.dbConversation;
      } else {
        // TODO: Throw error
        console.error(
          "Couldn't find conversation with ID " +
            action.payload.tempConversation.id
        );
      }
    }
  }
});

function updateConversationProperty<K extends keyof ConversationSummary>(
  conversation: ConversationSummary,
  key: K,
  value: ConversationSummary[K]
) {
  conversation[key] = value;
}

const thunkCreateNewConversation = (): AppThunk => async (dispatch) => {
  const tempConversation: Conversation = {
    id: randomNumberId(),
    name: 'New Conversation',
    model: OpenAIModels['gpt-3.5-turbo'],
    folderId: null,
    prompt: DEFAULT_SYSTEM_PROMPT,
    messages: []
  };

  dispatch(addConversation(tempConversation));
  dispatch(selectCurrentConversation(tempConversation));
  try {
    const conversation = await createConversation(tempConversation);
    dispatch(
      conversationsSlice.actions.replaceWithDBConversation({
        tempConversation,
        dbConversation: conversation
      })
    );
    dispatch(selectCurrentConversation(conversation));
  } catch (e) {
    dispatch(deleteConversation({ id: tempConversation.id }));
  }
};

const thunkDeleteConversation =
  (conversation: ConversationSummary): AppThunk =>
  async (dispatch) => {
    dispatch(deleteConversation({ id: conversation.id }));
    dispatch(clearSelectedConversation());
    try {
      await deleteConversationFromDB(conversation.id);
    } catch (e) {
      dispatch(addConversation(conversation));
    }
  };

const thunkUpdateConversation =
  (conversation: ConversationSummary): AppThunk =>
  async (dispatch, getState) => {
    // Find original conversation
    const originalConversation = getState().conversations.find(
      (c) => c.id === conversation.id
    );
    // TODO: This should throw an error
    if (!originalConversation) {
      console.error('Conversation not found');
      return;
    }
    dispatch(conversationsSlice.actions.updateConversation(conversation));
    try {
      await updateConversationDB(conversation);
    } catch (e) {
      dispatch(
        conversationsSlice.actions.updateConversation(originalConversation)
      );
    }
  };

const thunkClearConversations = (): AppThunk => async (dispatch) => {
  try {
    await clearAllConversations();
    dispatch(clearConversations());
  } catch (e: any) {
    // TODO: Show errors to user
    console.error(e.message);
  }
};

const thunkFetchAllConversations =
  (supabaseClient?: SupabaseClient): AppThunk =>
  async (dispatch) => {
    const conversations = await fetchAllConversations(supabaseClient);
    dispatch(setConversations(conversations));
  };

const thunkInitConversations = (): AppThunk => async (dispatch, getState) => {
  await dispatch(thunkFetchAllConversations());
  const conversations = getState().conversations;
  if (conversations.length === 0) return;
  dispatch(
    selectCurrentConversation({
      ...conversations[0],
      messages: []
    })
  );
};

export const optimisticConversationsActions = {
  createConversation: thunkCreateNewConversation,
  deleteConversation: thunkDeleteConversation,
  // update conversation does not update messages
  updateConversation: thunkUpdateConversation,
  clearConversations: thunkClearConversations,
  fetchAllConversations: thunkFetchAllConversations,
  initAllConversations: thunkInitConversations
};

export const {
  addConversation,
  setConversations,
  deleteConversation,
  updateConversation,
  clearConversations,
  replaceWithDBConversation
} = conversationsSlice.actions;

export const getConversationsFromStorage = () =>
  useAppSelector((state) => state.conversations);

export default conversationsSlice.reducer;
