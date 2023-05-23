import { memo } from 'react';
import classNames from 'classnames';
import classes from './Sidebar.module.css';
import SidebarOpen from '@/components/icons/SidebarOpen';
import SidebarClose from '@/components/icons/SidebarClose';
import Logo from '@/components/icons/Logo';
// @ts-ignore
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftIcon, FolderIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as Separator from '@radix-ui/react-separator';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import useThemeDetector from '../../../hooks/useThemeDetector';
import Sun from '@/components/icons/Sun';
import HalfMoon from '@/components/icons/HalfMoon';

const NavLinks = [
  {
    name: 'Chat',
    href: '/new-ui',
    icon: ChatBubbleLeftIcon
  },
  {
    name: 'Files',
    href: '/files',
    icon: FolderIcon
  }
];

export default memo(function Sidebar({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: () => void;
}) {
  const router = useRouter();
  const sidebarDisplay = open
    ? 'z-20 sm:z-10 sm:w-[20rem] sm:min-w-[20rem]'
    : '-z-20 sm:z-10 sm:w-24 sm:min-w-24';
  // Detecting and setting browser theme
  const [isDarkTheme, setDarkTheme] = useThemeDetector();
  const setTheme = (theme: 'dark' | 'light') => {
    if (document && document.documentElement) {
      document.documentElement.setAttribute('data-theme', theme);
      // @ts-ignore
      setDarkTheme(theme === 'dark');
    }
  };

  return (
    // TODO: Add animation for sidebar open and close
    <aside className={classNames(classes.sidebar, sidebarDisplay)}>
      <div
        className={classNames(
          'flex flex-row w-full items-center h-12 mb-6 place-content-between'
        )}
      >
        {open && (
          <div className={classNames('flex flex-row items-center gap-x-3')}>
            <Logo className={'h-16 w-16'} />
            <h3 className={'text-2xl font-bold'}>BrainWave</h3>
          </div>
        )}
        <button
          className="hidden sm:block group focus:ring-0 h-fit mt-0.5 ml-3 cursor-pointer"
          onClick={() => setOpen()}
        >
          {open ? (
            <SidebarClose
              className={classNames(
                classes.openAndCloseButton,
                'group-hover:fill-white'
              )}
            />
          ) : (
            <SidebarOpen
              className={classNames(
                classes.openAndCloseButton,
                'group-hover:fill-white'
              )}
            />
          )}
        </button>
      </div>
      <div
        className={classNames(
          'flex flex-col justify-between flex-1 mt-6 w-full'
        )}
      >
        <nav className={'flex flex-col items-start gap-y-3'}>
          {NavLinks.map((link) => (
            <Link
              href={link.href}
              className={classNames(
                'flex items-center place-content-start py-6 h-5 rounded-lg relative',
                'focus:ring-0 group cursor-pointer w-full place-content-start',
                router.pathname === link.href &&
                  'bg-gradient-to-l from-[#323337] to-[rgba(70,79,111,0.3)] shadow-[inset_0px_0.0625rem_0_rgba(255,255,255,0.05),0_0.25rem_0.5rem_0_rgba(0,0,0,0.1)]'
              )}
              key={'sidebar-link-' + link.name}
            >
              <link.icon
                className={'w-6 h-6 fill-white/80 group-hover:fill-white mx-3'}
              />
              {open && (
                <span
                  className={
                    'ml-2 font-semibold text-md text-white/80 group-hover:text-white transition-all'
                  }
                >
                  {link.name}
                </span>
              )}
            </Link>
          ))}
          <Separator.Root className="bg-neutral-800 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px" />
          <Disclosure>
            {({ open: chatListOpen }) => (
              <>
                <Disclosure.Button
                  className={classNames(
                    'group flex items-center w-full h-7 px-2 py-6',
                    'gap-x-5 text-left text-md text-white/50 focus:ring-0'
                  )}
                >
                  <ChevronUpIcon
                    className={classNames(
                      'h-7 w-7 text-white/50 group-hover:fill-white active:fill-white transition-all duratiowhite50',
                      chatListOpen && 'rotate-180 transform'
                    )}
                  />
                  {open && (
                    <span
                      className={
                        'font-semibold text-md text-white/50 group-hover:text-white transition-all duratiowhite50 grow'
                      }
                    >
                      Chat list
                    </span>
                  )}
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                  If you're unhappy with your purchase for any reason, email us
                  within 90 days and we'll refund you in full, no questions
                  asked.
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </nav>
        <div
          className={classNames(
            'relative flex w-full p-1 bg-neutral-800 rounded-xl before:absolute before:left-1 before:top-1 ml-0 mb-1.5',
            'before:bottom-1 before:w-[calc(50%-0.25rem)] before:bg-zinc-900 before:rounded-[0.625rem] before:transition-all',
            isDarkTheme && 'before:translate-x-full',
            !open && 'before:hidden place-content-center' // scale-125'
          )}
        >
          {(open || isDarkTheme) && (
            <button
              className={classNames(
                'relative z-1 group flex justify-center items-center h-10',
                'font-semibold transition-colors hover:text-white focus:ring-0 cursor-pointer',
                isDarkTheme ? 'text-white/50' : 'text-white',
                open ? 'basis-1/2' : 'basis-1'
              )}
              onClick={() => {
                setTheme('light');
              }}
            >
              <Sun
                className={classNames(
                  'inline-block w-6 h-6',
                  'transition-colors group-hover:fill-white',
                  !isDarkTheme ? 'fill-white' : 'fill-white/50',
                  open ? 'mr-3' : 'mr-0'
                )}
              />
              {open && 'Light'}
            </button>
          )}
          {(open || !isDarkTheme) && (
            <button
              className={classNames(
                'relative z-1 group flex justify-center items-center h-10 basis-1/2 base2',
                'font-semibold transition-colors hover:text-white focus:ring-0 cursor-pointer',
                isDarkTheme ? 'text-white' : 'text-white/50'
              )}
              onClick={() => {
                setTheme('dark');
              }}
            >
              <HalfMoon
                className={classNames(
                  'inline-block w-6 h-6',
                  'transition-colors group-hover:fill-white',
                  isDarkTheme ? 'fill-white' : 'fill-white/50',
                  open ? 'mr-3' : 'mr-0'
                )}
              />
              {open && 'Dark'}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
});
