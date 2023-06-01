import { ConversationIdentifiable, ConversationSummary } from '@/types/chat';
import { useAppDispatch } from 'context/redux/store';
import { IconX } from '@tabler/icons-react';
import { DragEvent, FC, KeyboardEvent, memo, useEffect, useState } from 'react';
import {
  CheckIcon,
  ChatBubbleLeftEllipsisIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {
  getCurrentConversationFromStore,
  optimisticCurrentConversationAction
} from '../../context/redux/currentConversationSlice';
import { optimisticConversationsActions } from '../../context/redux/conversationsSlice';

interface Props {
  conversation: ConversationSummary;
}

export const ConversationComponent: FC<Props> = memo(({ conversation }) => {
  // =======================
  // Redux State
  // =======================
  const dispatch = useAppDispatch();
  const { conversation: currentConversation } =
    getCurrentConversationFromStore();
  const isSelected =
    currentConversation && currentConversation.id === conversation.id;

  // =======================
  // Local state
  // =======================
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  // =======================
  // Handlers
  // =======================
  const handleSelectConversation = () =>
    dispatch(
      optimisticCurrentConversationAction.retrieveAndSelectConversation(
        conversation
      )
    );
  const handleDeleteConversation = async () => {
    await dispatch(
      optimisticConversationsActions.deleteConversation(conversation)
    );
  };
  const handleUpdateConversationName = async () => {
    await dispatch(
      optimisticConversationsActions.updateConversation({
        ...conversation,
        name: renameValue
      })
    );
  };
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
    console.debug('drag start', conversation, e.dataTransfer);
    if (e.dataTransfer) {
      e.dataTransfer.setData('conversation', JSON.stringify(conversation));
    }
  };
  const handleRename = async () => {
    if (renameValue.trim().length > 0) {
      await handleUpdateConversationName();
      setRenameValue('');
      setIsRenaming(false);
    }
  };

  // =================================================================
  // Tailwind Classes
  // =================================================================
  return (
    <div className="relative flex items-center my-0.5">
      {isRenaming ? (
        <div
          className={classNames(
            'flex w-full items-center gap-3 px-2.5 py-1.5 rounded-lg shadow bg-blackA10'
          )}
        >
          <ChatBubbleLeftEllipsisIcon
            className={'w-[18px] h-[18px]'}
            strokeWidth={1.5}
          />
          <input
            className="mr-12 flex-1 overflow-hidden overflow-ellipsis border-neutral-400 bg-transparent text-left text-sm leading-3 text-white outline-none focus:ring-0 focus:outline-0 ring-0 border-none"
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={handleEnterDown}
            autoFocus
          />
        </div>
      ) : (
        <button
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90
            ${isSelected ? 'bg-[#343541]/90' : ''}`}
          onClick={handleSelectConversation}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, conversation)}
        >
          <ChatBubbleLeftEllipsisIcon
            className={'w-[18px] h-[18px] transition-colors duration-100'}
            strokeWidth={2}
          />
          <div
            className={classNames(
              'relative max-h-5 flex-1',
              'overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-sm leading-4',
              'transition-colors duration-100',
              isSelected ? 'pr-12' : 'pr-1'
            )}
          >
            {conversation.name}
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
                handleDeleteConversation();
              } else if (isRenaming) {
                handleRename();
              }
              setIsDeleting(false);
              setIsRenaming(false);
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
            <IconX size={18} />
          </button>
        </div>
      )}
      {isSelected && !isDeleting && !isRenaming && (
        <div className="absolute right-1 z-10 flex flex-row items-center justify-center gap-x-1 mr-1 text-gray-300">
          <button
            className="min-w-[20px] p-0 text-neutral-400 hover:text-neutral-100"
            onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(true);
              setRenameValue(conversation.name);
            }}
          >
            <PencilIcon className={'w-[17px] h-[17px]'} strokeWidth={2} />
          </button>
          <button
            className="min-w-[20px] p-0 text-neutral-400 hover:text-neutral-100"
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
  );
});
