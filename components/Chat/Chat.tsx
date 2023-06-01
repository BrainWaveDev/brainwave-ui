import { OpenAIModels } from '@/types/openai';
import { IconArrowDown } from '@tabler/icons-react';
import { memo, MutableRefObject, useEffect, useRef, useState } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage, LoadingChatMessage } from './ChatMessage';
import AppLogo from '@/components/icons/AppLogo';
import classNames from 'classnames';
import DocumentFilter from '@/components/Chat/DocumentFilter';
import { getCurrentConversationStateFromStore } from '../../context/redux/currentConversationSlice';

interface Props {
  stopConversationRef: MutableRefObject<boolean>;
}

export default memo(function Chat({ stopConversationRef }: Props) {
  // ============== Redux State ==============
  const { conversation: currentConversation,waitingForResponse } =
    getCurrentConversationStateFromStore();

  // ============== Element References ==============
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);

  // ============== Scrolling ==============
  const [showScrollDownButton, setShowScrollDownButton] =
    useState<boolean>(false);
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const bottomTolerance = 30;

      if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
        setAutoScrollEnabled(false);
        setShowScrollDownButton(true);
      } else {
        setAutoScrollEnabled(true);
        setShowScrollDownButton(false);
      }
    }
  };
  const handleScrollDown = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };


  // ============== Initiate Observers ==============
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAutoScrollEnabled(entry.isIntersecting);
        if (entry.isIntersecting) {
          textareaRef.current?.focus();
        }
      },
      {
        root: null,
        threshold: 0.5
      }
    );
    const messagesEndElement = messagesEndRef.current;
    if (messagesEndElement) {
      observer.observe(messagesEndElement);
    }
    return () => {
      if (messagesEndElement) {
        observer.unobserve(messagesEndElement);
      }
    };
  }, [messagesEndRef]);

  const EmptyConversationCover = (
    <div className="mx-auto flex w-[350px] flex-col space-y-10 sm:w-[600px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
      <div className="text-center text-3xl font-semibold text-gray-800 dark:text-gray-100">
        <div>
          <div
            className={'flex flex-row items-center place-content-center mb-2'}
          >
            <AppLogo className={'w-10 h-10 mt-0.5 mr-2 -ml-2'} />
            <span
              className={'bg-clip-text text-transparent bg-main-gradient m-0'}
            >
              Brain
            </span>
            Bot
          </div>
          <div className="text-center text-xl text-gray-500 dark:text-gray-400">
            <div className="mb-2 md:whitespace-nowrap">
              Start conversation with your documents by typing a prompt below.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const conditionalRender = () => {
    if (currentConversation && currentConversation.messages.length > 0) {
      return (
        <div className={'mt-1.5'}>
          {currentConversation.messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              messageIndex={index}
            />
          ))}
          {
            waitingForResponse && (
              <LoadingChatMessage />
            )
          }
          <div
            className="h-[162px] bg-white dark:bg-[#343541]"
            ref={messagesEndRef}
          />
        </div>
      )
    }

    if (currentConversation && currentConversation.messages.length === 0) {
      return (
        <div></div>
      )
    }

    if (!currentConversation || currentConversation.messages.length === 0) {
      return EmptyConversationCover
    }
  }

  return (
    <div className="relative flex-1 bg-white dark:bg-[#343541] min-h-full max-h-full">
      <>
        <div
          className={classNames(
            'min-h-full max-h-full overflow-x-hidden pt-16'
          )}
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          <DocumentFilter />
          {conditionalRender()}
        </div>
        <ChatInput
          stopConversationRef={stopConversationRef}
          textareaRef={textareaRef}
          // need to pass in the model here in the future
          model={OpenAIModels['gpt-3.5-turbo']}
        />
      </>
      {showScrollDownButton && (
        <div className="absolute bottom-0 right-0 mb-4 mr-4 pb-20">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-gray-800 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-neutral-200"
            onClick={handleScrollDown}
          >
            <IconArrowDown size={18} />
          </button>
        </div>
      )}
    </div>
  );
});
