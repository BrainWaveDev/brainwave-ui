import { DocMetadata, Document } from "@/types/document";
import { supabase } from "../supabase-client";
export const fetchAllDocuments = async (user_id: string): Promise<Document[]> => {
  const { data } = await supabase.from("document").select("*").eq("owner", user_id).throwOnError();
  return data!.map(doc => ({
    ...doc,
    metadata: convertToDocMetadata(doc.metadata)
  })) as Document[];
}

export const deleteDocuments = async (ids: number[]): Promise<void> => {
  await supabase.from("document")
    .delete()
    .in("id", ids)
    .throwOnError();
}


const convertToDocMetadata = (metadata: any): DocMetadata => {
  return {
    cacheControl: metadata.cacheControl,
    contentLength: metadata.contentLength,
    eTag: metadata.eTag,
    httpStatusCode: metadata.httpStatusCode,
    lastModified: metadata.lastModified,
    mimetype: metadata.mimetype,
    size: metadata.size,
  };
}
