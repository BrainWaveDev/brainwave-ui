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
import useRouteChange from '../../hooks/useRouteChange';
import { RotatingLines } from 'react-loader-spinner';
import {
  getLoadingStateFromStore,
  LoadingTrigger
} from '../../context/redux/loadingSlice';

export default memo(function Chatbar() {
  // =========================
  // Redux State
  // =========================
  const dispatch = useAppDispatch();
  const folders = getFoldersFromStorage();
  const conversations = getConversationsFromStorage();
  const sidebarOpen = getSidebarStateFromStorage();
  const deletingConversations = getLoadingStateFromStore(
    LoadingTrigger.DeletingConversations
  );

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

  // ===== Detect Page Loading =====
  const [pageLoading] = useRouteChange();

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
        'flex flex-col w-full mt-2 mb-1 relative',
        'transition-all duration-150 transform-gpu'
      )}
      animate={sidebarOpen ? 'open' : 'closed'}
    >
      {/* ========== Loading Spinner ========== */}
      {(pageLoading || deletingConversations) && (
        <div
          className={classNames(
            'absolute top-0 left-0 right-0 bottom-0 z-20',
            'flex items-center justify-center bg-zinc-900'
          )}
        >
          <RotatingLines
            strokeColor="#9ca3af"
            strokeWidth="2"
            animationDuration="1"
            width="2rem"
            visible={true}
          />
        </div>
      )}
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
        filteredConversations.length > 0 ? (
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
        ) : null
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
          <Separator.Root className={classNames(separatorStyle)} />
        </>
      )}
      <ChatbarSettings />
    </motion.div>
  );
});
