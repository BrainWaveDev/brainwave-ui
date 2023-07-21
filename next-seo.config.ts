import { DefaultSeoProps } from 'next-seo';
import { getURL } from '@/utils/helpers';

const url = getURL();
export const title = 'BrainBot: Intelligent AI Assistant';
export const description =
  'Gain instant insights into your documents with a personalized AI chatbot. BrainBot is a powerful tool that can help you with your writing, research, and more!';

const config: DefaultSeoProps = {
  canonical: url,
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url,
    siteName: title,
    description,
    images: [
      {
        url: `${url}/brainbot_logo.svg`,
        width: 175,
        height: 175,
        alt: 'BrainBot Logo'
      },
      {
        url: `${url}/brainwave_logo_transparent_bg.png`,
        width: 524,
        height: 524,
        alt: 'BrainWave Logo'
      }
    ]
  },
  additionalLinkTags: [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png'
    },
    {
      rel: 'icon',
      href: '/favicon.ico'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png'
    }
  ]
};

export default config;
