'use client'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Folder } from 'types/folder'

type FoldersState  = Folder[]

const initialState = [] as FoldersState

const folderSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    addFolder(state, action: PayloadAction<Folder>) {
        return [...state, action.payload]
    },
    deleteFolder(state, action: PayloadAction<{id:number}>) {
        return state.filter(folder => folder.id !== action.payload.id)
    },
    updateFolderName(state, action: PayloadAction<{id:number,newName:string}>) {
        const folder = state.find(folder => folder.id === action.payload.id)
        if(folder){
            folder.name = action.payload.newName
        }
        return state
    },
  },
})

export const { addFolder, deleteFolder,updateFolderName } = folderSlice.actions
export default folderSlice.reducer