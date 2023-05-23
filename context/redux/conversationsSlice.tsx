'use client'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Conversation, ConversationIdentifiable, ConversationSummary } from 'types/chat'
import { AppThunk } from './store';
import { randomNumberId } from '@/utils/app/createDBOperation';
import { OpenAIModels } from 'types/openai';
import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/prompts';
import { clearAllConversations, createConversation, deleteConversation as deleteConversationFromDB, fetchAllConversations, saveConversation,updateConversation as updateConvesationDB } from '@/utils/app/conversation';
import { clearSelectedConversation, selectCurrentConversation } from './currentConversationSlice';

type ConversationsState = ConversationSummary[]

const initialState = [] as ConversationsState

const conversationsSlice = createSlice({
    name: 'conversations',
    initialState,
    reducers: {
        addCoverstation(state, action: PayloadAction<ConversationSummary>) {
            return [action.payload, ...state]
        },
        setConversations(state, action: PayloadAction<ConversationSummary[]>) {
            return action.payload
        },
        deleteConversation(state, action: PayloadAction<{ id: number }>) {
            return state.filter(conversation => conversation.id !== action.payload.id)
        },
        updateConversation(state, action: PayloadAction< ConversationSummary >) {
            const conversation = state.find(conversation => conversation.id === action.payload.id)
            if (conversation) {
                conversation.name = action.payload.name
                conversation.model = action.payload.model
                conversation.prompt = action.payload.prompt
                conversation.folderId = action.payload.folderId
            }
            return state
          },
          
        clearConversations(state) {
            return []
        },
        replaceWithDBConversation(state, action: PayloadAction<{tempConversation:ConversationIdentifiable ,dbCoversation:ConversationSummary}>) {
            const index = state.findIndex(conversation => conversation.id === action.payload.tempConversation.id)
            if (index !== -1) {
                state[index] = action.payload.dbCoversation
            }
            return state
        }
    },
})

function updateConversationProperty<K extends keyof ConversationSummary>(
  conversation: ConversationSummary, 
  key: K, 
  value: ConversationSummary[K]
) {
  conversation[key] = value;
}


const thunkCreateNewConversation =
    (user_id: string): AppThunk =>
        async (dispatch, getState) => {
            const tempConversation: Conversation = {
                id: randomNumberId(),
                name: 'New Conversation',
                model: OpenAIModels['gpt-3.5-turbo'],
                folderId: null,
                prompt: DEFAULT_SYSTEM_PROMPT,
                messages: [],
            }
            dispatch(addCoverstation(tempConversation))
            try {
                const conversation = await createConversation(tempConversation,user_id)
                dispatch(conversationsSlice.actions.replaceWithDBConversation({tempConversation,dbCoversation:conversation}))
                dispatch(selectCurrentConversation(conversation))
            }catch(e){
                dispatch(deleteConversation({ id: tempConversation.id }))
            }
        }

const thunkDeleteConversation =
    (conversation: ConversationSummary): AppThunk => 
    async (dispatch, getState) => {
        dispatch(deleteConversation({ id: conversation.id }))
        dispatch(clearSelectedConversation())
        try {
            await deleteConversationFromDB(conversation.id)
        } catch (e) {
            dispatch(addCoverstation(conversation))
        }
    }

const thunkUpdateConversation =
    (conversation: ConversationSummary): AppThunk =>
        async (dispatch, getState) => {
            dispatch(conversationsSlice.actions.updateConversation(conversation))
            try {
                await updateConvesationDB(conversation)
            } catch (e) {
                dispatch(conversationsSlice.actions.updateConversation(conversation))
            }
        }

const thunkClearConversations =
    (user_id:string): AppThunk =>
        async (dispatch, getState) => {
            const conversations = getState().conversations
            dispatch(clearConversations())
            try {
                await clearAllConversations(user_id)
            }
            catch (e) {
                dispatch(setConversations(conversations))
            }
        }

const thunkFetchAllConversations =
    (user_id:string): AppThunk =>
        async (dispatch, getState) => {
            const conversations = await fetchAllConversations(user_id)
            dispatch(setConversations(conversations))
            
        }
const thunkInitConversations =
    (user_id:string): AppThunk =>
        async (dispatch, getState) => {
            await dispatch(thunkFetchAllConversations(user_id))
            const conversations = getState().conversations
            if (conversations.length === 0) return
            dispatch(selectCurrentConversation({
                ...conversations[0],
                messages: []
            }))
        }

export const optimisticConversationsActions = {
    createConversation: thunkCreateNewConversation,
    deleteConversation: thunkDeleteConversation,
    // update conversation does not update messages
    updateConversation: thunkUpdateConversation,
    clearConversations: thunkClearConversations,
    fetchAllConversations: thunkFetchAllConversations,
    initAllConversations: thunkInitConversations
}


export const {
    addCoverstation,
    setConversations,
    deleteConversation,
    updateConversation,
    clearConversations,
    replaceWithDBConversation
} = conversationsSlice.actions
export default conversationsSlice.reducer