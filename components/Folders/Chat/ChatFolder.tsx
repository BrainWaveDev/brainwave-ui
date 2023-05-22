import { Conversation, ConversationIdentifiable, ConversationSummary } from '../../../types/chat';
import { KeyValuePair } from '../../../types/data';
import { Folder } from '../../../types/folder';
import {
  IconCaretDown,
  IconCaretRight,
  IconCheck,
  IconPencil,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import { FC, KeyboardEvent, useEffect, useState } from 'react';
import { ConversationComponent } from '../../Chatbar/Conversation';
import { useAppDispatch, useAppSelector } from 'context/redux/store';
import { optimisticFoldersOperations, updateFolderName } from 'context/redux/folderSlice';
import { deleteFolder as DBDeleteFodler, renameFolder, updateFolder } from '@/utils/app/folders';
interface Props {
  searchTerm: string;
  conversations: ConversationSummary[];
  currentFolder: Folder;
  // conversation props
  selectedConversation: Conversation | undefined;
  loading: boolean;
  onSelectConversation: (conversation: ConversationIdentifiable) => void;
}

export const ChatFolder: FC<Props> = ({
  searchTerm,
  conversations,
  currentFolder,
  // conversation props
  selectedConversation,
  loading,
  onSelectConversation,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    }
  };
  const dispatch = useAppDispatch();
  const handleRename = () => {
    dispatch(optimisticFoldersOperations.updateFolderName(currentFolder.id, renameValue));
  };

  const handleDeleteFolder = () => {
    dispatch(optimisticFoldersOperations.deleteFolder(currentFolder.id));
  };

  const handleDrop = (e: any, folder: Folder) => {
    if (e.dataTransfer) {
      setIsOpen(true);

      // const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      // onUpdateConversation(conversation, { key: 'folderId', value: folder.id });

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

  return (
    <>
      <div className="relative flex items-center">
        {isRenaming ? (
          <div className="flex w-full items-center gap-3 bg-[#343541]/90 p-3 rounded-lg">
            {isOpen ? (
              <IconCaretDown size={18} />
            ) : (
              <IconCaretRight size={18} />
            )}

            <input
              className="mr-12 flex-1 overflow-hidden overflow-ellipsis border-neutral-400 bg-transparent text-left text-[12.5px] leading-3 text-white outline-none focus:border-neutral-100"
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={handleEnterDown}
              autoFocus
            />
          </div>
        ) : (
          <button
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90`}
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

            <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3">
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

                if (isDeleting) {
                  handleDeleteFolder();
                } else if (isRenaming) {
                  handleRename();
                }

                setIsDeleting(false);
                setIsRenaming(false);
              }}
            >
              <IconCheck size={18} />
            </button>
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(false);
                setIsRenaming(false);
              }}
            >
              <IconX size={18} />
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
              <IconPencil size={18} />
            </button>
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(true);
              }}
            >
              <IconTrash size={18} />
            </button>
          </div>
        )}
      </div>

      {isOpen
        ? conversations.map((conversation, index) => {
          if (conversation.folderId === currentFolder.id) {
            return (
              <div key={index} className="ml-5 gap-2 border-l pl-2">
                <ConversationComponent
                  isSelected={selectedConversation?.id === conversation.id}
                  conversation={conversation}
                  loading={loading}
                  onSelectConversation={() => onSelectConversation(conversation)}
                />
              </div>
            );
          }
        })
        : null}
    </>
  );
};
