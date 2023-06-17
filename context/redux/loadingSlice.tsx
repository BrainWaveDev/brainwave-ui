/**
 * Piece of state that reflects the loading state when application is updating state.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from './store';

export const enum LoadingTrigger {
  FetchingDocuments = 'fetchingDocuments',
  // UploadingDocuments = 'uploadingDocuments',
  DeletingDocuments = 'deletingDocuments',
  DeletingConversations = 'deletingConversations'
}

interface LoadingState {
  loading: boolean;
  fetchingDocuments: boolean;
  uploadingDocuments: boolean;
  deletingDocuments: boolean;
  deletingConversations: boolean;
}

const initialState: LoadingState = {
  loading: false,
  fetchingDocuments: false,
  uploadingDocuments: false,
  deletingDocuments: false,
  deletingConversations: false
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<LoadingTrigger>) => {
      state[action.payload] = true;
    },
    endLoading: (state, action: PayloadAction<LoadingTrigger>) => {
      state[action.payload] = false;
    }
  }
});

export const { startLoading, endLoading } = loadingSlice.actions;

export const getLoadingStateFromStore = (type: LoadingTrigger) =>
  useAppSelector((state) => state.loading[type]);

export default loadingSlice.reducer;
