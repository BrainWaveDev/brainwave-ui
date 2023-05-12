import classNames from 'classnames';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '../../icons/Logo';
import { useUser } from 'utils/useUser';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { cleanLocalStorage } from '@/utils/app/clean';

const navigation = [
  { name: 'Files', href: '/', current: true },
  { name: 'Chat', href: '/chat', current: false }
];
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' }
];

export default function Navbar() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const signOut = async () => {
    cleanLocalStorage();
    await supabaseClient.auth.signOut();
    await router.push('/signin');
  };

  return (
    <Disclosure as="nav" className="bg-gray-800 h-16 grow-0 shrink basis-16">
      {({
        // @ts-ignore
        open
      }) => (
        <>
          <div className="m-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Logo className={'w-12 h-12'} />
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {user && (
                      <>
                        <Link
                          href={'/'}
                          className={classNames(
                            router.pathname === '/'
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          aria-current={
                            router.pathname === '/' ? 'page' : undefined
                          }
                        >
                          Files
                        </Link>
                        <Link
                          href={'/chat'}
                          className={classNames(
                            router.pathname === '/chat'
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          aria-current={
                            router.pathname === '/chat' ? 'page' : undefined
                          }
                        >
                          Chat
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex max-w-xs items-center rounded bg-gray-800 text-sm px-1 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-800">
                        {!user && (
                          <Link
                            href="/signin"
                            className={
                              'flex max-w-xs items-center rounded bg-gray-800 text-sm px-1 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-800'
                            }
                          >
                            Sign in
                          </Link>
                        )}
                        {user && <span>{user.email}</span>}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }: { active: boolean }) => (
                            <button
                              className={classNames(
                                active && 'bg-gray-100',
                                'block px-4 py-2 text-sm text-gray-700 w-full rounded-md text-left'
                              )}
                              onClick={signOut}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>

              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md 
                bg-gray-800 p-2 text-gray-400 hover:bg-gray-700
                 hover:text-white focus:outline-none focus:ring-2
                  focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          {/* Mobile NavBar */}
          <Disclosure.Panel className="md:hidden absolute bg-slate-800 z-30 min-w-full">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3 z-30 w-[30vw] float-right">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              {user && (
                <div className="flex items-center px-5">
                  <div className="">
                    <div className="text-sm font-medium leading-none text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
