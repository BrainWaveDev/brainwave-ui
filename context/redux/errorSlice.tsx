import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector, AppThunk } from './store';
import { wait } from '@/utils/helpers';

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
    }
  }
});

const thunkAddErrorWithTimeout =
  (message: string | JSX.Element, timeout: number = 3000): AppThunk =>
  async (dispatch) => {
    if (typeof message === 'string') {
      console.error('ERROR: ' + message);
    }
    const error = createError(message);
    dispatch(addError(error));
    await wait(timeout);
    dispatch(removeError(error.id));
  };

// Clears all errors with a timeout between each clearance
const thunkClearAllErrorsWithTimeout =
  (timeout: number = 1000): AppThunk =>
  async (dispatch, getState) => {
    const { errors } = getState().errors;
    const errorIds = errors.map((error) => error.id);
    for (const id of errorIds) {
      dispatch(removeError(id));
      await wait(timeout);
    }
  };

export const getErrorsFromLocalStorage = () =>
  useAppSelector((state) => state.errors);

export const { addError, removeError } = errorSlice.actions;

export const optimisticErrorActions = {
  addErrorWithTimeout: thunkAddErrorWithTimeout,
  clearErrorsWithTimeout: thunkClearAllErrorsWithTimeout
};

export default errorSlice.reducer;
