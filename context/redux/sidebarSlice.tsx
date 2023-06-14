import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from './store';
import { set } from '@/utils/app/localcache';

interface SidebarState {
  open: boolean;
  settingDialogOpen: boolean;
}

const initialState: SidebarState = {
  open: true,
  settingDialogOpen: false
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      const newState = !state.open;
      state.open = newState;
      localStorage.setItem('sidebarOpen', newState.toString());
    },
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
      localStorage.setItem('sidebarOpen', action.payload.toString());
    },
    initSidebar: (state) => {
      // Extra check to make sure that we don't run this code on the server
      if (typeof window === 'undefined') return state;

      const sidebarOpen = localStorage.getItem('sidebarOpen');
      if (sidebarOpen !== null) {
        return {
          open: sidebarOpen === 'true',
          settingDialogOpen: false
        };
      } else {
        localStorage.setItem('sidebarOpen', 'true');
        return {
          open: true,
          settingDialogOpen: false
        };
      }
    },
    toggleSettingDialog: (state) => {
      state.settingDialogOpen = !state.settingDialogOpen;
    }
  }
});

export const { toggleSidebar, setSidebar, initSidebar,toggleSettingDialog } = sidebarSlice.actions;

export const getSidebarStateFromStorage = () =>
  useAppSelector((state) => state.sidebar.open);

export default sidebarSlice.reducer;
