import { Message } from '@/types/chat';
import { IconCheck, IconEdit } from '@tabler/icons-react';
import {
  FC,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  KeyboardEvent
} from 'react';
import rehypeMathjax from 'rehype-mathjax';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { CodeBlock } from '../Markdown/CodeBlock';
import { MemoizedReactMarkdown } from '../Markdown/MemoizedReactMarkdown';
import AppLogo from '@/components/icons/AppLogo';
import UserIcon from '@/components/icons/UserIcon';
import rehypeRaw from 'rehype-raw';
import classNames from 'classnames';
import LoadingDots from '@/components/ui/LoadingDots';
import { setStopConversation } from '../../context/redux/currentConversationSlice';
import { useAppDispatch } from '../../context/redux/store';
import { PauseCircleIcon } from '@heroicons/react/24/solid';

interface Props {
  message: Message;
  messageIndex: number;
  // Indicate whether the message is the response from the assistant
  displayLoadingState: boolean;
  streamingMessage: boolean;
}

export const ChatMessage: FC<Props> = ({
  message,
  displayLoadingState,
  streamingMessage
}) => {
  // ======================= Redux State =======================
  const dispatch = useAppDispatch();

  // ======================= Local State =======================
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState(message.content);
  const [messagedCopied, setMessageCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isAssistantMessage = message.role === 'assistant';

  // ======================= Handlers =======================
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageContent(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleEditMessage = () => {
    if (message.content != messageContent) {
      // TODO: Implement editing messages
      // onEditMessage({ ...message, content: messageContent }, messageIndex);
    }
    setIsEditing(false);
  };

  const handlePressEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isTyping && !e.shiftKey) {
      e.preventDefault();
      handleEditMessage();
    }
  };

  const copyOnClick = () => {
    if (!navigator.clipboard) return;

    navigator.clipboard.writeText(message.content).then(() => {
      setMessageCopied(true);
      setTimeout(() => {
        setMessageCopied(false);
      }, 2000);
    });
  };

  const handleStopConversation = () => {
    dispatch(setStopConversation(true));
  };

  // ======================= Initialize UI on page load =======================
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  // ===== Tailwind Classes =====
  const assistantMessageClasses = classNames(
    'bg-neutral2 border-[3px] border-transparent dark:bg-neutral7'
  );
  const userMessageClasses = classNames(
    'pt-6 pb-16 md:pb-14 px-6 border-neutral2 dark:border-transparent dark:bg-neutral5/50'
  );

  // ======= TODO: Enable message editing =======
  const MessageEdit = (
    <div className="flex w-full flex-col">
      <textarea
        ref={textareaRef}
        className="w-full resize-none whitespace-pre-wrap border-none dark:bg-[#343541]"
        value={messageContent}
        onChange={handleInputChange}
        onKeyDown={handlePressEnter}
        onCompositionStart={() => setIsTyping(true)}
        onCompositionEnd={() => setIsTyping(false)}
        style={{
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
          padding: '0',
          margin: '0',
          overflow: 'hidden'
        }}
      />

      <div className="mt-10 flex justify-center space-x-4">
        <button
          className="h-[40px] rounded-md bg-blue-500 px-4 py-1 text-sm font-medium text-white enabled:hover:bg-blue-600 disabled:opacity-50"
          onClick={handleEditMessage}
          disabled={messageContent.trim().length <= 0}
        >
          Save & Submit
        </button>
        <button
          className="h-[40px] rounded-md border border-neutral-300 px-4 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          onClick={() => {
            setMessageContent(message.content);
            setIsEditing(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
  const MessageEditButton = (window.innerWidth < 640 || !isEditing) && (
    <button
      className={`absolute translate-x-[1000px] text-gray-500 hover:text-gray-700 focus:translate-x-0 group-hover:translate-x-0 dark:text-gray-400 dark:hover:text-gray-300 ${
        window.innerWidth < 640 ? 'right-3 bottom-1' : 'right-0 top-[26px]'
      }
                    `}
      onClick={toggleEditing}
    >
      <IconEdit size={20} />
    </button>
  );

  return (
    <div
      className={classNames(
        'max-w-[50rem]',
        isAssistantMessage ? 'mr-auto' : 'ml-auto'
      )}
      style={{ overflowWrap: 'anywhere' }}
    >
      <div
        className={classNames(
          'flex relative rounded-[1.25rem] group pt-6 px-6 space-y-4',
          'border-[3px] pb-16 w-full',
          isAssistantMessage ? assistantMessageClasses : userMessageClasses
        )}
      >
        <div className="prose mt-[-2px] dark:prose-invert min-w-full max-w-full">
          {message.role === 'user' ? (
            <div className="prose dark:prose-invert min-w-full max-w-full">
              {message.content}
            </div>
          ) : displayLoadingState ? (
            <LoadingDots />
          ) : (
            <MemoizedReactMarkdown
              className="prose dark:prose-invert min-w-full max-w-full"
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeMathjax, rehypeRaw]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');

                  return !inline && match ? (
                    <CodeBlock
                      key={Math.random()}
                      language={match[1]}
                      value={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return (
                    <table className="border-collapse border border-black py-1 px-3 dark:border-white">
                      {children}
                    </table>
                  );
                },
                th({ children }) {
                  return (
                    <th className="break-words border border-black bg-gray-500 py-1 px-3 text-white dark:border-white">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="break-words border border-black py-1 px-3 dark:border-white">
                      {children}
                    </td>
                  );
                }
              }}
            >
              {message.content}
            </MemoizedReactMarkdown>
          )}
        </div>
      </div>
      <div
        className={classNames(
          'relative flex flex-row -mt-8 w-full',
          'items-center',
          isAssistantMessage
            ? 'pl-6 place-content-between'
            : 'pr-6 place-content-end'
        )}
      >
        <div
          className={classNames(
            'p-2 rounded-xl border-4',
            isAssistantMessage
              ? 'border-transparent '
              : 'bg-gray-300 border-white dark:bg-zinc-700 dark:border-zinc-700'
          )}
        >
          {isAssistantMessage ? (
            <AppLogo width={50} height={50} />
          ) : (
            <UserIcon
              className={classNames(
                'w-8 h-8 stroke-white dark:stroke-gray-300 mx-[1px]'
              )}
              strokeWidth={1.5}
            />
          )}
        </div>
        <div className={'mt-8 flex flex-row items-center'}>
          {/* Pause generation button */}
          {streamingMessage && (
            <button
              className={classNames(
                'group flex items-center ml-3 px-2 py-0.5 leading-6',
                'bg-neutral2 dark:bg-neutral7 rounded-md',
                'text-neutral6 dark:text-gray-100',
                'hover:text-teal-300 dark:hover:text-teal-300',
                'transition-all duration-150'
              )}
              onClick={handleStopConversation}
            >
              <PauseCircleIcon
                className={classNames(
                  'inline-block w-4 h-4 mr-2 transition-all duration-150',
                  'fill-neutral6 dark:fill-gray-100 group-hover:fill-teal-300'
                )}
              />
              <span className={'-mt-[0.05rem]'}>Stop generating</span>
            </button>
          )}
          {isAssistantMessage &&
            !displayLoadingState &&
            !streamingMessage &&
            (messagedCopied ? (
              <IconCheck
                size={20}
                className="text-green-500 dark:text-green-400"
              />
            ) : (
              <button
                className={classNames(
                  'text-base ml-3 px-2.5 py-0.5 rounded-lg',
                  'bg-neutral2 dark:bg-neutral7',
                  'text-neutral6 dark:text-gray-100',
                  'hover:text-teal-300 dark:hover:text-teal-300',
                  'transition-colors duration-150'
                )}
                onClick={copyOnClick}
              >
                Copy
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
