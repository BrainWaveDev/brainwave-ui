import { useEffect, useState } from 'react';
import React from 'react';
import { AppProps } from 'next/app';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import ErrorProvider from '../context/ErrorContext';
import Layout from '@/components/ui/Layout/Layout';
import { MyUserContextProvider } from '@/utils/useUser';
import type { Database } from 'types_db';

import 'styles/main.css';
import 'styles/chrome-bug.css';

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
              <Component {...pageProps} />
            </Layout>
          </ErrorProvider>
        </MyUserContextProvider>
      </SessionContextProvider>
    </div>
  );
}
