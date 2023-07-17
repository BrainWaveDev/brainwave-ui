import { createPagesBrowserClient, User } from '@supabase/auth-helpers-nextjs';
import { Document } from '@/types/document';
import type { Database } from 'types/supabase';

// The client used in the browser that doesn't need service key
export const supabase = createPagesBrowserClient<Database>();

export const getDocuments = async (): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error.message);
  }
  return (data as any) || [];
};

export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from('users')
    .update({
      full_name: name
    })
    .eq('id', user.id);
};
