import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface LightModeState {
    mode: 'dark' | 'light';
}

const initialState: LightModeState = {
    mode: 'dark', // or 'light', depending on your default preference
};

const lightModeSlice = createSlice({
    name: 'lightMode',
    initialState,
    reducers: {
        toggleLightMode: (state) => {
            state.mode = state.mode === 'dark' ? 'light' : 'dark';
        },
        setLightMode: (state, action: PayloadAction<'dark' | 'light'>) => {
            state.mode = action.payload;
        },
    },
});


export const { toggleLightMode,setLightMode } = lightModeSlice.actions;

export default lightModeSlice.reducer;
