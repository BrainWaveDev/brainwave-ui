import { Conversation, ConversationIdentifiable, ConversationSummary } from '../../types/chat';
import { IconFolderPlus, IconMessagesOff, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useState } from 'react';
import { ChatFolders } from '../Folders/Chat/ChatFolders';
import { Search } from '../Sidebar/Search';
import { ChatbarSettings } from './ChatbarSettings';
import { Conversations } from './Conversations';
import classNames from 'classnames';
import ChevronLeft from '@/components/icons/ChevronLeft';
import { useAppDispatch, useAppSelector } from 'context/redux/store';
import { optimisticFoldersOperations } from 'context/redux/folderSlice';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { optimisticConversationsActions } from 'context/redux/conversationsSlice';

interface Props {
  loading: boolean;
  lightMode: 'light' | 'dark';
  selectedConversation: Conversation | undefined;
  showSidebar: boolean;
  handleToggleChatbar: () => void;
  onToggleLightMode: (mode: 'light' | 'dark') => void;
  onSelectConversation: (conversation: ConversationIdentifiable) => void;
}

export const Chatbar: FC<Props> = ({
  loading,
  lightMode,
  selectedConversation,
  showSidebar,
  handleToggleChatbar,
  onToggleLightMode,
  onSelectConversation,
}) => {
  const { t } = useTranslation('sidebar');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredConversations, setFilteredConversations] =
    useState<ConversationSummary[]>([]);
  const folders = useAppSelector(state => state.folders)
  const conversations = useAppSelector(state => state.conversations)
  const { session } = useSessionContext();

  

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      // TODO: update conversation folderId
      // onUpdateConversation(conversation, { key: 'folderId', value: 0 });
      
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

  const dispatch = useAppDispatch()
  const handleCreateFolder = () => {
    dispatch(optimisticFoldersOperations.creatrNewFolder(session?.user!.id!))
  }

  const handleCreateNewConversation = () => {
    dispatch(optimisticConversationsActions.createConversation(session?.user!.id!))
  };


  useEffect(() => {
    if (searchTerm) {
      setFilteredConversations(
        conversations.filter((conversation) => {
          const searchable = conversation.name.toLocaleLowerCase()
          return searchable.toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchTerm, conversations]);

  return (
    <div
      className={classNames(
        'absolute top-0 left-0 z-50 flex flex-col w-[260px] h-full',
        'space-y-2 bg-gray-800 p-2 transition-all duration-150 transform-gpu',
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <button
        className="absolute top-1/2 -translate-y-1/2 -right-6 z-50 h-14 min-w-fit w-6 bg-gray-800 rounded-r-lg group"
        onClick={handleToggleChatbar}
      >
        <ChevronLeft
          className={classNames(
            'w-6 h-6 transition duration-150 fill-white group-hover:fill-teal-200 group-active:fill-teal-200',
            !showSidebar && 'flip-y'
          )}
          strokeWidth={1.5}
        />
      </button>
      <div className="flex items-center">
        <button
          className="flex w-[190px] flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-white/20 p-3 text-[14px] leading-normal text-white transition-colors duration-200 hover:bg-gray-500/10"
          onClick={() => {
            handleCreateNewConversation();
            setSearchTerm('');
          }}
        >
          <IconPlus size={18} />
          {t('New chat')}
        </button>

        <button
          className="ml-2 flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-md border border-white/20 p-3 text-[14px] leading-normal text-white transition-colors duration-200 hover:bg-gray-500/10"
          onClick={() => handleCreateFolder()}
        >
          <IconFolderPlus size={18} />
        </button>
      </div>

      {conversations.length > 1 && (
        <Search
          placeholder="Search conversations..."
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />
      )}

      <div className="flex-grow overflow-auto">
        {folders.length > 0 && (
          <div className="flex border-b border-white/20 pb-2">
            <ChatFolders
              searchTerm={searchTerm}
              conversations={filteredConversations.filter(
                (conversation) => conversation.folderId
              )}
              folders={folders}
              selectedConversation={selectedConversation}
              loading={loading}
              onSelectConversation={onSelectConversation}
            />
          </div>
        )}

        {conversations.length > 0 ? (
          <div
            className="pt-2"
            onDrop={(e) => handleDrop(e)}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            <Conversations
              loading={loading}
              conversations={filteredConversations.filter(
                (conversation) => !conversation.folderId
              )}
              selectedConversation={selectedConversation}
              onSelectConversation={onSelectConversation}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3 items-center text-sm leading-normal mt-8 text-white opacity-50">
            <IconMessagesOff />
            {t('No conversations.')}
          </div>
        )}
      </div>

      <ChatbarSettings
        lightMode={lightMode}
        conversationsCount={conversations.length}
        onToggleLightMode={onToggleLightMode}
      />
    </div>
  );
};
