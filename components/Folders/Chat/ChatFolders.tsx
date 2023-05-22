import { Conversation, ConversationIdentifiable, ConversationSummary } from '../../../types/chat';
import { Folder } from '../../../types/folder';
import { FC } from 'react';
import { ChatFolder } from './ChatFolder';

interface Props {
  searchTerm: string;
  conversations: ConversationSummary[];
  folders: Folder[];
  // conversation props
  selectedConversation: Conversation | undefined;
  loading: boolean;
  onSelectConversation: (conversation: ConversationIdentifiable) => void;
}

export const ChatFolders: FC<Props> = ({
  searchTerm,
  conversations,
  folders,
  // conversation props
  selectedConversation,
  loading,
  onSelectConversation,
}) => {
  return (
    <div className="flex w-full flex-col pt-2">
      {folders.map((folder, index) => (
        <ChatFolder
          key={index}
          searchTerm={searchTerm}
          conversations={conversations.filter((c) => c.folderId)}
          currentFolder={folder}
          selectedConversation={selectedConversation}
          loading={loading}
          onSelectConversation={onSelectConversation}
        />
      ))}
    </div>
  );
};
