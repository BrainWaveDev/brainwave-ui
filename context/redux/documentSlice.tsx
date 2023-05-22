'use client'
import { createSlice } from '@reduxjs/toolkit'
import { AppThunk } from './store'
import { deleteDocuments, fetchAllDocuments } from '@/utils/app/documents'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Document } from '@/types/document'

type DocumentState = Document[]

const initialState = [] as DocumentState

const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setAllDocuments: (state, action) => {
            return action.payload
        },
        deleteDocuments: (state, action: PayloadAction<number[]>) => {
            return state.filter(document => !action.payload.includes(document.id))
        },
        addDocument: (state, action: PayloadAction<Document>) => {
            return [...state, action.payload]
        },
        addAllDocuments: (state, action: PayloadAction<Document[]>) => {
            return [...state, ...action.payload]
        }
    },
})

const thunkAddAllDocuments = (user_id: string): AppThunk => {
    return async (dispatch, getState) => {
        try {
            const documents = await fetchAllDocuments(user_id)
            dispatch(documentSlice.actions.setAllDocuments(documents))
        } catch (e) {
            console.log(e)
        }
    }
}

const thunkDeleteDocuments = (document_ids: number[]): AppThunk => {
    return async (dispatch, getState) => {
        const documents = getState().documents.filter(document => document_ids
            .includes(document.id))
        if (!documents) {
            return
        }
        try {
            dispatch(documentSlice.actions.deleteDocuments(document_ids))
            deleteDocuments(document_ids)
        } catch (e) {
            dispatch(documentSlice.actions.addAllDocuments(documents))
        }

    }
}



export const optimisticDocumentActions = {
    fetchAllDocuments: thunkAddAllDocuments,
    deleteDocuments: thunkDeleteDocuments,
}

export default documentSlice.reducer
export const { } = documentSlice.actions