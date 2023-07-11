import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import useSWR from 'swr';

/**
 * Browser client that doesn't need service key.
 * */
export const supabase = createBrowserSupabaseClient<Database>();

const fetchSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  else return data;
};

const getSession = () => {
  const { data, error, isLoading: loading } = useSWR('/api/user', fetchSession);
  const session = !loading && data ? data.session : null;
  const loggedOut = error && !loading && !session;

  return {
    loading,
    session,
    loggedOut
  };
};

export { getSession };
