import React, { Dispatch, SetStateAction } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export enum ModalType {
  Warning,
  Alert
}

export interface ModalState {
  open: boolean;
  title: string;
  description: string;
  type: ModalType;
}

export const setModalOpen =
  (open: boolean) => (prevState: ModalState | null) => {
    if (prevState) {
      return { ...prevState, open };
    } else {
      return null;
    }
  };

export default function AlertModal({
  modalState,
  setModalState,
  actionButtons
}: {
  modalState: ModalState;
  setModalState: Dispatch<SetStateAction<ModalState | null>>;
  actionButtons: JSX.Element;
}) {
  const { open, title, description, type } = modalState;
  return (
    <AlertDialog.Root
      defaultOpen={false}
      open={open}
      onOpenChange={(open: boolean) => setModalState(setModalOpen(open))}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="z-20 bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
        <AlertDialog.Content className="z-20 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <AlertDialog.Title className="text-red-600 m-0 text-[17px] font-medium">
            {type === ModalType.Alert && (
              <div className={'flex flex-row gap-x-2 items-center font-medium'}>
                <ExclamationTriangleIcon
                  className={'mt-0.5 w-4 h-4'}
                  strokeWidth={2}
                />
                {title}
              </div>
            )}
            {type === ModalType.Warning && title}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-[25px]">{actionButtons}</div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
