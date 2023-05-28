'use client';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Folder } from 'types/folder';
import { randomNumberId } from '@/utils/app/createDBOperation';
import {
  saveFolder,
  deleteFolder as deleteFolderFromDB,
  renameFolder as renameFolderInDB,
  fetchAllFolders
} from '@/utils/app/folders';
import { AppThunk, useAppSelector } from './store';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSessionContext } from '@supabase/auth-helpers-react';

type FoldersState = Folder[];

const initialState = [] as FoldersState;

const folderSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    addFolder(state, action: PayloadAction<Folder>) {
      return [...state, action.payload];
    },
    deleteFolder(state, action: PayloadAction<{ id: number }>) {
      return state.filter((folder) => folder.id !== action.payload.id);
    },
    updateFolderName(
      state,
      action: PayloadAction<{ id: number; newName: string }>
    ) {
      const folder = state.find((folder) => folder.id === action.payload.id);
      if (folder) {
        folder.name = action.payload.newName;
      } else {
        // TODO: Show error to user
        console.error('Failed to find folder with ID: ', action.payload.id);
      }
    },
    setFolders(state, action: PayloadAction<Folder[]>) {
      return action.payload;
    },
    updateFolderId(
      state,
      action: PayloadAction<{ id: number; newId: number }>
    ) {
      const folder = state.find((folder) => folder.id === action.payload.id);
      if (folder) {
        folder.id = action.payload.newId;
      } else {
        // TODO: Show error to user
        console.error('Failed to find folder with ID: ', action.payload.id);
      }
    }
  }
});

const thunkCreateNewFolder = (): AppThunk => async (dispatch) => {
  // TODO: Show errors to the user
  // Get user ID
  const { session } = useSessionContext();
  const userId = session?.user?.id;
  if (!userId) {
    console.error('Failed to retrieve user ID from session');
    return;
  }

  const tempFolder: Folder = {
    id: randomNumberId(),
    name: 'New Folder',
    user_id: userId
  };
  dispatch(addFolder(tempFolder));

  try {
    const folder = await saveFolder(tempFolder);
    dispatch(
      folderSlice.actions.updateFolderId({
        id: tempFolder.id,
        newId: folder.id
      })
    );
  } catch (e: any) {
    dispatch(deleteFolder(tempFolder));
    console.error(
      'Failed to create new folder with the following error: ',
      e.message
    );
  }
};

const thunkDeleteFolder =
  (folderId: number): AppThunk =>
  async (dispatch, getState) => {
    const folder = (getState().folders as Folder[]).find(
      (folder) => folder.id === folderId
    )!;
    try {
      dispatch(deleteFolder({ id: folderId }));
      await deleteFolderFromDB(folderId);
    } catch (e) {
      console.error('Failed to delete folder', e);
      dispatch(addFolder(folder));
    }
  };

const thunkUpdateFolderName =
  (folderId: number, newName: string): AppThunk =>
  async (dispatch, getState) => {
    const folder = (getState().folders as Folder[]).find(
      (folder) => folder.id === folderId
    )!;
    try {
      dispatch(updateFolderName({ id: folderId, newName: newName }));
      await renameFolderInDB(folderId, newName);
    } catch (e) {
      console.error('Failed to update folder name', e);
      dispatch(updateFolderName({ id: folderId, newName: folder.name }));
    }
  };

const thunkFetchAllFolders =
  (supabaseClient?: SupabaseClient): AppThunk =>
  async (dispatch) => {
    const folders = await fetchAllFolders(supabaseClient);
    dispatch(setFolders(folders));
  };

export const optimisticFoldersAction = {
  createNewFolder: thunkCreateNewFolder,
  deleteFolder: thunkDeleteFolder,
  updateFolderName: thunkUpdateFolderName,
  fetchAllFolders: thunkFetchAllFolders
};

export const { addFolder, deleteFolder, updateFolderName, setFolders } =
  folderSlice.actions;

export const getFoldersFromStorage = () =>
  useAppSelector((state) => state.folders);

export default folderSlice.reducer;
