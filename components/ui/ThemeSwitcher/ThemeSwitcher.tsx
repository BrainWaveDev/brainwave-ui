'use client';
import classNames from 'classnames';
import Sun from '@/components/icons/Sun';
import HalfMoon from '@/components/icons/HalfMoon';

export default function ThemeSwitcher({
  isDarkTheme,
  setTheme
}: {
  isDarkTheme: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
}) {
  return (
    <div
      className={classNames(
        'relative flex w-full p-1 bg-neutral-800 rounded-xl before:absolute before:left-1 before:top-1',
        'before:bottom-1 before:w-[calc(50%-0.25rem)] before:bg-zinc-900 before:rounded-[0.625rem] before:transition-all',
        isDarkTheme && 'before:translate-x-full'
      )}
      key={isDarkTheme ? 'dark' : 'light'}
    >
      <button
        className={classNames(
          'relative z-1 group flex justify-center items-center h-10 basis-1/2 base2',
          'font-semibold transition-colors hover:text-white focus:ring-0',
          !isDarkTheme ? 'text-white' : 'text-white/50'
        )}
        onClick={() => {
          setTheme('light');
        }}
      >
        <Sun
          className={classNames(
            'inline-block w-6 h-6',
            'transition-colors group-hover:fill-white mr-3',
            !isDarkTheme ? 'fill-white' : 'fill-white/50'
          )}
        />
        Light
      </button>
      <button
        className={classNames(
          'relative z-1 group flex justify-center items-center h-10 basis-1/2 base2',
          'font-semibold transition-colors hover:text-white focus:ring-0',
          isDarkTheme ? 'text-white' : 'text-white/50'
        )}
        onClick={() => {
          setTheme('dark');
        }}
      >
        <HalfMoon
          className={classNames(
            'inline-block w-6 h-6',
            'transition-colors group-hover:fill-white mr-3',
            isDarkTheme ? 'fill-white' : 'fill-white/50'
          )}
        />
        Dark
      </button>
    </div>
  );
}
