import React, { PropsWithChildren, useCallback, useState } from 'react';
import Head from 'next/head';
import classes from './Layout.module.css';
import ErrorList from '@/components/ui/ErrorList/ErrorList';
import { PageMeta } from '../../../types';
import classNames from 'classnames';
import Sidebar from '../Sidebar';
import Header from '@/components/ui/Header';

interface Props extends PropsWithChildren {
  meta?: PageMeta;
}

export default function Layout({ children, meta: pageMeta }: Props) {
  const meta = {
    title: 'BrainWave: Intelligent AI Assistance',
    description:
      'Quickly get information from your documents by asking questions in natural language.',
    cardImage: '/og.png',
    ...pageMeta
  };

  // Manage Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Use cached version of the function to avoid re-rendering
  const toggleSideBar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/public/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
      </Head>
      <Sidebar open={sidebarOpen} setOpen={toggleSideBar} />
      <main id="skip" className={classNames(classes.main)}>
        <Header sidebarOpen={sidebarOpen} toggleSideBar={toggleSideBar} />
        {children}
      </main>
      <ErrorList />
    </>
  );
}
