import Chat from '@/components/Chat/Chat';
import Head from 'next/head';
import { useRef, useEffect } from 'react';
import { initStore } from 'context/redux/store';
import { Conversation } from '@/types/chat';
import { cleanConversationHistory } from '@/utils/app/clean';
import { setConversations } from 'context/redux/conversationsSlice';

const ChatUI = () => {
  // ========= Element References =========
  const stopConversationRef = useRef<boolean>(false);

  // ========= Initialize Conversations in the Local Storage =========
  // TODO: Use Redux Persist to store conversations state in the local storage
  useEffect(() => {
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
      <Chat stopConversationRef={stopConversationRef} />
    </>
  );
};

export default ChatUI;
export const getServerSideProps = initStore;
