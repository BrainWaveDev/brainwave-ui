import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import Layout from '@/components/ui/Layout/Layout';
import { MyUserContextProvider } from '@/utils/useUser';
import type { Database } from 'types/supabase';
import { wrapper } from 'context/redux/store';
import 'styles/main.css';
import 'styles/chrome-bug.css';
import TopLoader from '@/components/ui/TopLoader';
import { useRouter } from 'next/router';
import { use100vh } from 'react-div-100vh';
import classNames from 'classnames';
import SEO from '../next-seo.config';
import { DefaultSeo, LogoJsonLd } from 'next-seo';
import { getURL } from '@/utils/helpers';

export const pagesWithLayout = ['/chat', '/files', '/faq'];

export default function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );

  // ======= Router =======
  const router = useRouter();

  // ====== Determine if the page needs layout ======
  const renderLayout = pagesWithLayout.includes(router.pathname);

  // ==== Adjust the page height ====
  const height = use100vh();

  // ==== Base URL ====
  const url = getURL();

  // ====== Apply styling to the sign in page ======
  useEffect(() => {
    document.body.classList?.remove('loading');
    // Render page layout
    if (pagesWithLayout.includes(router.pathname)) {
      document.body.classList?.add('page');
    } else {
      document.body.classList?.remove('page');
    }
    // Render layout for sign in page
    if (router.pathname === '/signin') {
      document.body.classList?.add('signInPage');
    } else {
      document.body.classList?.remove('signInPage');
    }
  }, [router.pathname]);

  return (
    <div
      className={classNames(
        'w-full flex flex-row',
        !renderLayout && 'justify-center items-center'
      )}
      style={{
        height: `${height}px`
      }}
    >
      <DefaultSeo {...SEO} />
      <LogoJsonLd logo={`${url}/brainwave_logo.svg`} url={url} />
      {!pagesWithLayout.includes(router.pathname) &&
        router.pathname !== '/signin' && (
          <style
          // Use inline styles to override the global styles for the error page
          >{`body{background:rgb(24 24 27) !important;}`}</style>
        )}

      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <Provider store={store}>
            {renderLayout ? (
              <>
                <TopLoader
                  showSpinner={false}
                  color={'#5eead4'}
                  shadow={'0 0 10px #5eead4,0 0 5px #5eead4'}
                />
                <Layout>
                  <Component {...props.pageProps} />
                </Layout>
              </>
            ) : (
              <Component {...props.pageProps} />
            )}
          </Provider>
        </MyUserContextProvider>
      </SessionContextProvider>
    </div>
  );
}
