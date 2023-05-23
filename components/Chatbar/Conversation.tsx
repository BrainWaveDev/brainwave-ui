import { useAppDispatch } from 'context/redux/store';
import { ConversationIdentifiable, ConversationSummary } from '../../types/chat';
import {
  IconCheck,
  IconMessage,
  IconPencil,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import { DragEvent, FC, KeyboardEvent, useEffect, useState } from 'react';
import { optimisticConversationsActions } from 'context/redux/conversationsSlice';

interface Props {
  conversation: ConversationSummary;
  isSelected: boolean;
  onSelectConversation: () => void;
}

export const ConversationComponent: FC<Props> = ({
  conversation,
  isSelected,
  onSelectConversation,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const dispatch = useAppDispatch();
  const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    }
  };

  const handleDragStart = (
    e: DragEvent<HTMLButtonElement>,
    conversation: ConversationIdentifiable
  ) => {
    console.debug('drag start', conversation,  e.dataTransfer);
    if (e.dataTransfer) {
      e.dataTransfer.setData('conversation', JSON.stringify(conversation));
    }
  };

  const handleRename = () => {
    const newConversation = {
      ...conversation,
      name: renameValue,
    }
    dispatch(optimisticConversationsActions.updateConversation(newConversation))
    setIsRenaming(false);
    setRenameValue('');
  };

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  function handleDeleteConversation() {
    setIsDeleting(true);
    dispatch(optimisticConversationsActions.deleteConversation(conversation))
    setIsDeleting(false);
  }

  return (
    <div className="relative flex items-center my-1">
      {isRenaming && isSelected ? (
        <div className="flex w-full items-center gap-3 bg-[#343541]/90 p-3 rounded-lg">
          <IconMessage size={18} />
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
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90 ${
            isSelected ? 'bg-[#343541]/90' : ''
          }`}
          onClick={() => onSelectConversation()}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, conversation)}
        >
          <IconMessage size={18} />
          <div
            className={`relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3 ${
              isSelected ? 'pr-12' : 'pr-1'
            }`}
          >
            {conversation.name}
          </div>
        </button>
      )}

      {(isDeleting || isRenaming) &&
        isSelected && (
          <div className="absolute right-1 z-10 flex text-gray-300">
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                if (isDeleting) {
                  handleDeleteConversation();
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

      { isSelected &&
        !isDeleting &&
        !isRenaming && (
          <div className="absolute right-1 z-10 flex text-gray-300">
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
                setRenameValue(conversation.name);
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
  );
};
