import { Chat } from '@/components/Chat/Chat';
import { Chatbar } from '@/components/Chatbar/Chatbar';
import {
  Conversation,
  Message
} from '../../types/chat';
import {
  cleanConversationHistory
} from '@/utils/app/clean';
import { Document } from '@/types/document';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useAppDispatch, useAppSelector } from 'context/redux/store';
import { OpenAIModelID, fallbackModelID } from 'types/openai';
import { optimisticConversationsActions, setConversations } from 'context/redux/conversationsSlice';
import { optimisticDocumentActions } from 'context/redux/documentSlice';
import { optimisticFoldersAction } from 'context/redux/folderSlice';
import { setLightMode } from 'context/redux/lightmodeSlice';
import { getDocumentListServerSideProps } from '@/utils/supabase-admin';

interface ChatProps {
  defaultModelId: OpenAIModelID;
  documents: Document[];
  error?: string;
}

// This interface is used to pass document information to the filter component
export interface DocumentInfo {
  id: number;
  name: string;
  selected: boolean;
}

const ChatUI: React.FC<ChatProps> = () => {

  // STATE ----------------------------------------------

  // const [selectedConversation, setSelectedConversation] = useState<Conversation>();


  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const { isLoading, session, error } = useSessionContext();

  const lightmode = useAppSelector((state) => state.lightmode);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // loading after login
    if (isLoading || error) {
      return;
    }
    const user_id = session?.user?.id!;
    // when swich beteen pages, the redux store will be empty, so we need to fetch data from supabase aging, need to do something about this
    dispatch(optimisticFoldersAction.fetchAllFolders(user_id))
    dispatch(optimisticConversationsActions.initAllConversations(user_id));
    dispatch(optimisticDocumentActions.fetchAllDocuments(user_id));
  }, [isLoading, error]);

  // REFS ----------------------------------------------

  const containerRef = useRef<HTMLDivElement>(null);
  const stopConversationRef = useRef<boolean>(false);


  // BASIC HANDLERS --------------------------------------------

  const handleLightMode = (mode: 'dark' | 'light') => {
    dispatch(setLightMode(mode))
    localStorage.setItem('theme', mode);
  };

  const handleToggleChatbar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('showChatbar', JSON.stringify(!showSidebar));
  };


  // ON LOAD --------------------------------------------

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      setLightMode(theme as 'dark' | 'light');
    }

    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }

    const showChatbar = localStorage.getItem('showChatbar');
    if (showChatbar) {
      setShowSidebar(showChatbar === 'true');
    }

    const conversationHistory = localStorage.getItem('conversationHistory');
    if (conversationHistory) {
      const parsedConversationHistory: Conversation[] =
        JSON.parse(conversationHistory);
      const cleanedConversationHistory = cleanConversationHistory(
        parsedConversationHistory
      );
      setConversations(cleanedConversationHistory);
    }

  }, []);

  return (
    <>
      <Head>
        <title>BrainBot</title>
        <meta name="description" content="ChatGPT but better." />
        <meta
          name="viewport"
          content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`flex h-[calc(100vh_-_4rem)] min-w-full flex-col text-sm text-white dark:text-white ${lightmode}`}
      >
        <div
          className="flex h-full w-full pt-0 relative"
          ref={containerRef}
        >
          <Chatbar
            showSidebar={showSidebar}
            handleToggleChatbar={handleToggleChatbar}
            onToggleLightMode={handleLightMode}
          />
          <div className="flex flex-1 w-full">
            <Chat
              stopConversationRef={stopConversationRef}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatUI;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const defaultModelId =
    (process.env.DEFAULT_MODEL &&
      Object.values(OpenAIModelID).includes(
        process.env.DEFAULT_MODEL as OpenAIModelID
      ) &&
      process.env.DEFAULT_MODEL) ||
    fallbackModelID;

  const props = {
    defaultModelId,
    ...(await serverSideTranslations(context.locale ?? 'en', [
      'common',
      'chat',
      'sidebar',
      'markdown',
      'promptbar'
    ]))
  };

  // Combine with the props containing the document list
  return getDocumentListServerSideProps(context, props);
};
