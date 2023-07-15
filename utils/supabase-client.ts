import { createPagesBrowserClient, User } from '@supabase/auth-helpers-nextjs';

import { ProductWithPrice } from '../types';
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

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }
  // TODO: improve the typing here.
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
