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
import { optimisticErrorActions } from './errorSlice';

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
        throw Error('Failed to find folder with ID: ' + action.payload.id);
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
        throw Error('Failed to find folder with ID: ' + action.payload.id);
      }
    }
  }
});

const thunkCreateNewFolder =
  (userId: string): AppThunk =>
  async (dispatch) => {
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
      dispatch(
        optimisticErrorActions.addErrorWithTimeout(
          'Failed to create new folder'
        )
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
      dispatch(
        optimisticErrorActions.addErrorWithTimeout('Failed to delete folder')
      );
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
      dispatch(
        optimisticErrorActions.addErrorWithTimeout(
          'Failed to update folder name'
        )
      );
      dispatch(updateFolderName({ id: folderId, newName: folder.name }));
    }
  };

const thunkFetchAllFolders =
  (supabaseClient?: SupabaseClient): AppThunk =>
  async (dispatch) => {
    try {
      const folders = await fetchAllFolders(supabaseClient);
      dispatch(setFolders(folders));
    } catch (e) {
      dispatch(
        optimisticErrorActions.addErrorWithTimeout(
          'Failed to get a list of folders'
        )
      );
    }
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
