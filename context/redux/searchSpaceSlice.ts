import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from './store';

interface SearchSpaceState {
  searchSpace: number[];
}

const initialState: SearchSpaceState = {
  searchSpace: []
};

const searchSpaceSlice = createSlice({
  name: 'searchSpace',
  initialState,
  reducers: {
    clearSearchSpace: () => {
      return {
        searchSpace: []
      };
    },
    selectAllSearchSpace: (state, action: PayloadAction<number[]>) => {
      return {
        searchSpace: action.payload
      };
    },
    selectSearchSpace: (state, action: PayloadAction<number>) => {
      const index = state.searchSpace.indexOf(action.payload);
      if (index > -1) {
        state.searchSpace.splice(index, 1);
      } else {
        state.searchSpace.push(action.payload);
      }
    }
  }
});
export const { clearSearchSpace, selectAllSearchSpace, selectSearchSpace } =
  searchSpaceSlice.actions;

export const getSearchSpaceFromStore = () =>
  useAppSelector((state) => state.searchSpace.searchSpace);

export default searchSpaceSlice.reducer;
