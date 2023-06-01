import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import ErrorProvider from '../context/ErrorContext';
import Layout from '@/components/ui/Layout/Layout';
import { MyUserContextProvider } from '@/utils/useUser';
import type { Database } from 'types/supabase';
import { wrapper } from 'context/redux/store';
import 'styles/main.css';
import 'styles/chrome-bug.css';
import NextTopLoader from 'nextjs-toploader';

export default function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <div className="h-full w-full flex flex-row">
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <Provider store={store}>
            <ErrorProvider>
              <NextTopLoader
                showSpinner={false}
                color={'#5eead4'}
                shadow={'0 0 10px #5eead4,0 0 5px #5eead4'}
              />
              <Layout>
                <Component {...props.pageProps} />
              </Layout>
            </ErrorProvider>
          </Provider>
        </MyUserContextProvider>
      </SessionContextProvider>
    </div>
  );
}
