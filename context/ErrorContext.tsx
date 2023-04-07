import { createContext, useContext, useReducer } from 'react';

export class ErrorAlert {
  message: string | JSX.Element;
  id: string;

  constructor(message: string | JSX.Element) {
    this.message = message;
    this.id = Math.random().toString().split('.')[1];
  }
}

type State = {
  errors: ErrorAlert[];
};

type Action =
  | {
      type: 'addError';
      error: ErrorAlert;
    }
  | { type: 'removeError'; id: string };

type ErrorContext = {
  errorState: State;
  dispatch: (action: Action) => void;
};

const initialState: State = {
  errors: []
};

const ErrorContext = createContext<ErrorContext>({
  errorState: initialState,
  dispatch: (action: Action) => {}
});

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'addError':
      return {
        errors: [...state.errors, action.error]
      };
    case 'removeError':
      return { errors: state.errors.filter((error) => error.id != action.id) };
    default:
      return state;
  }
};

export default function ErrorProvider({
  children
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const [errorState, dispatch] = useReducer(reducer, initialState);

  return (
    <ErrorContext.Provider value={{ errorState, dispatch }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useErrorContext() {
  return useContext(ErrorContext);
}
