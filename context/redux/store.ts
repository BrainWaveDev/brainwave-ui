import { Action, combineReducers, configureStore } from '@reduxjs/toolkit';
import folderSlice, { optimisticFoldersAction } from './folderSlice';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import conversationsSlice, {
  optimisticConversationsActions
} from './conversationsSlice';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import documentSlice, { optimisticDocumentActions } from './documentSlice';
import currentConversationSlice, { selectCurrentConversation } from './currentConversationSlice';
import searchSpaceSlice, { selectAllSearchSpace } from './searchSpaceSlice';
import sidebarSlice from './sidebarSlice';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import themeSlice from './themeSlice';
import loadingSlice from './loadingSlice';

const { serialize, deserialize } = require('json-immutable');

const combinedReducer = combineReducers({
  folders: folderSlice,
  conversations: conversationsSlice,
  documents: documentSlice,
  theme: themeSlice,
  currentConversation: currentConversationSlice,
  searchSpace: searchSpaceSlice,
  sidebar: sidebarSlice,
  loading: loadingSlice
});

type CombinedReducerState = ReturnType<typeof combinedReducer>;

const reducer = (state: any, action: any): CombinedReducerState => {
  if (action.type === HYDRATE) {
    return {
      ...action.payload,
      theme: state.theme,
      currentConversation: state.currentConversation,
      sidebar: state.sidebar,
      loading: state.loading
    };
  } else {
    return combinedReducer(state, action);
  }
};

export const store = () =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(thunkMiddleware)
  });

export type AppStore = ReturnType<typeof store>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export type AppThunk<ReturnType = void> = ThunkAction<
  Promise<ReturnType>,
  AppState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper<AppStore>(store, {
  debug: false,
  // These are needed to serialize the store state for the server-side rendering
  serializeState: (state) => serialize(state),
  deserializeState: (state) => deserialize(state)
});

/**
 * Helper method to initialize store at SSR time
 */
export const initStore = wrapper.getServerSideProps(
  (store) => async (context) => {
    const supabase = createServerSupabaseClient<Database>(context);
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session)
      return {
        redirect: {
          destination: '/signin',
          permanent: false
        }
      };

    let error: string | null = null;

    try {
      // A collection of promises that initialize the store
      const promises = [
        store.dispatch(optimisticDocumentActions.fetchAllDocuments(supabase)),
        store.dispatch(optimisticFoldersAction.fetchAllFolders(supabase)),
        store.dispatch(
          optimisticConversationsActions.fetchAllConversations(supabase)
        )
      ];
      await Promise.all(promises);

      // Initialize search space
      if (store.getState().documents.length > 0) {
        await store.dispatch(
          selectAllSearchSpace(store.getState().documents.map((d) => d.id))
        );

      } else {
        await store.dispatch(selectAllSearchSpace([]));
      }
    } catch (e: any) {
      console.error(e.message);
      error = e.message;
    }

    return {
      props: {
        error
      }
    };
  }
);
