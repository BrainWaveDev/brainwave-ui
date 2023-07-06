import React, { useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import classes from './Sidebar.module.css';
import SideBarOpenIcon from '@/components/icons/SidebarOpen';
import SideBarCloseIcon from '@/components/icons/SidebarClose';
import Logo from '@/components/icons/Logo';
import {
  ChatBubbleLeftIcon,
  FolderIcon,
  FolderPlusIcon,
  PlusCircleIcon,
  Cog8ToothIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  getModalStateFromStorage,
  initSidebar,
  setSidebar,
  toggleSidebar,
  openSettingDialog,
  closeSettingDialog
} from '../../../context/redux/modalSlice';
import { optimisticConversationsActions } from 'context/redux/conversationsSlice';
import { optimisticFoldersAction } from 'context/redux/folderSlice';
import { useSessionContext } from '@supabase/auth-helpers-react';
import {
  getLoadingStateFromStore,
  LoadingTrigger
} from '../../../context/redux/loadingSlice';
import useRouteChange from '../../../hooks/useRouteChange';
import { RotatingLines } from 'react-loader-spinner';
import SettingsDialog from '@/components/Settings/SettingsDialog';
import { use100vh } from 'react-div-100vh';

type LinkType =
  | {
      name: string;
      icon: any;
      href: string;
    }
  | {
      name: string;
      icon: any;
      onClick: (dispatch: ReturnType<typeof useAppDispatch>) => void;
    };

export default function Sidebar() {
  // ===================================================
  // Router
  // ===================================================
  const router = useRouter();
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 640) {
      dispatch(setSidebar(false));
    }
  }, [router.pathname]);

  // ===================================================
  // Redux State
  // ===================================================
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Initialize sidebar state to false if on mobile
    if (window) {
      dispatch(window.innerWidth > 640 ? initSidebar() : setSidebar(false));
    }
  }, []);
  const { sideBarOpen, settingDialogOpen } = getModalStateFromStorage();
  const onToggleSidebar = () => dispatch(toggleSidebar());
  const theme = getThemeFromStorage();
  const isDarkTheme = theme === 'dark';
  const deletingConversations = getLoadingStateFromStore(
    LoadingTrigger.DeletingConversations
  );

  const closeSettingsDialog = () => dispatch(closeSettingDialog());

  const NavLinks = useMemo(() => {
    return [
      {
        name: 'Chat',
        href: '/',
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
        onClick: () => dispatch(openSettingDialog())
      }
    ];
  }, [dispatch]);

  // ============== Detect Page Changes ==============
  const [pageLoading] = useRouteChange();

  // ========= Handlers =========
  const handleCreateFolder = async () => {
    if (!sideBarOpen) onToggleSidebar();
    await dispatch(optimisticFoldersAction.createNewFolder(session!.user.id));
    if (!isChatlistOpen()) {
      chatListButtonRef.current?.click();
    }
  };
  const handleCreateConversation = async () => {
    if (!sideBarOpen) onToggleSidebar();
    // Switch to chat page
    if (router.pathname !== '/') router.push('/');
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

  // ======== Dynamically Set Sidebar Height ==========
  const height = use100vh();

  // ============================================================
  // Tailwind Classes
  // ============================================================
  const sidebarDisplay = sideBarOpen
    ? 'z-40 opacity-100 sm:w-[20rem] sm:min-w-[20rem]'
    : '-z-20 opacity-0 sm:opacity-100 sm:z-30 sm:w-24 sm:min-w-24';

  const sideBarToggleSVGStyle = classNames(
    'inline-block w-6 h-7 transition-colors duration-75 fill-zinc-500',
    'group-hover:fill-white'
  );
  const separatorStyle = classNames(
    'bg-neutral6 data-[orientation=horizontal]:h-[1px] data-[orientation=horizontal]:w-full',
    'data-[orientation=horizontal]:min-h-[1px]'
  );

  return (
    // TODO: Add animation for sidebar sideBarOpen and close
    <>
      <SettingsDialog
        settingDialogOpen={settingDialogOpen}
        closeSettingDialog={closeSettingsDialog}
      />
      <aside
        className={classNames(classes.sidebar, sidebarDisplay)}
        style={{
          height: `${height}px`
        }}
      >
        <div
          className={classNames(
            'flex flex-row w-full items-center h-12 mb-6 place-content-between'
          )}
        >
          {sideBarOpen && (
            <div className={classNames('flex flex-row items-center gap-x-3')}>
              <Logo className={'h-16 w-16'} />
              <h3 className={'text-2xl font-bold text-white'}>BrainWave</h3>
            </div>
          )}
          <button
            className="hidden sm:block group focus:ring-0 h-fit mt-0.5 ml-3 cursor-pointer"
            onClick={onToggleSidebar}
          >
            {sideBarOpen ? (
              <SideBarCloseIcon className={sideBarToggleSVGStyle} />
            ) : (
              <SideBarOpenIcon className={sideBarToggleSVGStyle} />
            )}
          </button>
        </div>
        <div
          className={classNames(
            'flex flex-col grow justify-between flex-1 mt-3 w-full '
          )}
        >
          <nav
            className={`flex flex-col grow items-start scrollbar-hide overflow-y-scroll`}
            style={{
              maxHeight: `calc(${height}px - 14.5rem)`
            }}
          >
            {/* ============== Navigation links ============== */}
            <div
              className={
                'w-full flex flex-col items-center justify-center gap-y-1 mb-2'
              }
            >
              {NavLinks.map((link) => (
                <LinkComponent
                  key={link.name}
                  link={link}
                  sideBarOpen={sideBarOpen}
                />
              ))}
            </div>
            <Separator.Root
              className={classNames(separatorStyle)}
              orientation={'horizontal'}
            />
            {/* ============== Chat list ============== */}
            <Disclosure
              as={'div'}
              className={'w-full mt-2 mb-2 relative'}
              defaultOpen={true}
            >
              {({ open: chatListOpen }) => (
                <>
                  <Disclosure.Button
                    className={classNames(
                      'group flex items-center w-full h-7 pl-2.5 pr-2 py-6',
                      'gap-x-4 text-left text-md text-white/50 focus:ring-0',
                      'focus:outline-none'
                    )}
                    ref={chatListButtonRef}
                  >
                    <ChevronDownIcon
                      className={classNames(
                        'h-7 w-7 text-white/50 group-hover:fill-white active:fill-white transition-transform duration-150 transform-gpu',
                        chatListOpen && 'rotate-180 transform'
                      )}
                    />
                    {sideBarOpen && (
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
                    <Disclosure.Panel className={'relative'}>
                      <Chatbar />
                      {/* ========== Loading Spinner ========== */}
                      {(pageLoading || deletingConversations) && (
                        <div
                          className={classNames(
                            'absolute top-0 left-0 right-0 bottom-0 z-40',
                            'flex items-center justify-center bg-zinc-900'
                          )}
                        >
                          <RotatingLines
                            strokeColor="#9ca3af"
                            strokeWidth="2"
                            animationDuration="1"
                            width="2rem"
                            visible={true}
                          />
                        </div>
                      )}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
            {/* ============== New chat and folder buttons ============== */}
            {!(pageLoading || deletingConversations) && (
              <div
                className={classNames(
                  'flex items-center justify-center w-full rounded-lg border',
                  'bg-neutral6 border-neutral-600 py-2.5',
                  sideBarOpen ? 'flex-row' : 'flex-col gap-y-1'
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
                  {sideBarOpen && 'New chat'}
                </button>
                <Separator.Root
                  className={classNames(
                    'bg-neutral-600',
                    'data-[orientation=vertical]:h-[80%] data-[orientation=vertical]:w-[2px]',
                    'data-[orientation=horizontal]:w-[60%] data-[orientation=horizontal]:h-[1px]',
                    'data-[orientation=horizontal]:my-1.5'
                  )}
                  decorative
                  orientation={sideBarOpen ? 'vertical' : 'horizontal'}
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
            )}
          </nav>
          {/* ============== Theme Switcher Buttons ============== */}
          <div
            className={classNames(
              'relative flex w-full p-1 bg-neutral-800 rounded-xl before:absolute before:left-1 before:top-1 ml-0 mb-1.5',
              'before:bottom-1 before:w-[calc(50%_-_0.25rem)] before:bg-zinc-900 before:rounded-[0.625rem] before:transition-all',

              isDarkTheme && 'before:translate-x-full',
              !sideBarOpen && 'before:hidden place-content-center'
            )}
          >
            {(sideBarOpen || isDarkTheme) && (
              <button
                className={classNames(
                  'relative z-1 text-sm group flex justify-center items-center h-10',
                  'font-semibold transition-colors hover:text-white focus:ring-0 cursor-pointer',
                  isDarkTheme ? 'text-white/50' : 'text-white',
                  sideBarOpen ? 'basis-1/2' : 'basis-1'
                )}
                onClick={() => dispatch(setTheme('light'))}
              >
                <Sun
                  className={classNames(
                    'inline-block w-6 h-6',
                    'transition-colors group-hover:fill-white',
                    !isDarkTheme ? 'fill-white' : 'fill-white/50',
                    sideBarOpen ? 'mr-3' : 'mr-0'
                  )}
                />
                {sideBarOpen && 'Light'}
              </button>
            )}
            {(sideBarOpen || !isDarkTheme) && (
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
                    sideBarOpen ? 'mr-3' : 'mr-0'
                  )}
                />
                {sideBarOpen && 'Dark'}
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

// ============================================================
// Tailwind Classes
// ============================================================

const linkHighlightStyle = classNames(
  'bg-gradient-to-l from-[#323337] to-[rgba(70,79,111,0.3)]',
  'shadow-[inset_0px_0.0625rem_0_rgba(255,255,255,0.05),0_0.25rem_0.5rem_0_rgba(0,0,0,0.1)]'
);

function LinkComponent({
  link,
  sideBarOpen
}: {
  link: LinkType;
  sideBarOpen: boolean;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const hasHerf = 'href' in link && link.href !== undefined;
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
          className={'w-5 h-5 fill-white/80 group-hover:fill-white mx-3.5'}
        />
        {sideBarOpen && (
          <span
            className={
              'ml-2 font-semibold text-sm text-white/80 group-hover:text-white transition-all'
            }
          >
            {link.name}
          </span>
        )}
      </Link>
    );
  }

  const hasOnClick = 'onClick' in link && typeof link.onClick === 'function';
  if (hasOnClick) {
    return (
      <button
        className={classNames(
          'flex items-center place-content-start py-6 h-5 rounded-lg relative',
          'focus:ring-0 group cursor-pointer w-full place-content-start'
        )}
        key={'sidebar-link-' + link.name}
        onClick={() => link.onClick(dispatch)}
      >
        <link.icon
          className={'w-5 h-5 fill-white/80 group-hover:fill-white mx-3.5'}
        />
        {sideBarOpen && (
          <span
            className={
              'ml-2 font-semibold text-sm text-white/80 group-hover:text-white transition-all'
            }
          >
            {link.name}
          </span>
        )}
      </button>
    );
  }

  return null;
}
