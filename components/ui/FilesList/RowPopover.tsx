import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { MixerHorizontalIcon, Cross2Icon } from '@radix-ui/react-icons';

interface RowPopoverProp {
  handleDelete: () => void;
}

const RowPopover = (prop:RowPopoverProp) => (
  <Popover.Root>
    <Popover.Trigger asChild>
      <button className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
        </svg>
      </button>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content
        className="rounded p-5 w-[80px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
        sideOffset={5}
      >
        <div className="flex flex-col items-center">
          
          <fieldset className="flex gap-5 items-center">
            <button
              className="text-[13px] text-violet11 w-[75px] text-center"
              onClick={prop.handleDelete}
            >
              Delete
            </button>
           
          </fieldset>
        </div>
        
        <Popover.Arrow className="fill-white" />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

export default RowPopover;
