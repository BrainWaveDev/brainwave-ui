import React, { PropsWithChildren, useEffect } from 'react';
import Head from 'next/head';
import classes from './Layout.module.css';
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
import {
  getErrorsFromLocalStorage,
  optimisticErrorActions,
  removeError
} from '../../../context/redux/errorSlice';
import { AnimatePresence } from 'framer-motion';
import { useAppDispatch } from '../../../context/redux/store';
import ErrorAlert from '@/components/ui/ErrorAlert';
import { getCurrentConversationFromStore } from '../../../context/redux/currentConversationSlice';

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
  const { conversation } = getCurrentConversationFromStore();
  const { documentFilterOpen } = getModalStateFromStorage();
  const { errors } = getErrorsFromLocalStorage();
  const dispatch = useAppDispatch();

  // ======= Router =======
  const router = useRouter();

  // ==============================
  // Theme State
  // ==============================
  useThemeDetector();

  // ======= Page Transition Animation =======
  const [pageLoading] = useRouteChange();

  // ==============================
  // Styling
  // ==============================
  const height = use100vh();

  const mainClasses = classNames(
    'scrollbar-hide',
    'sm:!h-[calc(100vh_-_3rem)]',
    router.pathname === '/chat' &&
      documentFilterOpen &&
      'pr-0 lg:pr-[20rem] xl:pr-[22.5rem]'
  );

  const mainContentClasses = classNames(
    'min-h-[calc(100%_-_4.5rem)]',
    'h-[calc(100%_-_4.5rem)] max-h-[calc(100%_-_4.5rem)]',
    'overflow-y-scroll overflow-x-clip',
    'scrollbar-hide'
  );

  const displayDocumentFilter =
    router.pathname === '/chat' &&
    conversation?.promptId !== undefined &&
    documentFilterOpen;

  // ===== Remove any errors that appear on the first page load =====
  useEffect(() => {
    if (errors.length > 0) {
      setTimeout(() => {
        dispatch(optimisticErrorActions.clearErrorsWithTimeout());
      }, 3000);
    }
  }, []);

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
        {!pageLoading && displayDocumentFilter && <DocumentFilter />}
      </main>
      <div
        // Display list of errors
        className={classNames(
          'fixed top-[5.25rem] sm:top-[6rem] flex z-20',
          'flex-col gap-y-3 justify-start ',
          'right-1/2 translate-x-1/2',
          'xs:translate-x-0 xs:right-3 sm:right-8 md:right-12',
          'min-w-[300px] xs:min-w-fit items-center',
          'max-h-[calc(100vh_-_5.5rem)]',
          'sm:max-h-[calc(100vh_-_8rem)]',
          'overflow-y-scroll overflow-x-visible',
          'scrollbar-hide'
        )}
      >
        <AnimatePresence>
          {errors.map((error) => (
            <ErrorAlert
              message={error.message}
              key={error.id}
              onRemove={() => {
                dispatch(removeError(error.id));
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
