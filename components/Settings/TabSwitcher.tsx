import React, { Dispatch, SetStateAction, Fragment } from 'react';
import classNames from 'classnames';
import { CreditCardIcon } from '@heroicons/react/24/solid';
import { Tabs } from './SettingsDialog';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import ProfileIcon from '@/components/icons/ProfileIcon';
import PasswordIcon from '@/components/icons/PasswordIcon';
import * as Separator from '@radix-ui/react-separator';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { signoutUser } from '@/utils/app/userSettings';
import { useRouter } from 'next/router';

const getTabName = (tab: Tabs) => {
  switch (tab) {
    case 'profile':
      return 'Edit profile';
    case 'password':
      return 'Password';
    case 'subscription':
      return 'Subscription';
  }
};
const tabs: Tabs[] = ['profile', 'password', 'subscription'];

export default function SideOptions({
  currentTab,
  setCurrentTab
}: {
  currentTab: Tabs;
  setCurrentTab: Dispatch<SetStateAction<Tabs>>;
}) {
  // ==== Sign out ====
  const router = useRouter();
  const signOut = async () => {
    await signoutUser();
    router.reload();
  };

  // ==== Styling ====
  const ButtonClasses = (tab: Tabs) =>
    classNames(
      'group flex items-center w-full px-3.5 py-1.5',
      'rounded-full border-2 font-semibold transition-colors',
      'bg-neutral1 dark:bg-transparent dark:hover:text-neutral1',
      currentTab === tab
        ? 'text-neutral7 dark:text-neutral1 border-teal-400'
        : 'text-neutral4 border-transparent hover:bg-neutral2 dark:hover:bg-neutral6'
    );
  const IconClasses = (tab: Tabs) =>
    classNames(
      currentTab === tab
        ? 'fill-neutral7 dark:fill-neutral1'
        : 'fill-neutral4 dark:group-hover:fill-neutral1',
      'inline-block w-4 h-4 mr-3 transition-colors'
    );
  const separatorStyle = classNames(
    'bg-neutral3 dark:bg-neutral6 data-[orientation=horizontal]:h-[1px]',
    'data-[orientation=horizontal]:w-[90%]',
    'data-[orientation=horizontal]:min-h-[1px]',
    'mx-auto mt-4 mb-3.5'
  );

  const ListboxButtonIcon = (selected: boolean) =>
    classNames(
      'inline-block w-5 h-5 transition-colors',
      'fill-neutral4 group-hover:fill-neutral7',
      'group-active:fill-neutral7',
      'dark:group-hover:fill-neutral1',
      'dark:group-active:fill-neutral1',
      selected && 'fill-neutral7 dark:fill-neutral1'
    );

  return (
    <>
      <div
        // Tab switcher for smaller screens
        className="mt-6 mb-10 w-full md:hidden"
      >
        <Listbox value={currentTab} onChange={setCurrentTab}>
          {({ open }) => (
            <div className="relative mt-1">
              <Listbox.Button
                className={classNames(
                  'relative w-full cursor-pointer rounded-xl py-3 pl-3.5',
                  'border-neutral2 dark:border-neutral5',
                  'text-neutral7 dark:text-neutral1',
                  'pr-10 text-left border-2 focus:outline-none',
                  'text-base flex flex-row items-center justify-left gap-x-3',
                  open && 'border-teal-400'
                )}
              >
                {currentTab === 'profile' && (
                  <ProfileIcon
                    className={classNames(
                      'inline-block w-5 h-5 transition-colors duration-300',
                      'fill-neutral7 dark:fill-neutral1'
                    )}
                  />
                )}
                {currentTab === 'password' && (
                  <PasswordIcon
                    className={classNames(
                      'inline-block w-5 h-5 transition-colors duration-300',
                      'fill-neutral7 dark:fill-neutral1'
                    )}
                  />
                )}
                {currentTab === 'subscription' && (
                  <CreditCardIcon
                    className={classNames(
                      'inline-block w-5 h-5 transition-colors duration-300',
                      'fill-neutral7 dark:fill-neutral1'
                    )}
                  />
                )}
                <span className="block truncate font-medium">
                  {getTabName(currentTab)}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-neutral7 dark:text-neutral4"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className={classNames(
                    'absolute mt-2 max-h-60 w-full overflow-auto rounded-md z-30',
                    'bg-white dark:bg-neutral6 py-1.5',
                    'focus:outline-none sm:text-sm',
                    'shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0_2rem_2rem_-1.5rem_rgba(0,0,0,0.1),inset_0_0_0_0.0625rem_#E8ECEF]',
                    'dark:shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0_2rem_2rem_-1.5rem_rgba(0,0,0,0.1),inset_0_0_0_0.0625rem_#343839]'
                  )}
                >
                  {tabs.map((tab, tabId) => (
                    <Listbox.Option
                      key={tabId}
                      className={({ active, selected }) =>
                        classNames(
                          'relative cursor-pointer select-none py-2.5 mx-2 pl-2',
                          'flex flex-row items-center justify-left group gap-x-3',
                          'rounded-lg',
                          selected
                            ? 'text-neutral7 bg-neutral2 dark:text-neutral1 dark:bg-neutral7'
                            : 'text-neutral4',
                          'hover:text-neutral7 dark:hover:text-neutral1',
                          'active:text-neutral7 dark:active:text-neutral1',
                          'transition-colors duration-300'
                        )
                      }
                      value={tab}
                    >
                      {({ selected }) => (
                        <>
                          {tab === 'profile' && (
                            <ProfileIcon
                              className={ListboxButtonIcon(selected)}
                            />
                          )}
                          {tab === 'password' && (
                            <PasswordIcon
                              className={ListboxButtonIcon(selected)}
                            />
                          )}
                          {tab === 'subscription' && (
                            <CreditCardIcon
                              className={ListboxButtonIcon(selected)}
                            />
                          )}
                          <span
                            className={'block truncate text-base font-medium'}
                          >
                            {getTabName(tab)}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 right-3 flex items-center pl-3 text-teal-300">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      </div>
      <div
        // Tab switcher for large screens
        className="hidden md:flex col-span-1 flex-col gap-y-1 mr-5 w-[13.25rem]"
      >
        <button
          // Edit profile button
          className={ButtonClasses('profile')}
          onClick={() => setCurrentTab('profile')}
        >
          <ProfileIcon className={IconClasses('profile')} />
          Edit profile
        </button>
        <button
          // Password edit button
          className={ButtonClasses('password')}
          onClick={() => setCurrentTab('password')}
        >
          <PasswordIcon className={IconClasses('password')} />
          Password
        </button>
        <button
          // Subscription viewing button
          className={ButtonClasses('subscription')}
          onClick={() => setCurrentTab('subscription')}
        >
          <CreditCardIcon className="inline-block w-4 h-4 mr-3 transition-colors" />
          Subscription
        </button>
        <Separator.Root
          className={classNames(separatorStyle)}
          orientation={'horizontal'}
        />
        <button
          className={classNames(
            'group flex items-center w-full px-3.5 py-1.5',
            'border-2 border-transparent text-base font-semibold',
            'transition-colors duration-300',
            'text-red-500/70 hover:text-red-500'
          )}
          onClick={signOut}
        >
          <ArrowLeftOnRectangleIcon className={'w-5 h-5 mr-2'} />
          Sign out
        </button>
      </div>
    </>
  );
}
