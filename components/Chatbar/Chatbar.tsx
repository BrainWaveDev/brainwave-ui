import { ConversationSummary } from '@/types/chat';
import React, { memo, useMemo, useState } from 'react';
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
import * as Separator from '@radix-ui/react-separator';

export default memo(function Chatbar() {
  // =========================
  // Redux State
  // =========================
  const dispatch = useAppDispatch();
  const folders = getFoldersFromStorage();
  const conversations = getConversationsFromStorage();
  const sidebarOpen = getSidebarStateFromStorage();

  // ======= Filtering Conversations =======
  const [searchTerm, setSearchTerm] = useState('');
  const filteredConversations = useMemo(
    () =>
      conversations.filter((conversation) => {
        // Select conversations without a folder
        if (conversation.folderId) return false;

        const searchable = conversation.name.toLocaleLowerCase();
        return searchable.toLowerCase().includes(searchTerm.toLowerCase());
      }),
    [searchTerm, conversations]
  );

  // =========================
  // Handlers
  // =========================
  const handleUpdateConversationFolder = async (
    conversation: ConversationSummary,
    folderId: number | null = null
  ) => {
    await dispatch(
      optimisticConversationsActions.updateConversation({
        ...conversation,
        folderId
      })
    );
  };

  // =========================
  // Effects
  // =========================
  const handleDrop = async (e: any) => {
    if (e.dataTransfer) {
      const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      await handleUpdateConversationFolder(conversation);
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

  // ======== Tailwind Classes ========
  const separatorStyle = classNames(
    'bg-neutral6 data-[orientation=horizontal]:h-px',
    'data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full',
    'data-[orientation=vertical]:w-px'
  );

  return (
    <motion.div
      className={classNames(
        'flex flex-col w-full mt-2 relative',
        'transition-all duration-150 transform-gpu max-h-full'
      )}
      animate={sidebarOpen ? 'open' : 'closed'}
    >
      {/* ========== Conversations Search Bar ========== */}
      {conversations.length > 1 && (
        <>
          <Search
            searchTerm={searchTerm}
            setSearchTerm={(value) => setSearchTerm(value)}
          />
          <Separator.Root className={classNames(separatorStyle, 'mt-3')} />
        </>
      )}
      {/* ========== Chat Folders List ========== */}
      {folders.length > 0 && (
        <>
          <ChatFolders searchTerm={searchTerm} />
          <Separator.Root className={separatorStyle} />
        </>
      )}
      {/* ==========  List of Conversations Without Folders ========== */}
      {conversations.length > 0 ? (
        filteredConversations.length > 0 && (
          <>
            <div
              className={'flex justify-center items-center my-2'}
              onDrop={(e) => handleDrop(e)}
              onDragOver={allowDrop}
              onDragEnter={highlightDrop}
              onDragLeave={removeHighlight}
            >
              <Conversations conversations={filteredConversations} />
            </div>
            <Separator.Root className={separatorStyle} />
          </>
        )
      ) : (
        <>
          <div
            className={classNames(
              'flex flex-col items-center py-8',
              'text-sm leading-normal text-white opacity-50'
            )}
          >
            <IconMessagesOff />
            No conversations.
          </div>
        </>
      )}
      <ChatbarSettings />
    </motion.div>
  );
});
