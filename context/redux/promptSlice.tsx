import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, useAppSelector } from './store';
import { Prompt } from '@/types/prompt';
import { fetchPrompts } from '@/utils/app/prompts';
import { defaultPrompt as fallbackDefaultPrompt } from '@/utils/app/prompts';
import { SupabaseClient } from '@supabase/supabase-js';
import { optimisticErrorActions } from './errorSlice';

interface PromptState {
  defaultPrompt: Prompt;
  prompts: Prompt[];
}

const initialState: PromptState = {
  defaultPrompt: fallbackDefaultPrompt,
  prompts: []
};

const promptSlice = createSlice({
  name: 'prompts',
  initialState,
  reducers: {
    setDefaultPrompt: (state, action: PayloadAction<Prompt>) => {
      state.defaultPrompt = action.payload;
    },
    setPrompts: (state, action: PayloadAction<Prompt[]>) => {
      state.prompts = action.payload;
    }
  }
});

const thunkFetchPrompts = (supabaseAdmin: SupabaseClient): AppThunk => {
  return async (dispatch) => {
    try {
      // Fetch prompts and remove content to avoid exposing it to the client
      let prompts: Prompt[] = (await fetchPrompts(supabaseAdmin)).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description
      }));

      // Find the default prompt and remove it from the prompts array
      let defaultPrompt = prompts.find((p) => p.name === 'Default');
      if (defaultPrompt) {
        prompts = prompts.filter((p) => p.id !== defaultPrompt!.id);
      } else {
        defaultPrompt = fallbackDefaultPrompt;
      }

      dispatch(promptSlice.actions.setDefaultPrompt(defaultPrompt));
      dispatch(promptSlice.actions.setPrompts(prompts));
    } catch (e) {
      dispatch(
        optimisticErrorActions.addErrorWithTimeout('Failed to fetch prompts')
      );
    }
  };
};

export const { setPrompts } = promptSlice.actions;

export const optimisticPromptActions = {
  initializePrompts: thunkFetchPrompts
};

export const getPromptsFromStorage = () =>
  useAppSelector((state) => state.prompts);

export default promptSlice.reducer;
