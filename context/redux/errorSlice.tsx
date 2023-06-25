import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from './store';

export type Error = {
  message: string | JSX.Element;
  id: string;
};

export const createError = (message: string | JSX.Element) => {
  return {
    message,
    id: Math.random().toString().split('.')[1]
  };
};

type ErrorState = {
  errors: Error[];
};

const initialState: ErrorState = {
  errors: []
};

const errorSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    addError: (state, action: PayloadAction<Error>) => {
      state.errors.push(action.payload);
    },
    removeError: (state, action: PayloadAction<string>) => {
      return {
        errors: state.errors.filter((error) => error.id != action.payload)
      };
      // state.errors = state.errors.filter((error) => error.id != action.payload);
    }
  }
});

export const getErrorsFromLocalStorage = () =>
  useAppSelector((state) => state.errors);

export const { addError, removeError } = errorSlice.actions;

export default errorSlice.reducer;
