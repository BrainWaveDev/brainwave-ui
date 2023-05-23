import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchSpaceState {
  searchSpace: number[];
}

const initialState: SearchSpaceState = {
  searchSpace: [],
};

const searchSpaceSlice = createSlice({
  name: 'searchSpace',
  initialState,
  reducers: {
    clearSearchSpace: (state) => {
      state.searchSpace = [];
    },
    selectAllSearchSpace: (state, action: PayloadAction<number[]>) => {
      state.searchSpace = action.payload;
    },
    selectSearchSpace: (state, action: PayloadAction<number>) => {
      const index = state.searchSpace.indexOf(action.payload);
      if (index === -1) {
        state.searchSpace.push(action.payload);
      } else {
        state.searchSpace.splice(index, 1);
      }
    },
  },
});

export const { clearSearchSpace, selectAllSearchSpace, selectSearchSpace } = searchSpaceSlice.actions;

export default searchSpaceSlice.reducer;
