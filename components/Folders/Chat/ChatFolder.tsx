import { Folder } from '@/types/folder';
import { IconCaretDown, IconCaretRight } from '@tabler/icons-react';
import { FC, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { ConversationComponent } from '../../Chatbar/Conversation';
import classNames from 'classnames';
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import { useAppDispatch } from 'context/redux/store';
import { optimisticFoldersAction } from 'context/redux/folderSlice';
import {
  getConversationsFromStorage,
  optimisticConversationsActions
} from '../../../context/redux/conversationsSlice';
import { ConversationSummary } from '@/types/chat';

interface Props {
  searchTerm: string;
  currentFolder: Folder;
}

export const ChatFolder: FC<Props> = ({ searchTerm, currentFolder }) => {
  // =======================
  // Redux State
  // =======================
  const dispatch = useAppDispatch();
  const conversations = getConversationsFromStorage();
  const folderConversations = useMemo(
    () =>
      conversations.filter(
        (c) =>
          c.folderId === currentFolder.id &&
          // Only display conversations that match the search term
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [conversations, currentFolder.id, searchTerm]
  );

  // =======================
  // Local state
  // =======================
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);
  useEffect(() => {
    if (searchTerm) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm]);

  // =======================
  // Handlers
  // =======================
  const onUpdateConversationFolder = (
    conversation: ConversationSummary,
    folderId: number
  ) => {
    dispatch(
      optimisticConversationsActions.updateConversation({
        ...conversation,
        folderId
      })
    );
  };
  const handleRename = () => {
    dispatch(
      optimisticFoldersAction.updateFolderName(currentFolder.id, renameValue)
    );
    setIsRenaming(false);
  };
  const handleDeleteFolder = () => {
    dispatch(optimisticFoldersAction.deleteFolder(currentFolder.id));
    setIsDeleting(false);
  };
  const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
    }
  };
  const handleDrop = (e: any, folder: Folder) => {
    if (e.dataTransfer) {
      setIsOpen(true);
      const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      onUpdateConversationFolder(conversation, folder.id);
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
    <>
      <div className="relative flex items-center">
        {isRenaming ? (
          <div
            className={classNames(
              'flex w-full items-center bg-blackA10 gap-3 px-2 py-1 rounded-lg'
            )}
          >
            {isOpen ? (
              <IconCaretDown size={18} />
            ) : (
              <IconCaretRight size={18} />
            )}
            <input
              className={classNames(
                'px-2 py-2.5 mr-12 flex-1 overflow-hidden overflow-ellipsis',
                'bg-transparent text-left text-sm leading-3 text-white outline-none',
                'focus:ring-0 focus:outline-0 ring-0 border-none'
              )}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={handleEnterDown}
              autoFocus
            />
          </div>
        ) : (
          <button
            className={`text-neutral-400 hover:text-neutral-100 group flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 my-0.5 text-sm transition-colors duration-200 hover:bg-[#343541]/90`}
            onClick={() => setIsOpen(!isOpen)}
            onDrop={(e) => handleDrop(e, currentFolder)}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            {isOpen ? (
              <IconCaretDown size={18} />
            ) : (
              <IconCaretRight size={18} />
            )}
            <div
              className={classNames(
                'text-neutral-400 group-hover:text-neutral-100 relative flex-1',
                'overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-sm leading-3'
              )}
            >
              {currentFolder.name}
            </div>
          </button>
        )}
        {(isDeleting || isRenaming) && (
          <div className="absolute right-1 z-10 flex text-gray-300">
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                if (isDeleting) handleDeleteFolder();
                else if (isRenaming) handleRename();
              }}
            >
              <CheckIcon
                className={
                  'h-[18px] w-[18px] text-neutral-400 hover:text-neutral-100'
                }
              />
            </button>
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(false);
                setIsRenaming(false);
              }}
            >
              <XMarkIcon
                className={
                  'h-[18px] w-[18px] text-neutral-400 hover:text-neutral-100'
                }
              />
            </button>
          </div>
        )}
        {!isDeleting && !isRenaming && (
          <div className="absolute right-1 z-10 flex text-gray-300">
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
                setRenameValue(currentFolder.name);
              }}
            >
              <PencilIcon className={'w-[17px] h-[17px]'} strokeWidth={2} />
            </button>
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(true);
              }}
            >
              <TrashIcon className={'w-[18px] h-[18px]'} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
      {isOpen &&
        folderConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={'ml-4 gap-2 border-l border-neutral-400 pl-2'}
          >
            <ConversationComponent conversation={conversation} />
          </div>
        ))}
    </>
  );
};
