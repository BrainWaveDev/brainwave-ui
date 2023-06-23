import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, useAppSelector } from './store';
import { deleteDocuments, fetchAllDocuments } from '@/utils/app/documents';
import { Document } from '@/types/document';
import { SupabaseClient } from '@supabase/supabase-js';
import { endLoading, LoadingTrigger, startLoading } from './loadingSlice';
import { optimisticErrorActions } from './errorSlice';

type DocumentState = Document[];

const initialState: DocumentState = [];

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setAllDocuments: (state, action) => {
      return action.payload;
    },
    deleteDocuments: (state, action: PayloadAction<number[]>) => {
      return state.filter((document) => !action.payload.includes(document.id));
    },
    addDocument: (state, action: PayloadAction<Document>) => {
      return [...state, action.payload];
    },
    addAllDocuments: (state, action: PayloadAction<Document[]>) => {
      return [...state, ...action.payload];
    }
  }
});

const thunkAddAllDocuments = (supabaseClient?: SupabaseClient): AppThunk => {
  return async (dispatch) => {
    dispatch(startLoading(LoadingTrigger.FetchingDocuments));
    try {
      const documents = await fetchAllDocuments(supabaseClient);
      dispatch(documentSlice.actions.setAllDocuments(documents));
    } catch (e) {
      dispatch(
        optimisticErrorActions.addErrorWithTimeout('Failed to fetch documents')
      );
      console.error('ERROR: Failed to fetch documents');
    } finally {
      dispatch(endLoading(LoadingTrigger.FetchingDocuments));
    }
  };
};

const thunkDeleteDocuments = (document_ids: number[]): AppThunk => {
  return async (dispatch, getState) => {
    const documents = getState().documents.filter((document) =>
      document_ids.includes(document.id)
    );
    if (!documents) {
      dispatch(
        optimisticErrorActions.addErrorWithTimeout(
          'Specified documents do not exist'
        )
      );
      console.error('ERROR: Specified documents do not exist');
      return;
    }
    dispatch(startLoading(LoadingTrigger.DeletingDocuments));
    try {
      dispatch(documentSlice.actions.deleteDocuments(document_ids));
      await deleteDocuments(document_ids);
    } catch (e) {
      dispatch(documentSlice.actions.addAllDocuments(documents));
      dispatch(
        optimisticErrorActions.addErrorWithTimeout('Failed to delete documents')
      );
      console.error('ERROR: Failed to delete specified documents');
    } finally {
      dispatch(endLoading(LoadingTrigger.DeletingDocuments));
    }
  };
};

export const optimisticDocumentActions = {
  fetchAllDocuments: thunkAddAllDocuments,
  deleteDocuments: thunkDeleteDocuments
};

export const getDocumentsFromStore = () =>
  useAppSelector((state) => state.documents);

export default documentSlice.reducer;
export const { setAllDocuments } = documentSlice.actions;
