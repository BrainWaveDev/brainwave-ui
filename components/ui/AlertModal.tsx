import React, { Dispatch, memo, SetStateAction } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';

export interface ModalState {
  open: boolean;
  title: string;
  description: string;
}

export const setModalOpen =
  (open: boolean) => (prevState: ModalState | null) => {
    if (prevState) {
      return { ...prevState, open };
    } else {
      return null;
    }
  };

// Styling for different kinds of buttons
const ButtonClasses = (type: 'Regular' | 'Confirmation') => {
  switch (type) {
    case 'Regular':
      return classNames(
        'bg-mauve4 dark:bg-zinc-900 hover:bg-mauve5 dark:hover:text-gray-300',
        'focus:shadow-mauve7 dark:shadow-zinc-900 text-mauve11 inline-flex',
        'h-8 sm:h-10 text-sm sm:text-base',
        'items-center justify-center rounded-[4px] px-[15px] font-medium',
        'leading-none outline-none focus:shadow-[0_0_0_2px]'
      );
    case 'Confirmation':
      return classNames(
        'text-red11 dark:text-white bg-red4 dark:bg-red-600 hover:bg-red5',
        'dark:hover:bg-red-500 focus:shadow-red7 inline-flex',
        'h-8 sm:h-10 items-center justify-center rounded-[4px] px-[15px]',
        'font-medium leading-none outline-none focus:shadow-[0_0_0_2px]',
        'text-sm sm:text-base'
      );
  }
};
export const ModalActionButton = memo(
  ({
    text,
    type,
    onClick
  }: {
    text: string;
    type: 'Regular' | 'Confirmation';
    onClick: () => void;
  }) => {
    return (
      <AlertDialog.Action>
        <button className={ButtonClasses(type)} onClick={onClick}>
          {text}
        </button>
      </AlertDialog.Action>
    );
  }
);

export default function AlertModal({
  modalState,
  setModalState,
  actionButtons
}: {
  modalState: ModalState;
  setModalState: Dispatch<SetStateAction<ModalState | null>>;
  actionButtons: JSX.Element | JSX.Element[];
}) {
  const { open, title, description } = modalState;
  return (
    <AlertDialog.Root
      defaultOpen={false}
      open={open}
      onOpenChange={(open: boolean) => setModalState(setModalOpen(open))}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="z-40 bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
        <AlertDialog.Content
          className={classNames(
            'z-40 data-[state=open]:animate-contentShow fixed top-[50%]',
            'left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%]',
            'translate-y-[-50%] rounded-[6px] bg-white dark:bg-zinc-800 p-[15px] md:p-[25px]',
            'shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]',
            'focus:outline-none'
          )}
        >
          <AlertDialog.Title className="text-red-600 dark:text-red-500 m-0 text-base md:text-lg font-medium">
            <div
              className={
                'text-base md:text-lg flex flex-row gap-x-2 items-center font-medium'
              }
            >
              <ExclamationTriangleIcon
                className={'mt-0 w-4 h-4 sm:w-5 sm:h-5'}
                strokeWidth={2}
              />
              {title}
            </div>
          </AlertDialog.Title>
          <AlertDialog.Description className="text-mauve11 dark:text-gray-400 mt-4 mb-5 text-sm md:text-base leading-normal">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-3">{actionButtons}</div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
