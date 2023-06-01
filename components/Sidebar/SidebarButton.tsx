import { FC } from 'react';
import classNames from 'classnames';

interface Props {
  text: string;
  icon: JSX.Element;
  onClick: () => void;
}

export const SidebarButton: FC<Props> = ({ text, icon, onClick }) => {
  return (
    <button
      className={classNames(
        'flex w-full cursor-pointer select-none items-center gap-3',
        'rounded-lg py-2.5 px-2 text-sm leading-3 text-white/75 transition-colors',
        'duration-200 hover:text-white hover:bg-gray-500/10'
      )}
      onClick={onClick}
    >
      <div>{icon}</div>
      <span>{text}</span>
    </button>
  );
};
