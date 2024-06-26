import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Conversation,
  ConversationSummary,
  Message,
  RequestBody
} from '@/types/chat';
import { AppThunk, useAppSelector } from './store';
import {
  insertMessage,
  replaceLastMessage,
  replacePlaceholderConversation,
  retrieveConversation
} from '@/utils/app/conversation';
import { Session } from '@supabase/auth-helpers-react';
import conversationsSlice, { addConversation, deleteConversation, replaceWithDBConversation } from './conversationsSlice';
import { randomPlaceholderConversation } from '@/utils/app/conversation';
import { optimisticErrorActions } from './errorSlice';
import { defaultPrompt } from '@/utils/app/prompts';
import { OpenAIModels } from '@/types/openai';

interface SelectedConversationState {
  conversation: Conversation | undefined;
  currentMessage: Message | undefined;
  showPromptSelector:boolean;
  fetchingConversation: boolean;
  messageIsStreaming: boolean;
  loading: boolean;
  stopConversation: boolean;
  disableInput: boolean
}

const initialState: SelectedConversationState = {
  conversation: undefined,
  currentMessage: undefined,
  showPromptSelector:true,
  fetchingConversation: false,
  messageIsStreaming: false,
  loading: false,
  stopConversation: false,
  disableInput: false
};

const currentConversationSlice = createSlice({
  name: 'selectedConversation',
  initialState,
  reducers: {
    selectCurrentConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversation = action.payload;
      state.showPromptSelector = false
    },
    replaceWithDBId:(state,action:PayloadAction<number>)=>{
      if (!state.conversation){
        console.error("setting id for non-exist conversation")
        return
      }
      state.conversation.id = action.payload
      state.conversation.isPlaceholder = false
    },
    clearSelectedConversation: (state) => {
      state.conversation = undefined;
    },
    showPromptSelector: (state,action)=>{
      state.showPromptSelector = action.payload
    },
    setDisableInput: (state, action) => {
      state.disableInput = action.payload
    },
    setMessagesInCurrentConversations: (
      state,
      action: PayloadAction<Message[]>
    ) => {
      if (state.conversation) state.conversation.messages = action.payload;
    },
    userSent(state, action: PayloadAction<Message>) {
      const { conversation } = state;
      if (!conversation) {
        throw Error('No conversation found');
      }
      conversation.messages.push(action.payload);
      state.conversation = conversation;
    },
    appendLastAssistantMessage: (state, action: PayloadAction<string>) => {
      const { conversation } = state;
      if (!conversation) {
        throw Error('No conversation found');
      }
      const messages = conversation.messages;
      if (!messages) {
        throw Error('No messages found');
      }
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) {
        throw Error('No last message found');
      }
      if (lastMessage.role !== 'assistant') {
        messages.push({
          content: action.payload,
          role: 'assistant',
          index: messages.length
        });
      } else {
        lastMessage.content += action.payload;
      }
    },
    removeLastAssistantMessage: (state) => {
      const { conversation } = state;
      if (!conversation) {
        throw Error('No conversation found');
      }
      const messages = conversation.messages;
      if (!messages) {
        throw Error('No messages found');
      }
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) {
        throw Error('No last message found');
      }
      if (lastMessage.role === 'assistant') {
        messages.pop();
        state.conversation = {
          ...conversation,
          messages
        };
      }
    },
    clearLastAssistantMessage: (state) => {
      const { conversation } = state;
      if (!conversation) {
        throw Error('No conversation found');
      }
      const messages = conversation.messages;
      if (!messages) {
        throw Error('No messages found');
      }
      const lastMessage = messages[messages.length - 1];
      if (lastMessage === undefined || lastMessage.role !== 'assistant') return;
      messages.pop();
    },
    setFetchingConversation: (state, action: PayloadAction<boolean>) => {
      state.fetchingConversation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.messageIsStreaming = action.payload;
    },
    setStopConversation: (state, action: PayloadAction<boolean>) => {
      state.stopConversation = action.payload;
    },
    clearSource: (state) => {
      const { conversation } = state;
      if (!conversation) {
        throw Error('No conversation found');
      }
      const messages = conversation?.messages;
      if (!messages) {
        throw Error('No messages found');
      }
      const updatedMessage = messages.map((message) => {
        if (message.role === 'assistant') {
          // Find place in the string where the source is mentioned
          const sourceIndex = message.content.indexOf('<h3>Sources</h3>');
          if (sourceIndex !== -1 && message) {
            // Remove the source from the message content
            message.content = message.content.substring(0, sourceIndex);
          }
        }
        return message;
      });
      state.conversation = {
        ...conversation,
        messages: updatedMessage
      };
    },
    selectPrompt: (state, action: PayloadAction<number>) => {
      const { conversation } = state;
      if (!conversation) throw Error('No conversation found');
      else conversation.promptId = action.payload;
    }
  }
});
const thunkRetrieveConversationDetails =
  (summary: ConversationSummary): AppThunk =>
    async (dispatch) => {
      dispatch(setFetchingConversation(true));
      const tempConversation: Conversation = {
        ...summary,
        messages: []
      };
      dispatch(selectCurrentConversation(tempConversation));
      try {
        const conversation = await retrieveConversation(tempConversation.id);
        dispatch(selectCurrentConversation(conversation));
      } catch (e) {
        dispatch(
          optimisticErrorActions.addErrorWithTimeout(
            'Failed to retrieve conversation details'
          )
        );
        dispatch(clearSelectedConversation());
      } finally {
        dispatch(setFetchingConversation(false));
      }
    };

