import { Folder } from '../../types/folder';

export const saveFolders = (folders: Folder[]) => {
  console.log('saving folders', folders);
  localStorage.setItem('folders', JSON.stringify(folders));
};
