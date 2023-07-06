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

export const staticPages = ['/signin'];

export default function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );

  // ======= Router =======
  const router = useRouter();

  // ====== Determine if the page is static ======
  const isStaticPage = staticPages.includes(router.pathname);

  // ==== Adjust the page height ====
  const height = use100vh();

  // ====== Apply styling to the sign in page ======
  useEffect(() => {
    document.body.classList?.remove('loading');

    if (router.pathname === '/signin') {
      document.body.classList?.remove('page');
      document.body.classList?.add('signInPage');
    } else {
      document.body.classList?.remove('signInPage');
      document.body.classList?.add('page');
    }
  }, [router.pathname]);

  return (
    <div
      className={'w-full flex flex-row'}
      style={{
        height: `${height}px`
      }}
    >
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <Provider store={store}>
            {isStaticPage ? (
              <Component {...props.pageProps} />
            ) : (
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
            )}
          </Provider>
        </MyUserContextProvider>
      </SessionContextProvider>
    </div>
  );
}
