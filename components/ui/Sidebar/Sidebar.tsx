import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import classes from './Sidebar.module.css';
import SidebarOpen from '@/components/icons/SidebarOpen';
import SidebarClose from '@/components/icons/SidebarClose';
import Logo from '@/components/icons/Logo';
import {
  ChatBubbleLeftIcon,
  FolderIcon,
  FolderPlusIcon,
  PlusCircleIcon,
  Cog8ToothIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import * as Separator from '@radix-ui/react-separator';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Sun from '@/components/icons/Sun';
import HalfMoon from '@/components/icons/HalfMoon';
import Chatbar from '@/components/Chatbar/Chatbar';
import {
  setTheme,
  getThemeFromStorage
} from '../../../context/redux/themeSlice';
import { useAppDispatch } from '../../../context/redux/store';
import {
  getSidebarStateFromStorage,
  initSidebar,
  toggleSettingDialog,
  toggleSidebar
} from '../../../context/redux/sidebarSlice';
import { optimisticConversationsActions } from 'context/redux/conversationsSlice';
import { optimisticFoldersAction } from 'context/redux/folderSlice';
import { useSessionContext } from '@supabase/auth-helpers-react';
import SettingsDialog from '@/components/Settings/SettingsDialog';

const NavLinks = [
  {
    name: 'Chat',
    href: '/chat',
    icon: ChatBubbleLeftIcon
  },
  {
    name: 'Files',
    href: '/files',
    icon: FolderIcon
  },
  {
    name: 'Settings',
    icon: Cog8ToothIcon,
    onClick: (dispatch:ReturnType<typeof useAppDispatch>) => {
      dispatch(toggleSettingDialog());
    }
  }
];

type LinkType = ({
  name: string;
  icon: any;
  href: string;
} | {
  name: string;
  icon: any;
  onClick: (dispatch:ReturnType<typeof useAppDispatch>) => void;
})


export default function Sidebar() {
  // ===================================================
  // Redux State
  // ===================================================
  const dispatch = useAppDispatch();
  // Init sidebar state
  useEffect(() => {
    dispatch(initSidebar());
  }, []);
  const sidebarOpen = getSidebarStateFromStorage();
  const onToggleSidebar = () => dispatch(toggleSidebar());
  const theme = getThemeFromStorage();
  const isDarkTheme = theme === 'dark';

  // ===================================================
  // Link Highlighting
  // ===================================================
  const router = useRouter();

  // ========= Handlers =========
  const handleCreateFolder = async () => {
    if (!sidebarOpen) onToggleSidebar();
    await dispatch(optimisticFoldersAction.createNewFolder(session!.user.id));
    if (!isChatlistOpen()) {
      chatListButtonRef.current?.click();
    }
  };
  const handleCreateConversation = async () => {
    if (!sidebarOpen) onToggleSidebar();
    // Switch to chat page
    if (router.pathname !== '/chat') router.push('/chat');
    // Create a new conversation
    dispatch(optimisticConversationsActions.createConversation());
    // Open the chat list
    if (!isChatlistOpen()) {
      chatListButtonRef.current?.click();
    }
  };

  // ===================================================
  // sessions
  // ===================================================
  const { session } = useSessionContext();
  // ===================================================
  // Refs
  // ===================================================
  const chatListButtonRef = useRef<HTMLButtonElement>(null);
  const isChatlistOpen = () => {
    return (
      chatListButtonRef.current?.getAttribute('data-headlessui-state') ===
      'open'
    );
  };


  const sidebarDisplay = sidebarOpen
  ? 'z-15 sm:z-10 sm:w-[20rem] sm:min-w-[20rem]'
  : '-z-15 sm:z-10 sm:w-24 sm:min-w-24';

  const linkHighlightStyle = classNames(
    'bg-gradient-to-l from-[#323337] to-[rgba(70,79,111,0.3)]',
    'shadow-[inset_0px_0.0625rem_0_rgba(255,255,255,0.05),0_0.25rem_0.5rem_0_rgba(0,0,0,0.1)]'
  );
  const sideBarToggleSVGStyle = classNames(
    'inline-block w-6 h-7 transition-colors duration-75 fill-zinc-500',
    'group-hover:fill-white'
  );
  const separatorStyle = classNames(
    'bg-neutral6 data-[orientation=horizontal]:h-px',
    'data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full',
    'data-[orientation=vertical]:w-px'
  );

  return (
    // TODO: Add animation for sidebar sidebarOpen and close
    <div>
    <SettingsDialog />
    <aside className={classNames(classes.sidebar, sidebarDisplay)}>
      <div
        className={classNames(
          'flex flex-row w-full items-center h-12 mb-6 place-content-between'
        )}
      >
        {sidebarOpen && (
          <div className={classNames('flex flex-row items-center gap-x-3')}>
            <Logo className={'h-16 w-16'} />
            <h3 className={'text-2xl font-bold'}>BrainWave</h3>
          </div>
        )}
        <button
          className="hidden sm:block group focus:ring-0 h-fit mt-0.5 ml-3 cursor-pointer"
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? (
            <SidebarClose className={sideBarToggleSVGStyle} />
          ) : (
            <SidebarOpen className={sideBarToggleSVGStyle} />
          )}
        </button>
      </div>
      <div
        className={classNames(
          'flex flex-col grow justify-between flex-1 mt-3 w-full'
        )}
      >
        <nav
          className={
            'flex flex-col grow items-start max-h-[calc(100vh_-_14rem)] overflow-y-scroll scrollbar-hide'
          }
        >
          {/* ============== Navigation links ============== */}
          <div
            className={
              'w-full flex flex-col items-center justify-center gap-y-1 mb-3'
            }
          >
            {NavLinks.map((link) => (
              <LinkComponent key={link.name} link={link} sidebarOpen={sidebarOpen} />
            ))}
          </div>
          <Separator.Root className={separatorStyle} />
          {/* ============== Chat list ============== */}
          <Disclosure as={'div'} className={'w-full mt-3 mb-2'}>
            {({ open: chatListOpen }) => (
              <>
                <Disclosure.Button
                  className={classNames(
                    'group flex items-center w-full h-7 pl-2.5 pr-2 py-6',
                    'gap-x-4 text-left text-md text-white/50 focus:ring-0'
                  )}
                  ref={chatListButtonRef}
                >
                  <ChevronDownIcon
                    className={classNames(
                      'h-7 w-7 text-white/50 group-hover:fill-white active:fill-white transition-transform duration-150 transform-gpu',
                      chatListOpen && 'rotate-180 transform'
                    )}
                  />
                  {sidebarOpen && (
                    <span
                      className={
                        'font-semibold text-sm text-white/50 group-hover:text-white transition-all grow'
                      }
                    >
                      Chat list
                    </span>
                  )}
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel>
                    <Chatbar />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
          {/* ============== New chat and folder buttons ============== */}
          <div
            className={classNames(
              'flex items-center justify-center w-full rounded-lg border',
              'bg-neutral6 border-neutral-600 py-2.5',
              sidebarOpen ? 'flex-row' : 'flex-col gap-y-1'
            )}
          >
            <button
              className={classNames(
                'group flex text-sm grow flex-shrink-0 font-semibold cursor-pointer select-none items-center',
                'gap-x-4 px-3 leading-normal text-white/50 hover:text-white transition-all duration-100'
              )}
              onClick={handleCreateConversation}
              id={'new-chat-button'}
            >
              <PlusCircleIcon
                className={
                  'w-[22px] h-[22px] fill-white/50 group-hover:fill-white transition-all duration-200'
                }
              />
              {sidebarOpen && 'New chat'}
            </button>
            <Separator.Root
              className={classNames(
                'bg-neutral-600',
                'data-[orientation=vertical]:h-[80%] data-[orientation=vertical]:w-[2px]',
                'data-[orientation=horizontal]:w-[60%] data-[orientation=horizontal]:h-[1px]',
                'data-[orientation=horizontal]:my-1.5'
              )}
              decorative
              orientation={sidebarOpen ? 'vertical' : 'horizontal'}
            />
            <button
              className="group mx-3 flex flex-shrink-0 cursor-pointer items-center transition-all duration-200"
              onClick={handleCreateFolder}
            >
              <FolderPlusIcon
                className={
                  'w-[22px] h-[22px] fill-white/50 group-hover:fill-white transition-all duration-100'
                }
              />
            </button>
          </div>
        </nav>
        {/* ============== Theme Switcher Buttons ============== */}
        <div
          className={classNames(
            'relative flex w-full p-1 bg-neutral-800 rounded-xl before:absolute before:left-1 before:top-1 ml-0 mb-1.5',
            'before:bottom-1 before:w-[calc(50%-0.25rem)] before:bg-zinc-900 before:rounded-[0.625rem] before:transition-all',

            isDarkTheme && 'before:translate-x-full',
            !sidebarOpen && 'before:hidden place-content-center'
          )}
        >
          {(sidebarOpen || isDarkTheme) && (
            <button
              className={classNames(
                'relative z-1 text-sm group flex justify-center items-center h-10',
                'font-semibold transition-colors hover:text-white focus:ring-0 cursor-pointer',
                isDarkTheme ? 'text-white/50' : 'text-white',
                sidebarOpen ? 'basis-1/2' : 'basis-1'
              )}
              onClick={() => dispatch(setTheme('light'))}
            >
              <Sun
                className={classNames(
                  'inline-block w-6 h-6',
                  'transition-colors group-hover:fill-white',
                  !isDarkTheme ? 'fill-white' : 'fill-white/50',
                  sidebarOpen ? 'mr-3' : 'mr-0'
                )}
              />
              {sidebarOpen && 'Light'}
            </button>
          )}
          {(sidebarOpen || !isDarkTheme) && (
            <button
              className={classNames(
                'relative z-1 text-sm group flex justify-center items-center h-10 basis-1/2 base2',
                'font-semibold transition-colors hover:text-white focus:ring-0 cursor-pointer',
                isDarkTheme ? 'text-white' : 'text-white/50'
              )}
              onClick={() => dispatch(setTheme('dark'))}
            >
              <HalfMoon
                className={classNames(
                  'inline-block w-6 h-6',
                  'transition-colors group-hover:fill-white',
                  isDarkTheme ? 'fill-white' : 'fill-white/50',
                  sidebarOpen ? 'mr-3' : 'mr-0'
                )}
              />
              {sidebarOpen && 'Dark'}
            </button>
          )}
        </div>
      </div>
    </aside>
    </div>
  )
    }


// ============================================================
// Tailwind Classes
// ============================================================


const linkHighlightStyle = classNames(
  'bg-gradient-to-l from-[#323337] to-[rgba(70,79,111,0.3)]',
  'shadow-[inset_0px_0.0625rem_0_rgba(255,255,255,0.05),0_0.25rem_0.5rem_0_rgba(0,0,0,0.1)]'
);

const sideBarToggleSVGStyle = classNames(
  'inline-block w-6 h-7 transition-colors duration-75 fill-zinc-500',
  'group-hover:fill-white'
);



function LinkComponent(
  {
    link,
    sidebarOpen
  }
    : {
      link: LinkType,
      sidebarOpen: boolean
    }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const hasHerf = ('href' in link) && link.href !== undefined;
  if (hasHerf) {
    return (
      <Link
        href={link.href}
        className={classNames(
          'flex items-center place-content-start py-6 h-5 rounded-lg relative',
          'focus:ring-0 group cursor-pointer w-full place-content-start',
          router.pathname === link.href && linkHighlightStyle
        )}
        key={'sidebar-link-' + link.name}
      >
        <link.icon
          className={'w-5 h-5 fill-white/80 group-hover:fill-white mx-3.5'} />
        {sidebarOpen && (
          <span
            className={'ml-2 font-semibold text-sm text-white/80 group-hover:text-white transition-all'}
          >
            {link.name}
          </span>
        )}
      </Link>
    );
  }

  const hasOnClick = ('onClick' in link) && typeof link.onClick === 'function';
  if (hasOnClick) {
    return (
      <button
        className={classNames(
          'flex items-center place-content-start py-6 h-5 rounded-lg relative',
          'focus:ring-0 group cursor-pointer w-full place-content-start',
        )}
        key={'sidebar-link-' + link.name}
        onClick={() => link.onClick(dispatch)}
      >
        <link.icon
          className={'w-5 h-5 fill-white/80 group-hover:fill-white mx-3.5'} />
        {sidebarOpen && (
          <span
            className={'ml-2 font-semibold text-sm text-white/80 group-hover:text-white transition-all'}
          >
            {link.name}
          </span>
        )}
      </button>
    )
  }

  return null;
}
