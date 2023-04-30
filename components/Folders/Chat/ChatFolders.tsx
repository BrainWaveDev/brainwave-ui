import { Conversation, ConversationIdentifiable, ConversationSummary } from '../../../types/chat';
import { KeyValuePair } from '../../../types/data';
import { Folder } from '../../../types/folder';
import { FC } from 'react';
import { ChatFolder } from './ChatFolder';

interface Props {
  searchTerm: string;
  conversations: ConversationSummary[];
  folders: Folder[];
  onDeleteFolder: (folder: number) => void;
  onUpdateFolder: (folder: number, name: string) => void;
  // conversation props
  selectedConversation: Conversation | undefined;
  loading: boolean;
  onSelectConversation: (conversation: ConversationIdentifiable) => void;
  onDeleteConversation: (conversation: ConversationIdentifiable) => void;
  onUpdateConversation: (
    conversation: ConversationIdentifiable,
    data: KeyValuePair
  ) => void;
}

export const ChatFolders: FC<Props> = ({
  searchTerm,
  conversations,
  folders,
  onDeleteFolder,
  onUpdateFolder,
  // conversation props
  selectedConversation,
  loading,
  onSelectConversation,
  onDeleteConversation,
  onUpdateConversation
}) => {
  return (
    <div className="flex w-full flex-col pt-2">
      {folders.map((folder, index) => (
        <ChatFolder
          key={index}
          searchTerm={searchTerm}
          conversations={conversations.filter((c) => c.folderId)}
          currentFolder={folder}
          onDeleteFolder={onDeleteFolder}
          onUpdateFolder={onUpdateFolder}
          // conversation props
          selectedConversation={selectedConversation}
          loading={loading}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={onDeleteConversation}
          onUpdateConversation={onUpdateConversation}
        />
      ))}
    </div>
  );
};
