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
    const { loading, messageIsStreaming, disableInput } = getCurrentConversationFromStore();
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

      const userInput = content;
      setContent('');

      // TODO: Handle errors
      await dispatch(
        optimisticCurrentConversationAction.userSent(
          userInput,
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
                  'focus:outline-none dark:bg-zinc-600 dark:text-neutral-200',
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
            'items-center justify-start',
          )}
        >
          <div className={classNames(
            'flex flex-row min-w-full max-w-full',

            // `${disableInput ? "bg-gray-600 dark:bg-slate-600" : "bg-transparent dark:bg-transparent"}`
          )
          }>
            <textarea
              ref={textareaRef}
              className={classNames(
                'grow border-0 max-w-[calc(100%_-_3.5rem)]',
                'pl-3 my-2 sm:pl-2 text-black ',
                'dark:text-white md:pl-4 focus:ring-0 whitespace-pre-wrap self-start',
                '!overflow-y-scroll resize-none max-h-[200px] relative scrollbar-hide',
              )}
              placeholder={disableInput?'':'Type a message...'}
              value={content}
              disabled={disableInput}
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
              {(loading || messageIsStreaming) ? (
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
