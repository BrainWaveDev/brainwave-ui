import React, { PropsWithChildren } from 'react';
import Head from 'next/head';
import classes from './Layout.module.css';
import ErrorList from '@/components/ui/ErrorList/ErrorList';
import { PageMeta } from '@/types/index';
import classNames from 'classnames';
import Sidebar from '../Sidebar';
import Header from '@/components/ui/Header';
import useThemeDetector from '../../../hooks/useThemeDetector';

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

  // ==============================
  // Tailwind Classes
  // ==============================
  const mainContentClasses = classNames(
    'min-h-[calc(100%_-_4.5rem)]',
    'h-[calc(100%_-_4.5rem)]',
    'max-h-[calc(100%_-_4.5rem)]',
    'overflow-y-scroll'
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
      <main id="skip" className={classNames(classes.main)}>
        <Header />
        <div className={mainContentClasses}>{children}</div>
      </main>
      <ErrorList />
    </>
  );
}
