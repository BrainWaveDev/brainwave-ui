import classNames from 'classnames';
import { memo, useMemo } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { ArrowSmallRightIcon } from '@heroicons/react/24/outline';
import {
  getCurrentConversationFromStore,
  optimisticCurrentConversationAction,
  showPromptSelector
} from '../../context/redux/currentConversationSlice';
import { useAppDispatch } from '../../context/redux/store';
import { optimisticConversationsActions } from '../../context/redux/conversationsSlice';
import { getPromptsFromStorage } from '../../context/redux/promptSlice';

type PromptSelector = {
  id: number;
  name: string;
  description?: string;
  onSelect: () => void;
  icon?: any;
};

function PromptSelector() {
  // ===== Redux State =====
  const dispatch = useAppDispatch();
  const { conversation: currentConversation } =
    getCurrentConversationFromStore();
  const { prompts: predefinedPrompts } = getPromptsFromStorage();

  // ===== Prepare prompt selectors =====
  const prompts: PromptSelector[] = useMemo(() => {
    return predefinedPrompts.map((prompt) => {
      const onSelect = () => {
        if (!currentConversation) {
          dispatch(
            optimisticConversationsActions.createConversation(prompt.id)
          );
        }
        else {
          if (currentConversation.isPlaceholder) {
            dispatch(showPromptSelector(false))
            dispatch(
              optimisticCurrentConversationAction.selectConversationPrompt(
                prompt.id
              )
            );
          } else {
            dispatch(
              optimisticConversationsActions.createConversation(prompt.id)
            );
          }
        }
      };
      let icon: any = null;
      if (prompt.name === 'Q&A') icon = QuestionMarkCircleIcon;

      return {
        ...prompt,
        onSelect,
        icon
      };
    });
  }, [currentConversation, dispatch]);

  return (
    <div
      className={classNames(
        'flex flex-col justify-start items-center w-full max-h-full',
        'px-7 md:px-10 py-10 2xl:py-12 md:pt-0 md:pb-6',
        'overflow-y-auto scroll-smooth scrollbar-none'
      )}
    >
      <div className="mb-10 text-center">
        <h1
          className={classNames(
            'text-neutral7 dark:text-neutral1 font-bold text-3xl',
            'sm:text-4xl mb-4'
          )}
        >
          Explore your knowledge base
        </h1>
        <h2 className="text-xl sm:text-2xl text-neutral4 font-light">
          Ask questions, summarize and analyze content of your documents
        </h2>
      </div>
      <div
        // Select specific prompt
        className="w-full max-w-full md:w-fit sm:max-w-[90%] mx-auto"
      >
        {prompts.map((prompt, index) => (
          <SelectPrompt prompt={prompt} key={index} />
        ))}
      </div>
    </div>
  );
}

export default memo(PromptSelector);

const SelectPrompt = memo(({ prompt }: { prompt: PromptSelector }) => {
  // ==== Styling ====
  const PromptContainer = classNames(
    'group flex flex-row items-center mb-5 p-3.5 border border-neutral3 rounded-xl',
    'transition-all duration-300 hover:border-transparent w-full min-w-full md:min-w-fit-content',
    'hover:shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0px_2rem_1.5rem_-1rem_rgba(0,0,0,0.12)]',
    'active:shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0px_2rem_1.5rem_-1rem_rgba(0,0,0,0.12)]',
    'dark:hover:bg-neutral7 dark:active:bg-neutral7 cursor-pointer',
    'dark:border-neutral5 dark:hover:border-neutral7 dark:active:border-neutral7',
    'focus:outline-none focus:ring-0 dark:focus:ring-0 dark:focus:outline-none'
  );

  return (
    <div className={PromptContainer} onClick={prompt.onSelect}>
      <div className="relative flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 mr-6">
        <div className="absolute inset-0 opacity-20 rounded-xl bg-teal-300" />
        {prompt.icon && (
          <prompt.icon
            className={
              'inline-block h-6 w-6 sm:w-8 sm:h-8 relative z-1 fill-teal-400'
            }
          />
        )}
      </div>
      <div
        className={classNames(
          'flex flex-col justify-start items-start gap-y-1 text-neutral7 mr-3 text-left flex-grow',
          'max-w-[calc(100%_-_8.5rem)] md:max-w-none'
        )}
      >
        <h2
          className={'text-xl font-semibold text-neutral7 dark:text-neutral1'}
        >
          {prompt.name}
        </h2>
        {prompt.description && (
          <p
            className={classNames(
              'text-sm md:text-base inline-block text-neutral4',
              'group-hover:text-neutral7 group-active:text-neutral7',
              'dark:group-hover:text-neutral1 dark:group-active:text-neutral1',
              'transition-colors duration-300'
            )}
          >
            {prompt.description}
          </p>
        )}
      </div>
      <ArrowSmallRightIcon
        className={classNames(
          'inline-block w-6 h-6 ml-3.5 stroke-neutral4 transition-colors',
          'group-hover:stroke-neutral7 dark:group-hover:stroke-neutral4'
        )}
        strokeWidth={2}
      />
    </div>
  );
});
