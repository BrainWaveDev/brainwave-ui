import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from './store';

interface ThemeState {
  theme: 'dark' | 'light';
}

const initialState: ThemeState = {
  theme: 'light' // or 'dark', depending on your default preference
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = newTheme;
      localStorage.setItem('preferredTheme', newTheme);
      if (document && document.documentElement) {
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
      localStorage.setItem('preferredTheme', action.payload);
      if (document && document.documentElement) {
        document.documentElement.setAttribute('data-theme', action.payload);
      }
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export const getThemeFromStorage = () =>
  useAppSelector((state) => state.theme.theme);

export default themeSlice.reducer;
