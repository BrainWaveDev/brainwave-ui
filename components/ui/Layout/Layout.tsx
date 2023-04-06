import { PropsWithChildren } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../Navbar';
import classes from './Layout.module.css';

import { PageMeta } from '../../../types';
import classNames from 'classnames';

interface Props extends PropsWithChildren {
  meta?: PageMeta;
}

export default function Layout({ children, meta: pageMeta }: Props) {
  const router = useRouter();
  const meta = {
    title: 'BrainWave: Intelligent AI Assistance',
    description:
      'Quickly get information from your documents by asking questions in natural language.',
    cardImage: '/og.png',
    ...pageMeta
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/public/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
      </Head>
      <Navbar />
      <main
        id="skip"
        className={classNames('min-h-[93vh] bg-gray-100', classes.main)}
      >
        {children}
      </main>
      {/*<Footer />*/}
    </>
  );
}
