import { DocMetadata, Document } from '@/types/document';
import { supabase } from '../supabase-client';
import { SupabaseClient } from '@supabase/supabase-js';

export const fetchAllDocuments = async (
  supabaseClient?: SupabaseClient
): Promise<Document[]> => {
  const { data, error } = await (supabaseClient ?? supabase)
    .from('document')
    .select('*');

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
            metadata: document.metadata as unknown as DocMetadata
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

export const deleteDocuments = async (ids: number[]): Promise<void> => {
  await supabase.from('document').delete().in('id', ids).throwOnError();
};


export const getDucumentPublicURL = async (path:string) => {

  console.log(path)
  return await supabase.storage.from('documents').createSignedUrl(path,60)
}

const convertToDocMetadata = (metadata: any): DocMetadata => {
  return {
    cacheControl: metadata.cacheControl,
    contentLength: metadata.contentLength,
    eTag: metadata.eTag,
    httpStatusCode: metadata.httpStatusCode,
    lastModified: metadata.lastModified,
    mimetype: metadata.mimetype,
    size: metadata.size
  };
};
