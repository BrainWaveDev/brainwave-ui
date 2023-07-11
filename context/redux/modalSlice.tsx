import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from './store';

interface ModalState {
  sideBarOpen: boolean;
  settingDialogOpen: boolean;
  documentFilterOpen: boolean;
}

const initialState: ModalState = {
  sideBarOpen: false,
  settingDialogOpen: false,
  documentFilterOpen: false
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      const newState = !state.sideBarOpen;
      state.sideBarOpen = newState;
      localStorage.setItem('sidebarOpen', newState.toString());
    },
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.sideBarOpen = action.payload;
      localStorage.setItem('sidebarOpen', action.payload.toString());
    },
    initSidebar: (state) => {
      // Extra check to make sure that we don't run this code on the server
      if (typeof window === 'undefined') return state;
      else {
        if (window.innerWidth >= 640)
          return {
            ...initialState,
            sideBarOpen: true
          };
      }
    },
    openSettingDialog: (state) => {
      state.settingDialogOpen = true;
    },
    closeSettingDialog: (state) => {
      state.settingDialogOpen = false;
    },
    toggleSettingDialog: (state) => {
      state.settingDialogOpen = !state.settingDialogOpen;
    },
    toggleDocumentFilter: (state) => {
      state.documentFilterOpen = !state.documentFilterOpen;
    }
  }
});

export const {
  toggleSidebar,
  setSidebar,
  initSidebar,
  toggleSettingDialog,
  toggleDocumentFilter,
  openSettingDialog,
  closeSettingDialog
} = modalSlice.actions;

export const getModalStateFromStorage = () =>
  useAppSelector((state) => state.modal);

export default modalSlice.reducer;
