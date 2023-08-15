import React, { memo } from 'react';
import type { Metadata } from 'next';
import NavBar from './_components/navbar';
import Footer from './_components/footer';
import { title as defaultTitle, description } from '../next-seo.config';
import { getURL } from '@/utils/helpers';

// These styles apply to every route in the application
import '../styles/main.css';
import PreLoader from './_lib/preloader';
import { IsClientCtxProvider } from './_lib/isClientCtxProvider';

const url = getURL();

export const metadata: Metadata = {
  title: {
    template: `%s`,
    default: defaultTitle
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#141718' }
  ],
  description,
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    siteName: defaultTitle,
    description,
    images: [
      {
        url: `${url}brainbot_logo.svg`,
        width: 175,
        height: 175,
        alt: 'BrainBot Logo'
      },
      {
        url: `${url}brainwave_logo_transparent_bg.png`,
        width: 524,
        height: 524,
        alt: 'BrainWave Logo'
      }
    ]
  },
  alternates: {
    canonical: url
  },
  metadataBase: new URL(url),
  icons: {
    icon: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: {
      rel: 'mask-icon',
      url: '/safari-pinned-tab.svg'
    }
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#22c55e'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className='scrollbar-hide'>
      <body className={'bg-neutral7'}>
          <IsClientCtxProvider>
            <PreLoader />
          </IsClientCtxProvider>
          <div className="relative isolate overflow-hidden aiu min-h-screen bg-neutral7 scrollbar-hide">
            <BackgroundPattern />
            <NavBar />
            <main className={'w-full h-full flex items-center justify-center'}>
              {children}
            </main>
            <Footer />
          </div>
      </body>
    </html>
  );
}

const BackgroundPattern = memo(() => (
  <svg
    className="absolute inset-0 -z-10 h-full w-full bew"
    aria-hidden="true"
    style={{
      stroke: 'rgb(255 255 255 / 0.1)'
    }}
  >
    <defs>
      <pattern
        id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
        width="200"
        height="200"
        x="50%"
        y="-1"
        patternUnits="userSpaceOnUse"
      >
        <path d="M.5 200V.5H200" fill="none"></path>
      </pattern>
    </defs>
    <svg
      x="50%"
      y="-1"
      className="overflow-visible aol"
      style={{
        fill: 'rgb(31 41 55 / 0.2)'
      }}
    >
      <path
        d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
        strokeWidth="0"
      ></path>
    </svg>
    <rect
      width="100%"
      height="100%"
      strokeWidth="0"
      fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
    ></rect>
  </svg>
));
