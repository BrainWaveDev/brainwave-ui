import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import ErrorProvider from '../context/ErrorContext';
import Layout from '@/components/ui/Layout/Layout';
import { MyUserContextProvider } from '@/utils/useUser';
import type { Database } from 'types/supabase';

import 'styles/main.css';
import 'styles/chrome-bug.css';
import { Provider } from 'react-redux';
import { store } from 'context/redux/store';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <div className="bg-black h-full">
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <ErrorProvider>
            <Layout>
              <Provider store={store}>
                <Component {...pageProps} />
              </Provider>
            </Layout>
          </ErrorProvider>
        </MyUserContextProvider>
      </SessionContextProvider>
    </div>
  );
}
