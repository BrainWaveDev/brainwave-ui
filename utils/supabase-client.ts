import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import { ProductWithPrice } from '../types';
import { DocMetadata, Document } from '../types/document';
import type { Database } from 'types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export const supabase = createBrowserSupabaseClient<Database>();

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

