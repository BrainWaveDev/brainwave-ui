import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import { ProductWithPrice, Document, DocMetadata } from '../types';
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

export const getDocumentList = async (supabaseClient?: SupabaseClient) => {
  const { data, error } = supabaseClient
    ? await supabaseClient.from('document').select()
    : await supabase.from('document').select();

  if (error) {
    throw Error(error.message);
  }

  // Default sorting by date
  let documents: Document[] = [];
  if (data && data.length > 0) {
    // @ts-ignore
    documents = data
      .reduce((documentList: Document[], document) => {
        const name = document.name.split('/').pop();
        if (name && name !== '') {
          // @ts-ignore
          documentList.push({
            ...document,
            name,
            metadata: document.metadata as DocMetadata
          });
        }

        return documentList;
      }, [])
      .sort((a, b) =>
        new Date(a.metadata.lastModified) > new Date(b.metadata.lastModified)
          ? -1
          : 1
      );
  }
  return documents;
};