const thunkSelectPrompt =
  (promptId: number): AppThunk =>
    async (dispatch, getState) => {
      const { currentConversation, prompts } = getState();
      if (!currentConversation.conversation) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }
      const prompt = prompts.prompts.find((p) => p.id === promptId);
      dispatch(
        currentConversationSlice.actions.selectPrompt(
          prompt ? prompt.id : defaultPrompt.id
        )
      );
    };

const thunkUserSent =
  (content: string, user_id: string): AppThunk =>
    async (dispatch, getState) => {
      let { conversation } = getState().currentConversation;
      const createNewConversation = conversation === undefined;

      if (createNewConversation) {
        conversation = randomPlaceholderConversation();
        dispatch(addConversation(conversation));
        dispatch(selectCurrentConversation(conversation));
      }

      const message: Message = {
        content,
        role: 'user',
        index: createNewConversation ? 0 : conversation!.messages.length
      };

      dispatch(userSent(message));
      dispatch(setLoading(true));

      // Show empty assistant message to render loading animation
      dispatch(currentConversationSlice.actions.appendLastAssistantMessage(''));
    };

export const thunkStreamingResponse =
  (session: Session, search_space: number[]): AppThunk =>
    async (dispatch, getState) => {
      if (!getState().loading) dispatch(setLoading(true));

      const { conversation } = getState().currentConversation;
      if (!conversation) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }
      const messages = [...conversation.messages];
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      } else if (lastMessage.content === '' && lastMessage.role === 'assistant') {
        // Remove empty assistant message
        messages.pop();
      }
      dispatch(setIsStreaming(true));
      const controller = new AbortController();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          jwt: session?.access_token,
          messages: messages,
          model: conversation.model,
          search_space: search_space,
          promptId: conversation.promptId
        } as RequestBody)
      });

      if (!response.ok || !response.body) {
        dispatch(setLoading(false));
        dispatch(setIsStreaming(false));
        dispatch(setDisableInput(true))
        if (response.status == 429) {
          dispatch(optimisticErrorActions.addErrorWithTimeout("You have ran out of request limit, please try again later"))
        } else {

          dispatch(
            optimisticErrorActions.addErrorWithTimeout(
              'Failed to get response from the server'
            )
          );
        }
        return;
      }

      dispatch(setLoading(false));

      const data = response.body;

      if (!data) {
        console.error(`there is no data`);
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder('utf-8');

      let done = false;

      while (!done) {
        if (getState().currentConversation.stopConversation) {
          controller.abort();
          done = true;
          break;
        }

        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        dispatch(
          currentConversationSlice.actions.appendLastAssistantMessage(chunkValue)
        );
      }

      dispatch(setIsStreaming(false));
      dispatch(setDisableInput(false))

      let updatedConversation = getState().currentConversation.conversation!;

      if (updatedConversation.isPlaceholder) {
        let dbConveration = await replacePlaceholderConversation(updatedConversation)
        dispatch(currentConversationSlice.actions.replaceWithDBId(dbConveration.id))
        dispatch(replaceWithDBConversation({
          tempConversationId:updatedConversation.id,
          dbConversation:{
            folderId:dbConveration.folder_id,
            id:dbConveration.id,
            model:OpenAIModels["gpt-3.5-turbo"],
            name:dbConveration.name,
            promptId:dbConveration.prompt_id || undefined
          }
        }))
        updatedConversation = getState().currentConversation.conversation!;
      }
      const updatedLastMessage =
        updatedConversation?.messages[updatedConversation?.messages.length - 1];
      const lastUserMessage = updatedConversation?.messages[updatedConversation?.messages.length - 2]
      if (updatedLastMessage?.role != 'assistant') {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }
      if (getState().currentConversation.stopConversation) {
        // Change stop conversation response back to false
        dispatch(setStopConversation(false));

        // Clear last assistant message if the stream was stopped
        if (updatedLastMessage.content === '') {
          dispatch(clearLastAssistantMessage());
          return;
        }
      }

      try {
        let updateUser = insertMessage(
          lastUserMessage,
          updatedConversation.id,
          session.user?.id
        )

        let updateAssisstent = insertMessage(
          updatedLastMessage,
          updatedConversation.id,
          session.user?.id
        );
        await Promise.all([updateUser, updateAssisstent])
      } catch (e) {
        dispatch(
          optimisticErrorActions.addErrorWithTimeout(
            'Failed to update conversation messages'
          )
        );
      }
    };

