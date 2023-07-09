import Link from 'next/link';
import classNames from 'classnames';
import Logo from '@/components/icons/Logo';
import React from 'react';

export default function Footer() {
  return (
    <footer className="mx-auto mt-0 w-full max-w-container px-4 sm:px-6 lg:px-8">
      <div className="border-t border-neutral1/10 py-10">
        <div className="mx-auto w-auto flex flex-row items-center justify-center gap-x-2">
          <Logo className={'h-8 w-8 -ml-5 -my-1.5'} />
          <p
            className={classNames(
              'bg-clip-text text-transparent font-semibold',
              'bg-gradient-to-br from-slate-200 to-gray-400'
            )}
          >
            BrainWave
          </p>
        </div>
        <p className="mt-2 text-center text-sm leading-6 text-gray-500">
          © 2023 BrainWave. All rights reserved.
        </p>
        <div className="mt-16 flex items-center justify-center space-x-4 text-sm font-semibold leading-6 text-neutral4">
          <Link
            href="/terms-of-use"
            className={classNames(
              'hover:text-neutral1 active:text-neutral1',
              'transition-all duration-300'
            )}
          >
            Terms of Use
          </Link>
          <div className="h-4 w-px bg-neutral1/10"></div>
          <Link
            href="#"
            className={classNames(
              'hover:text-neutral1 active:text-neutral1',
              'transition-all duration-300'
            )}
          >
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
