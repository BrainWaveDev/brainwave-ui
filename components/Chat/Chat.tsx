import { OpenAIModels } from '@/types/openai';
import React, {
  memo,
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import AppLogo from '@/components/icons/AppLogo';
import DocumentFilter from '@/components/Chat/DocumentFilter';
import { getCurrentConversationFromStore } from '../../context/redux/currentConversationSlice';
import { throttle } from '@/utils/helpers';
import classNames from 'classnames';
import { RotatingLines } from 'react-loader-spinner';
import {
  getSidebarStateFromStorage,
  setSidebar
} from '../../context/redux/sidebarSlice';
import { useAppDispatch } from '../../context/redux/store';

export default memo(function Chat() {
  // ============== Redux State ==============
  const { conversation, fetchingConversation, loading, messageIsStreaming } =
    getCurrentConversationFromStore();
  const sidebarOpen = getSidebarStateFromStorage();
  const dispatch = useAppDispatch();

  const currentConversation = useMemo(() => {
    if (conversation && conversation.messages) {
      const messages = [...conversation.messages];
      // Resort to sorting by ID if index is not available
      return messages.sort((a, b) => {
        if (a.index && b.index) {
          return a.index - b.index;
        } else {
          return a.id! - b.id!;
        }
      });
    } else {
      return [];
    }
  }, [conversation]);

  // ============== Element References ==============
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ============== Scrolling ==============
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [showScrollDownButton, setShowScrollDownButton] =
    useState<boolean>(false);

  const adjustScrollProperties = () => {
    // Set scroll properties
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

  useEffect(() => {
    // Toggle show scroll down button on conversation change
    adjustScrollProperties();

    // Close sidebar when conversation changes on mobile
    if (window.innerWidth < 640) dispatch(setSidebar(false));
  }, [currentConversation]);

  const handleScrollDown: MouseEventHandler = (e) => {
    e.stopPropagation();
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  // ============== Handle Scrolling ==============
  const scrollDown = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView(true);
    }
  };
  const throttledScrollDown = throttle(scrollDown, 250);

  useEffect(() => {
    // may have problems with conversation undefined
    if (!currentConversation || currentConversation.length === 0) {
      return;
    }
    throttledScrollDown();
  }, [currentConversation, throttledScrollDown]);

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
    <div
      className={classNames(
        'mx-auto flex w-4/5 flex-col space-y-10 max-w-[600px] absolute',
        'top-1/2 left-1/2 -translate-x-1/2 -translate-y-full'
      )}
    >
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

  return (
    <div
      className={classNames(
        'relative flex flex-col items-center min-h-full !h-full max-h-full',
        fetchingConversation && 'justify-center',
        sidebarOpen && 'pointer-events-none'
      )}
    >
      {fetchingConversation ? (
        <RotatingLines
          strokeColor="#9ca3af"
          strokeWidth="2"
          animationDuration="1"
          width="3.25rem"
          visible={true}
        />
      ) : (
        <>
          <div
            className={classNames(
              'grow relative max-w-full min-w-full flex flex-col',
              'overflow-x-clip overflow-y-scroll px-5 pt-5 scrollbar-hide'
            )}
            onScroll={adjustScrollProperties}
            ref={chatContainerRef}
          >
            {/*<DocumentFilter />*/}
            {currentConversation && currentConversation.length > 0 ? (
              <div className={'space-y-10'}>
                {currentConversation.map((message, index) => {
                  const lastAssistantMessage =
                    index === currentConversation.length - 1 &&
                    message.role === 'assistant';
                  return (
                    <ChatMessage
                      key={index}
                      message={message}
                      messageIndex={index}
                      displayLoadingState={loading && lastAssistantMessage}
                      streamingMessage={
                        messageIsStreaming && lastAssistantMessage
                      }
                    />
                  );
                })}
                <div
                  className={'h-32 md:h-48 flex-shrink-0'}
                  ref={messagesEndRef}
                ></div>
              </div>
            ) : (
              EmptyConversationCover
            )}
          </div>
          <ChatInput
            textareaRef={textareaRef}
            // need to pass in the model here in the future
            model={OpenAIModels['gpt-3.5-turbo']}
            showScrollDownButton={showScrollDownButton}
            handleScrollDown={handleScrollDown}
          />
        </>
      )}
    </div>
  );
});