export const thunkRegenerateResponse =
  (session: Session, search_space: number[]): AppThunk =>
    async (dispatch, getState) => {
      dispatch(setLoading(true));

      dispatch(currentConversationSlice.actions.removeLastAssistantMessage());
      const { conversation } = getState().currentConversation;

      if (!conversation) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }
      const messages = getState().currentConversation.conversation?.messages;
      if (!messages) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || lastMessage.role === 'assistant') {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }

      dispatch(currentConversationSlice.actions.removeLastAssistantMessage());

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jwt: session?.access_token,
          messages: messages,
          model: conversation.model,
          search_space: search_space
        } as RequestBody)
      });

      debugger
      if (!response.ok || !response.body) {
        if (response.status === 429) {
          dispatch(optimisticErrorActions.addErrorWithTimeout('Too many requests, please try again later'))
          return;
        }
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }

      dispatch(setLoading(false));

      const data = response.body;

      if (!data) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Server error'));
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder('utf-8');

      dispatch(setIsStreaming(true));
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunkValue = decoder.decode(value);
        dispatch(
          currentConversationSlice.actions.appendLastAssistantMessage(chunkValue)
        );
      }
      dispatch(setIsStreaming(false));
      const updatedConversation = getState().currentConversation.conversation!;
      const updatedLastMessage =
        updatedConversation?.messages[updatedConversation?.messages.length - 1];
      if (updatedLastMessage?.role != 'assistant') {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Internal error'));
        return;
      }
      try {
        await replaceLastMessage(
          updatedLastMessage,
          updatedConversation.messages.length - 1,
          updatedConversation.id
        );
      } catch (e) {
        dispatch(optimisticErrorActions.addErrorWithTimeout('Server error'));
      }
    };

export const optimisticCurrentConversationAction = {
  retrieveAndSelectConversation: thunkRetrieveConversationDetails,
  userSent: thunkUserSent,
  startStreaming: thunkStreamingResponse,
  regenerateResponse: thunkRegenerateResponse,
  selectConversationPrompt: thunkSelectPrompt
};

export const {
  clearSelectedConversation,
  userSent,
  setLoading,
  setIsStreaming,
  setStopConversation,
  selectCurrentConversation,
  setMessagesInCurrentConversations,
  clearLastAssistantMessage,
  setFetchingConversation,
  selectPrompt,
  setDisableInput,
  showPromptSelector
} = currentConversationSlice.actions;

export const getCurrentConversationFromStore = () =>
  useAppSelector((state) => state.currentConversation);

export default currentConversationSlice.reducer;
