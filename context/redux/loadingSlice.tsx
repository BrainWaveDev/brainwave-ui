/**
 * Piece state that reflects the loading state when application is updating state.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from './store';

export const enum LoadingTrigger {
  FetchingDocuments = 'fetchingDocuments',
  // UploadingDocuments = 'uploadingDocuments',
  DeletingDocuments = 'deletingDocuments'
}

interface LoadingState {
  loading: boolean;
  fetchingDocuments: boolean;
  uploadingDocuments: boolean;
  deletingDocuments: boolean;
}

const initialState: LoadingState = {
  loading: false,
  fetchingDocuments: false,
  uploadingDocuments: false,
  deletingDocuments: false
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<LoadingTrigger>) => {
      const newState = { ...state };
      newState[action.payload] = true;
      return newState;
    },
    endLoading: (state, action: PayloadAction<LoadingTrigger>) => {
      const newState = { ...state };
      newState[action.payload] = false;
      return newState;
    }
  }
});

export const { startLoading, endLoading } = loadingSlice.actions;

export const getLoadingStateFromStore = (type: LoadingTrigger) =>
  useAppSelector((state) => state.loading[type]);

export default loadingSlice.reducer;
