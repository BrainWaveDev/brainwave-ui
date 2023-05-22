'use client'
import { Action, configureStore } from '@reduxjs/toolkit';
import folderSlice from './folderSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import conversationsSlice from './conversationsSlice';
import { ThunkAction } from 'redux-thunk';
import documentSlice from './documentSlice';

export const store = configureStore({
   reducer:{
      folders: folderSlice,
      conversations: conversationsSlice,
      documents: documentSlice,
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