'use client'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Folder } from 'types/folder'
import { randomNumberId } from '@/utils/app/createDBOperation'
import { saveFolder, deleteFolder as deleteFolderFromDB, renameFolder as renameFolderInDB  } from '@/utils/app/folders'
import { AppThunk } from './store'

type FoldersState = Folder[]

const initialState = [] as FoldersState

const folderSlice = createSlice({
    name: 'folders',
    initialState,
    reducers: {
        addFolder(state, action: PayloadAction<Folder>) {
            return [...state, action.payload]
        },
        deleteFolder(state, action: PayloadAction<{ id: number }>) {
            return state.filter(folder => folder.id !== action.payload.id)
        },
        updateFolderName(state, action: PayloadAction<{ id: number, newName: string }>) {
            const folder = state.find(folder => folder.id === action.payload.id)
            if (folder) {
                folder.name = action.payload.newName
            }
            return state
        },
        setFolders(state, action: PayloadAction<Folder[]>) {
            return action.payload
        },
        updateFolderId(state, action: PayloadAction<{ id: number, newId: number }>) {
            const folder = state.find(folder => folder.id === action.payload.id)
            if (folder) {
                folder.id = action.payload.newId
            }
            return state
        }
    },

})



const thunkCreateNewFolder =
    (user_id: string): AppThunk =>
        async (dispatch, getState) => {
            const tempFolder: Folder = {
                id: randomNumberId(),
                name: 'New Folder',
                user_id: user_id,
            }
            dispatch(addFolder(tempFolder))
            try {
                const folder = await saveFolder(tempFolder)
                dispatch(folderSlice.actions.updateFolderId({ id: tempFolder.id, newId: folder.id }))
            } catch (e) {
                dispatch(deleteFolder({ id: tempFolder.id }))
            }
        }


const thunkDeleteFolder =
    (folderId: number): AppThunk =>
        async (dispatch, getState) => {
            const folder = getState().folders.find(folder => folder.id === folderId)!
            try {
                dispatch(deleteFolder({ id: folderId }));
                await deleteFolderFromDB(folderId);
            } catch (e) {
                console.error('Failed to delete folder', e);
                dispatch(addFolder(folder))
            }
        }

const thunkUpdateFolderName =
    (folderId: number, newName: string): AppThunk =>
        async (dispatch, getState) => {
            const folder = getState().folders.find(folder => folder.id === folderId)!
            try {
                dispatch(updateFolderName({ id: folderId, newName: newName }));
                await renameFolderInDB(folderId, newName);
            } catch (e) {
                console.error('Failed to update folder name', e);
                dispatch(updateFolderName({ id: folderId, newName: folder.name }));
            }
        }


export const optimisticFoldersOperations = {
    creatrNewFolder: thunkCreateNewFolder,
    deleteFolder: thunkDeleteFolder,
    updateFolderName: thunkUpdateFolderName
}


export const { addFolder, deleteFolder, updateFolderName, setFolders } = folderSlice.actions
export default folderSlice.reducer