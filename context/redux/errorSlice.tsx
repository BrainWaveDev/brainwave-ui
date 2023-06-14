import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, useAppSelector } from './store';
import { SupabaseClient } from '@supabase/supabase-js';
import { endLoading, LoadingTrigger, startLoading } from './loadingSlice';

enum ErrorType {
    CHAT_API_ERROR = 'CHAT_API_ERROR',
    FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
}

type ErrorState<E extends ErrorType> = {
    error: E;
    isActive: boolean;
}

type errorStates = {
    CHAT_API_ERROR: ErrorState<ErrorType.CHAT_API_ERROR>;
    FILE_UPLOAD_ERROR: ErrorState<ErrorType.FILE_UPLOAD_ERROR>;
}

const initialState: errorStates = {
    CHAT_API_ERROR: {
        error: ErrorType.CHAT_API_ERROR,
        isActive: false,
    },
    FILE_UPLOAD_ERROR: {
        error: ErrorType.FILE_UPLOAD_ERROR,
        isActive: false,
    },
};

const errorSlice = createSlice({
    name: 'errors',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<{errorType: keyof typeof initialState, value: boolean}>) => {
            state[action.payload.errorType].isActive = action.payload.value;
        },
    },
});

export const { setError } = errorSlice.actions;
export default errorSlice.reducer;