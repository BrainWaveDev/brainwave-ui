import Chat from '@/components/Chat/Chat';
import { useEffect } from 'react';
import { initStore, useAppDispatch } from 'context/redux/store';
import { Conversation } from '@/types/chat';
import { cleanConversationHistory } from '@/utils/app/clean';
import { setConversations } from 'context/redux/conversationsSlice';
import { removeAll } from '@/utils/app/localcache';
import PromptSelector from '@/components/ui/PromptSelector';
import {
  clearSelectedConversation,
  getCurrentConversationFromStore
} from 'context/redux/currentConversationSlice';
import { NextSeo } from 'next-seo';
import { getURL } from '@/utils/helpers';

const ChatUI = () => {
  // ========= Redux State =========
  const dispatch = useAppDispatch();
  const { conversation: currentConversation } =
    getCurrentConversationFromStore();

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

    // Clear conversations from local storage on page load
    removeAll('conversation');

    // Clear currently selected conversation on component unmount
    return () => {
      dispatch(clearSelectedConversation());
    };
  }, [dispatch]);


  // ===== Render prompt selector if no conversation is selected =====
  const renderPromptSelector =
    !currentConversation || !currentConversation.promptId;

  return (
    <>
      <NextSeo canonical={`${getURL()}chat`} />
      {renderPromptSelector ? <PromptSelector /> : <Chat />}
    </>
  );
};

export default ChatUI;
export const getServerSideProps = initStore;
