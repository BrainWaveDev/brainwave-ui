import { ConversationSummary } from '@/types/chat';
import { memo, useMemo, useState } from 'react';
import { IconMessagesOff } from '@tabler/icons-react';
import { ChatFolders } from '../Folders/Chat/ChatFolders';
import Search from '../Sidebar/Search';
import { ChatbarSettings } from './ChatbarSettings';
import Conversations from './Conversations';
import classNames from 'classnames';
// @ts-ignore
import { motion } from 'framer-motion';
import { useAppDispatch } from 'context/redux/store';
import { getFoldersFromStorage } from 'context/redux/folderSlice';
import {
  getConversationsFromStorage,
  optimisticConversationsActions
} from 'context/redux/conversationsSlice';
import { getSidebarStateFromStorage } from '../../context/redux/sidebarSlice';

export default memo(function Chatbar() {
  // =========================
  // Redux State
  // =========================
  const dispatch = useAppDispatch();
  const folders = getFoldersFromStorage();
  const conversations = getConversationsFromStorage();
  const sidebarOpen = getSidebarStateFromStorage();
  const [searchTerm, setSearchTerm] = useState('');

  // =========================
  // Handlers
  // =========================
  const handleUpdateConversationFolder = (
    conversation: ConversationSummary,
    folderId: number | null = null
  ) => {
    dispatch(
      optimisticConversationsActions.updateConversation({
        ...conversation,
        folderId
      })
    );
  };

  // =========================
  // Local State
  // =========================
  const filteredConversations = useMemo(
    () =>
      conversations.filter((conversation) => {
        const searchable = conversation.name.toLocaleLowerCase();
        return searchable.toLowerCase().includes(searchTerm.toLowerCase());
      }),
    [searchTerm, conversations]
  );

  // =========================
  // Effects
  // =========================
  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      handleUpdateConversationFolder(conversation);
      e.target.style.background = 'none';
    }
  };
  const allowDrop = (e: any) => {
    e.preventDefault();
  };
  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };
  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  return (
    <motion.div
      className={classNames(
        'flex flex-col w-full mt-2 mb-1',
        'space-y-2 transition-all duration-150 transform-gpu'
      )}
      animate={sidebarOpen ? 'open' : 'closed'}
    >
      {/* ========================= */}
      {/* Conversations Search Bar */}
      {conversations.length > 1 && (
        <Search
          searchTerm={searchTerm}
          setSearchTerm={(value) => setSearchTerm(value)}
        />
      )}
      {/* Chat Folders List */}
      <div className="flex-grow overflow-auto">
        {folders.length > 0 && (
          <div className="flex border-b border-neutral6 pb-2">
            <ChatFolders searchTerm={searchTerm} />
          </div>
        )}
        {/* List of Conversations Without Folders */}
        {conversations.length > 0 ? (
          <div
            className="pt-2 border-b border-neutral6 pb-2"
            onDrop={(e) => handleDrop(e)}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            <Conversations
              conversations={filteredConversations.filter(
                (conversation) => !conversation.folderId
              )}
            />
          </div>
        ) : (
          <div
            className={classNames(
              'flex flex-col gap-3 items-center',
              'text-sm leading-normal mt-4 mb-1 text-white opacity-50'
            )}
          >
            <IconMessagesOff />
            No conversations.
          </div>
        )}
      </div>
      <ChatbarSettings />
    </motion.div>
  );
});
