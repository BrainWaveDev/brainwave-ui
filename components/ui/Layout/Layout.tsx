import React, { PropsWithChildren } from 'react';
import Head from 'next/head';
import classes from './Layout.module.css';
import ErrorList from '@/components/ui/ErrorList/ErrorList';
import { PageMeta } from '@/types/index';
import classNames from 'classnames';
import Sidebar from '../Sidebar';
import Header from '@/components/ui/Header';
import useThemeDetector from '../../../hooks/useThemeDetector';
import { RotatingLines } from 'react-loader-spinner';
import useRouteChange from '../../../hooks/useRouteChange';

interface Props extends PropsWithChildren {
  meta?: PageMeta;
}

export default function Layout({ children, meta: pageMeta }: Props) {
  // ==============================
  // Meta Information
  // ==============================
  const meta = {
    title: 'BrainWave: Intelligent AI Assistance',
    description:
      'Quickly get information from your documents by asking questions in natural language.',
    cardImage: '/og.png',
    ...pageMeta
  };

  // ==============================
  // Theme State
  // ==============================
  useThemeDetector();

  // ======= Page Transition Animation =======
  const [pageLoading] = useRouteChange();

  // ==============================
  // Tailwind Classes
  // ==============================
  const mainContentClasses = classNames(
    'min-h-[calc(100%_-_4.5rem)]',
    'h-[calc(100%_-_4.5rem)]',
    'max-h-[calc(100%_-_4.5rem)]',
    'overflow-y-scroll overflow-x-clip',
    'scrollbar-hide'
  );

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/public/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
      </Head>
      <Sidebar />
      <main id="skip" className={classNames(classes.main, 'scrollbar-hide')}>
        {pageLoading ? (
          <div className={'w-full h-full flex items-center justify-center'}>
            <RotatingLines
              strokeColor="#9ca3af"
              strokeWidth="2"
              animationDuration="1"
              width="3.25rem"
              visible={true}
            />
          </div>
        ) : (
          <>
            <Header />
            <div className={mainContentClasses}>{children}</div>
          </>
        )}
      </main>
      <ErrorList />
    </>
  );
}
