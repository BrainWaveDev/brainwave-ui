import { FC, useState } from 'react';
import { SidebarButton } from '../Sidebar/SidebarButton';
import { CheckIcon } from '@heroicons/react/24/outline';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAppDispatch } from 'context/redux/store';
import { optimisticConversationsActions } from 'context/redux/conversationsSlice';
import { getModalStateFromStorage } from '../../context/redux/modalSlice';
import { toggleSidebar } from '../../context/redux/modalSlice';

export const ClearConversations: FC = () => {
  // ==============================
  // Redux State
  // ==============================
  const { sideBarOpen } = getModalStateFromStorage();
  const dispatch = useAppDispatch();
  const openSidebar = () => dispatch(toggleSidebar());
  // ==============================
  // Local State
  // ==============================
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  // ==============================
  // Handles
  // ==============================
  const handleClearConversations = async () => {
    await dispatch(optimisticConversationsActions.clearConversations());
    setIsConfirming(false);
  };

  // ==============================
  // Tailwind Classes
  // ==============================
  const IconClasses =
    'ml-auto h-[18px] w-[18px] min-w-[20px] text-neutral-400 hover:text-neutral-100';

  return isConfirming && sideBarOpen ? (
    <div className="flex w-full cursor-pointer items-center rounded-lg py-2.5 px-2 hover:bg-gray-500/10 mt-1">
      <TrashIcon className={'w-[18px] h-[18px]'} strokeWidth={2} />
      <div className="ml-3 flex-1 text-left text-sm leading-3 text-white">
        Are you sure?
      </div>
      <div className="flex w-[40px] gap-x-1 mr-0.5">
        <CheckIcon
          className={IconClasses}
          onClick={async (e) => {
            e.stopPropagation();
            await handleClearConversations();
          }}
        />
        <XMarkIcon
          className={IconClasses}
          onClick={(e) => {
            e.stopPropagation();
            setIsConfirming(false);
          }}
        />
      </div>
    </div>
  ) : (
    <SidebarButton
      className={'mt-1'}
      text={sideBarOpen ? 'Clear conversations' : undefined}
      icon={<TrashIcon className={'w-[18px] h-[18px]'} strokeWidth={2} />}
      onClick={() => {
        if (!sideBarOpen) openSidebar();
        setIsConfirming(true);
      }}
    />
  );
};
