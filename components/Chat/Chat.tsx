import { Conversation, Message } from '../../types/chat';
import { KeyValuePair } from '../../types/data';
import { ErrorMessage } from '../../types/error';
import { OpenAIModel, OpenAIModelID } from '../../types/openai';
import { Prompt } from '../../types/prompt';
import { throttle } from '../../utils';
import { IconArrowDown, IconClearAll, IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import {
  FC,
  memo,
  MutableRefObject,
  useEffect,
  useRef,
  useState
} from 'react';
import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import { ChatMessage } from './ChatMessage';
import AppLogo from '@/components/icons/AppLogo';

interface Props {
  conversation: Conversation;
  messageIsStreaming: boolean;
  loading: boolean;
  prompts: Prompt[];
  onSend: (message: Message, deleteCount?: number) => void;
  onUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair
  ) => void;
  onEditMessage: (message: Message, messageIndex: number) => void;
  stopConversationRef: MutableRefObject<boolean>;
}

export const Chat: FC<Props> = memo(
  ({
    conversation,
    messageIsStreaming,
    loading,
    prompts,
    onSend,
    onEditMessage,
    stopConversationRef
  }) => {
    const [currentMessage, setCurrentMessage] = useState<Message>();
    const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
    const [showScrollDownButton, setShowScrollDownButton] =
      useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    const scrollDown = () => {
      if (autoScrollEnabled) {
        messagesEndRef.current?.scrollIntoView(true);
      }
    };
    const throttledScrollDown = throttle(scrollDown, 250);

    // appear scroll down button only when user scrolls up

    useEffect(() => {
      throttledScrollDown();
      setCurrentMessage(
        conversation.messages[conversation.messages.length - 2]
      );
    }, [conversation.messages, throttledScrollDown]);

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



    const EmptyConversationCover = <>
      <div className="mx-auto flex w-[350px] flex-col space-y-10 pt-12 sm:w-[600px]">
        <div className="text-center text-3xl font-semibold text-gray-800 dark:text-gray-100">
          <div>
            <>
              <div
                className={'flex flex-row items-center place-content-center gap-x-2 mb-2'}
              >
                <AppLogo className={'w-10 h-10 mt-0.5'} />
                BrainBot
              </div>
              <div className="text-center text-xl text-gray-500 dark:text-gray-400">
                <div className="mb-2 md:whitespace-nowrap">
                  Start conversation with your documents by typing
                  a prompt below.
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </>;


    const Conversations = <>
      {conversation.messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          messageIndex={index}
          onEditMessage={onEditMessage} />
      ))}
      {loading && <ChatLoader />}
      <div
        className="h-[162px] bg-white dark:bg-[#343541]"
        ref={messagesEndRef} />
    </>;


    return (
      <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
        <>
          <div
            className="max-h-full overflow-x-hidden"
            ref={chatContainerRef}
            onScroll={handleScroll}
          >
            {conversation.messages.length === 0 ? (
              EmptyConversationCover
            ) : (
              Conversations
            )}
          </div>

          <ChatInput
            stopConversationRef={stopConversationRef}
            textareaRef={textareaRef}
            messageIsStreaming={messageIsStreaming}
            conversationIsEmpty={conversation.messages.length === 0}
            messages={conversation.messages}
            model={conversation.model}
            prompts={prompts}
            onSend={(message) => {
              setCurrentMessage(message);
              onSend(message);
            }}
            onRegenerate={() => {
              if (currentMessage) {
                onSend(currentMessage, 2);
              }
            }}
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
  }
);
Chat.displayName = 'Chat';
