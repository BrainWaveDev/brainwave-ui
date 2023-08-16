'use client';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import {
  Conversation,
  ConversationIdentifiable,
  ConversationSummary
} from 'types/chat';
import { AppThunk, useAppSelector } from './store';
import { randomNumberId } from '@/utils/app/createDBOperation';
import { OpenAIModels } from 'types/openai';
import {
  clearAllConversations,
  replacePlaceholderConversation,
  deleteConversation as deleteConversationFromDB,
  fetchAllConversations,
  updateConversation as updateConversationDB,
  randomPlaceholderConversation
} from '@/utils/app/conversation';
import {
  clearSelectedConversation,
  selectCurrentConversation,
  showPromptSelector
} from './currentConversationSlice';
import { SupabaseClient } from '@supabase/supabase-js';
import { endLoading, LoadingTrigger, startLoading } from './loadingSlice';
import { optimisticErrorActions } from './errorSlice';

type ConversationsState = ConversationSummary[];

const initialState = [] as ConversationsState;

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    addConversation(state, action: PayloadAction<ConversationSummary>) {
      return [...state, action.payload];
    },
    setConversations(_state, action: PayloadAction<ConversationSummary[]>) {
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
        tempConversationId: number;
        dbConversation: ConversationSummary;
      }>
    ) {
      const index = state.findIndex(
        (conversation) => conversation.id === action.payload.tempConversationId
      );
      if (index !== -1) {
        state[index] = action.payload.dbConversation;
      } else {
        throw Error(
          "Couldn't find conversation with ID " +
            action.payload.tempConversationId
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

const thunkCreateNewPlaceholderConversation =
  (promptId?: number): AppThunk =>
  async (dispatch) => {
    const tempConversation: Conversation = randomPlaceholderConversation(promptId)

    dispatch(showPromptSelector(false))
    dispatch(addConversation(tempConversation));
    dispatch(selectCurrentConversation(tempConversation));
  };

const thunkDeleteConversation =
  (conversation: ConversationSummary): AppThunk =>
  async (dispatch) => {
    dispatch(deleteConversation({ id: conversation.id }));
    dispatch(clearSelectedConversation());
    try {
      await deleteConversationFromDB(conversation.id);
    } catch (e) {
      dispatch(
        optimisticErrorActions.addErrorWithTimeout(
          "Couldn't remove conversation"
        )
      );
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
    if (!originalConversation) {
      dispatch(
        optimisticErrorActions.addErrorWithTimeout(
          "Couldn't update conversation"
        )
      );
      return;
    }
    dispatch(conversationsSlice.actions.updateConversation(conversation));
    try {
      await updateConversationDB(conversation);
    } catch (e) {
      dispatch(
        optimisticErrorActions.addErrorWithTimeout(
          "Couldn't update conversation"
        )
      );
      dispatch(
        conversationsSlice.actions.updateConversation(originalConversation)
      );
    }
  };

const thunkClearConversations = (): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading(LoadingTrigger.DeletingConversations));
    await clearAllConversations();
    dispatch(clearConversations());
    dispatch(clearSelectedConversation());
  } catch (e: any) {
    dispatch(
      optimisticErrorActions.addErrorWithTimeout("Couldn't clear conversations")
    );
  } finally {
    dispatch(endLoading(LoadingTrigger.DeletingConversations));
  }
};

const thunkFetchAllConversations =
  (supabaseClient?: SupabaseClient): AppThunk =>
  async (dispatch) => {
    try {
      const conversations = await fetchAllConversations(supabaseClient);
      dispatch(setConversations(conversations));
    } catch (e) {
      dispatch(
        optimisticErrorActions.addErrorWithTimeout(
          "Couldn't fetch conversations"
        )
      );
    }
  };

const thunkInitConversations = (): AppThunk => async (dispatch, getState) => {
  try {
    await dispatch(thunkFetchAllConversations());
    const conversations = getState().conversations;
    if (conversations.length === 0) return;
    dispatch(
      selectCurrentConversation({
        ...conversations[0],
        messages: []
      })
    );
  } catch (e) {
    dispatch(
      optimisticErrorActions.addErrorWithTimeout("Couldn't fetch conversations")
    );
  }
};


export const optimisticConversationsActions = {
  createConversation: thunkCreateNewPlaceholderConversation,
  deleteConversation: thunkDeleteConversation,
  // update conversation does not update messages
  updateConversation: thunkUpdateConversation,
  clearConversations: thunkClearConversations,
  fetchAllConversations: thunkFetchAllConversations,
};

export const {
  addConversation,
  setConversations,
  deleteConversation,
  clearConversations,
  replaceWithDBConversation
} = conversationsSlice.actions;

export const getConversationsFromStorage = () =>
  useAppSelector((state) => state.conversations);

export default conversationsSlice.reducer;
