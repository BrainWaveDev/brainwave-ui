import { FC } from 'react';
import classNames from 'classnames';

interface Props {
  className?: string;
  text?: string;
  icon: JSX.Element;
  onClick: () => void;
}

export const SidebarButton: FC<Props> = ({
  className = '',
  text,
  icon,
  onClick
}) => {
  return (
    <button
      className={classNames(
        className,
        'flex w-full cursor-pointer select-none items-center gap-3',
        'rounded-lg py-2.5 px-2 text-sm leading-3 text-neutral-400 transition-colors',
        'duration-200 hover:text-neutral-100 hover:bg-gray-500/10',
        !text && 'justify-center'
      )}
      onClick={onClick}
    >
      <div>{icon}</div>
      {text && <span>{text}</span>}
    </button>
  );
};
