import { useAppDispatch } from 'context/redux/store';
import { OpenAIModel } from '@/types/openai';
import classes from './Chat.module.css';
import { IconArrowDown, IconRepeat } from '@tabler/icons-react';
import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  memo,
  MouseEventHandler,
  MutableRefObject,
  useEffect,
  useState
} from 'react';
import {
  getCurrentConversationFromStore,
  optimisticCurrentConversationAction
} from 'context/redux/currentConversationSlice';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { getSearchSpaceFromStore } from '../../context/redux/searchSpaceSlice';
import classNames from 'classnames';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Props {
  model: OpenAIModel;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
  showScrollDownButton: boolean;
  handleScrollDown: MouseEventHandler;
}

export const ChatInput: FC<Props> = memo(
  ({ model, textareaRef, showScrollDownButton, handleScrollDown }) => {
    // ============== Redux State ==============
    const { loading, messageIsStreaming } = getCurrentConversationFromStore();
    const searchSpace = getSearchSpaceFromStore();
    const dispatch = useAppDispatch();

    // ============== Local State ==============
    const [content, setContent] = useState<string>();
    const [isTyping, setIsTyping] = useState<boolean>(false);

    // ============== Session Context ==============
    const { session } = useSessionContext();

    // ============== Handlers =====================
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const maxLength = model.maxLength;

      if (value.length > maxLength) {
        alert(
          `Message limit is ${maxLength} characters. You have entered ${value.length} characters.`
        );
        return;
      }

      setContent(value);
    };

    const handleSend = async () => {
      if (messageIsStreaming) return;

      if (!content) {
        alert('Please enter a message');
        return;
      }
      setContent('');

      // TODO: Handle errors
      await dispatch(
        optimisticCurrentConversationAction.userSent(
          content,
          session?.user?.id!
        )
      );
      await dispatch(
        optimisticCurrentConversationAction.startStreaming(
          session!,
          searchSpace
        )
      );

      if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
        textareaRef.current.blur();
      }
    };

    const isMobile = () => {
      const userAgent =
        typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
      return mobileRegex.test(userAgent);
    };

    const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !isTyping && !isMobile() && !e.shiftKey) {
        e.preventDefault();
        await handleSend();
      }
    };

    // ============== Adjust styling on page load =====================
    useEffect(() => {
      if (textareaRef && textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
        textareaRef.current.style.overflow = `${
          textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
        }`;
      }
    }, [content]);
  // ============== Adjust styling on page load =====================
  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
      textareaRef.current.style.overflow = `${textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
        }`;
    }
  }, [content]);

    // ======== Regenerate Button =======
    const RegenerateButton = (
      <button
        className={classNames(
          'sticky left-0 right-0 mb-3 md:mb-0 mx-auto',
          'flex w-fit items-center gap-3 rounded border border-neutral-200',
          'bg-white py-2 px-4 text-black hover:opacity-50 dark:border-neutral-600',
          'dark:bg-[#343541] dark:text-white'
        )}
        // onClick={onRegenerate}
      >
        <IconRepeat size={16} /> {'Regenerate response'}
      </button>
    );

    return (
      <div
        className={classNames(
          'absolute bottom-0 left-0 w-full border-t py-3',
          'bg-white dark:bg-neutral6 md:bg-transparent dark:md:bg-transparent',
          'dark:border-white/20',
          'border-t md:border-t-0 dark:border-white/20',
          'md:border-transparent md:dark:border-transparent',
          'md:bg-gradient-to-b md:from-transparent',
          'md:via-white dark:md:via-neutral6',
          'md:to-white dark:md:to-neutral6',
          'z-10 items-center justify-center'
        )}
      >
        <div className={'relative w-full'}>
          {showScrollDownButton && (
            <div className="absolute -top-16 right-0 mb-4 mr-4 pb-20 z-30">
              <button
                className={classNames(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  'bg-gray-300 text-white shadow-md hover:shadow-xl',
                  'focus:outline-none dark:bg-gray-700 dark:text-neutral-200',
                  'transition-shadow duration-150'
                )}
                onClick={handleScrollDown}
              >
                <IconArrowDown size={24} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
        <div
          className={classNames(
            'w-[calc(100%_-_3rem)] max-w-[50rem] xl:max-w-4xl relative flex rounded-xl',
            'mx-auto border-neutral3 bg-white dark:bg-neutral6',
            'dark:border-neutral5 border-2',
            'items-center justify-start'
          )}
        >
          <div className={'flex flex-row min-w-full max-w-full'}>
            <textarea
              ref={textareaRef}
              className={classNames(
                'grow border-0 max-w-[calc(100%_-_3.5rem)]',
                'bg-transparent pl-3 my-2 sm:pl-2 text-black dark:bg-transparent',
                'dark:text-white md:pl-4 focus:ring-0 whitespace-pre-wrap self-start',
                '!overflow-y-scroll resize-none max-h-[200px] relative'
              )}
              placeholder={'Type a message...'}
              value={content}
              rows={1}
              onCompositionStart={() => setIsTyping(true)}
              onCompositionEnd={() => setIsTyping(false)}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className={classNames(
                'absolute right-2',
                'rounded-sm p-1 text-neutral-800',
                'dark:bg-opacity-50 dark:text-neutral-100',
                'dark:hover:text-neutral-200',
                'bottom-2'
              )}
              onClick={handleSend}
            >
              {loading || messageIsStreaming ? (
                <div
                  className={classNames(
                    'h-6 w-6 animate-spin rounded-full border-t-2',
                    'border-neutral-800 opacity-60 dark:border-neutral3',
                    'relative bottom-1'
                  )}
                ></div>
              ) : (
                <div
                  className={classNames(
                    'flex items-center justify-center w-8 h-8 rounded-lg',
                    content && content.length > 0
                      ? classes.messageSendButton
                      : 'bg-transparent'
                  )}
                >
                  <PaperAirplaneIcon
                    className={classNames(
                      'w-6 h-6',
                      content && content.length > 0
                        ? 'stroke-white'
                        : 'fill-neutral4/30 dark:fill-neutral4 stroke-white dark:stroke-neutral6'
                    )}
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);
  return (
    <div
      className="sm:absolute sm:bottom-0 left-0 w-full border-transparent
    bg-gradient-to-b from-transparent via-white to-white pt-6
    dark:border-white/20 dark:via-[#343541] dark:to-[#343541] md:pt-2
      sticky z-10 bottom-2
    "
    >
      <div className="stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl">
        {messageIsStreaming && (
          <button
            className="absolute top-0 left-0 right-0 mb-3 md:mb-0 md:mt-2 mx-auto flex w-fit items-center gap-3 rounded border border-neutral-200 bg-white py-2 px-4 text-black hover:opacity-50 dark:border-neutral-600 dark:bg-[#343541] dark:text-white"
            onClick={handleStopConversation}
          >
            <IconPlayerStop size={16} /> {'Stop Generating'}
          </button>
        )}

        {/* // TODO: Regenerate response */}
        {/*{!messageIsStreaming && (*/}
        {/*  <button*/}
        {/*    className="absolute top-0 left-0 right-0 mb-3 md:mb-0 md:mt-2 mx-auto flex w-fit items-center gap-3 rounded border border-neutral-200 bg-white py-2 px-4 text-black hover:opacity-50 dark:border-neutral-600 dark:bg-[#343541] dark:text-white"*/}
        {/*    // onClick={onRegenerate}*/}
        {/*    */}
        {/*  >*/}
        {/*    <IconRepeat size={16} /> {'Regenerate response'}*/}
        {/*  </button>*/}
        {/*)}*/}

        <div className="relative mx-2 flex w-full flex-grow flex-col rounded-md border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-[#40414F] dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] sm:mx-4">
          <textarea
            ref={textareaRef}
            className="m-0 w-full resize-none border-0 bg-transparent p-0 py-2 pr-8 pl-2 text-black dark:bg-transparent dark:text-white md:py-3 md:pl-4 focus:ring-0"
            style={{
              resize: 'none',
              bottom: `${textareaRef?.current?.scrollHeight}px`,
              maxHeight: '400px',
              overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400
                  ? 'auto'
                  : 'hidden'
                }`
            }}
            placeholder={'Type a message...'}
            value={content}
            rows={1}
            onCompositionStart={() => setIsTyping(true)}
            onCompositionEnd={() => setIsTyping(false)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
            onClick={handleSend}
          >
            {messageIsStreaming ? (
              <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60 dark:border-neutral-100"></div>
            ) : (
              <IconSend size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
