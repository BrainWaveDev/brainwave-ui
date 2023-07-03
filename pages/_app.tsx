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

export const staticPages = ['/signin'];

export default function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );

  const router = useRouter();

  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <div className="h-full w-full flex flex-row">
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <Provider store={store}>
            {staticPages.includes(router.pathname) ? (
              <>
                <Component {...props.pageProps} />
              </>
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
