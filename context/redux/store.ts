'use client'
import {Action, applyMiddleware, configureStore} from '@reduxjs/toolkit';
import folderSlice from './folderSlice';
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import conversationsSlice from './conversationsSlice';
import thunk, { ThunkAction } from 'redux-thunk';
export const store = configureStore({
   reducer:{
      folders: folderSlice,
      conversations: conversationsSlice,
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;