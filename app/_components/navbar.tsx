'use client';
import Logo from '@/components/icons/Logo';
import Link from 'next/link';
import classNames from 'classnames';
import React from 'react';
import { getSession } from '../_lib/auth';

/* TODO: Add navigation items
const navigation = [
  { name: 'Pricing', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' }
];
 */
const navigation: {
  name: string;
  href: string;
}[] = [];

export default function NavBar() {
  const { session, loading } = getSession();

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Logo className={'h-12 w-12 -my-1.5'} />
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-300"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-1 justify-end">
          {loading ? null : (
            <Link
              className={classNames(
                'text-sm sm:text-base font-semibold leading-6',
                'text-neutral4 hover:text-neutral1 active:text-neutral1',
                'transition-all duration-300'
              )}
              href={session ? '/chat' : '/signin'}
            >
              {session ? 'Go to app' : 'Log in'}{' '}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
