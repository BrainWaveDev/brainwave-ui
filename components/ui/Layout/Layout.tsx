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
import { use100vh } from 'react-div-100vh';
import { getModalStateFromStorage } from '../../../context/redux/modalSlice';
import DocumentFilter from '@/components/Chat/DocumentFilter';
import { useRouter } from 'next/router';

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

  // ======= Redux State =======
  const { documentFilterOpen } = getModalStateFromStorage();

  // ======= Router =======
  const router = useRouter();

  // ==============================
  // Theme State
  // ==============================
  useThemeDetector();

  // ======= Page Transition Animation =======
  const [pageLoading] = useRouteChange();

  // ==============================
  // Tailwind Classes
  // ==============================
  const height = use100vh();

  const mainClasses = classNames(
    'scrollbar-hide',
    'sm:!h-[calc(100vh_-_3rem)]',
    documentFilterOpen && 'pr-0 lg:pr-[20rem] xl:pr-[22.5rem]'
  );

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
      <main
        id="skip"
        className={classNames(classes.main, mainClasses)}
        style={{
          height: `${height}px`
        }}
      >
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
        {router.pathname === '/chat' && documentFilterOpen && (
          <DocumentFilter />
        )}
      </main>
      <ErrorList />
    </>
  );
}
