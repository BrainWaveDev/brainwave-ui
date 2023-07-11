'use client';
import AppLogo from '@/components/icons/AppLogo';
import Link from 'next/link';
import classNames from 'classnames';
import { scrollToElement } from '../_lib/page';
import React, { memo } from 'react';

const HeroSection = () => {
  return (
    <div className="mx-auto max-w-2xl py-32 md:py-48 lg:py-56">
      <div className="text-center">
        <div className={'flex items-center justify-center w-full mb-6'}>
          <AppLogo className={'h-[50px] w-[50px] sm:h-[65px] sm:w-[65px]'} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral1 sm:text-5xl">
          Gain instant insights into your documents with a personalized AI
          chatbot
        </h1>
        <p className="mt-6 text-base sm:text-lg sm:leading-8 text-gray-400">
          Experience the next generation of document intelligence. Empower
          yourself with{' '}
          <span className={'font-bold text-main-gradient'}>BrainBot</span>, an
          AI chatbot that not only understands your documents but also provides
          valuable recommendations and answers to your queries.
        </p>
        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/chat"
            className={classNames(
              'rounded-md bg-green-500 px-3.5 py-2.5',
              'text-sm sm:text-base',
              'font-semibold text-white shadow-sm',
              'hover:bg-emerald-400 active:bg-emerald-400',
              'focus-visible:outline focus-visible:outline-2',
              'focus-visible:outline-offset-2',
              'focus-visible:outline-emerald-500',
              'transition-all duration-300'
            )}
          >
            Get started
          </Link>
          <button
            className={classNames(
              'text-base font-semibold leading-6',
              'text-sm sm:text-base',
              'text-gray-400 hover:text-neutral1 active:text-neutral1',
              'transition-all duration-300'
            )}
            onClick={() => scrollToElement('features')}
          >
            Learn more <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(HeroSection);
