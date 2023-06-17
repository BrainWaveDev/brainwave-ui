import { ChatFolder } from './ChatFolder';
import { getFoldersFromStorage } from '../../../context/redux/folderSlice';

interface Props {
  searchTerm: string;
}

export const ChatFolders = ({ searchTerm }: Props) => {
  // =======================
  // Redux State
  // =======================
  const folders = getFoldersFromStorage();
  return (
    <div className="flex w-full flex-col my-2">
      {folders.map((folder, index) => (
        <ChatFolder
          key={index}
          searchTerm={searchTerm}
          currentFolder={folder}
        />
      ))}
    </div>
  );
};
