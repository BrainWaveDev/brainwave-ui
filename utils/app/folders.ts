import { Folder } from '../../types/folder';
import { supabase } from '../supabase-client';

export const saveFolder = async (folder: Folder) => {
  const { data, error } = await supabase.from("folder").insert({
    name: folder.name,
    user_id: folder.user_id!,
  })
  .select()
  .single();

  if (error) {
    throw error;
  }

  return data;

};

export const deleteFolder = async (folderId: number) => {
  const { data, error } = await supabase.from("folder").delete().eq("id", folderId);

  if (error) {
    throw error;
  }

  return data;
};

export const retrieveFolder = async (folderId: number) => {
  const { data, error } = await supabase.from("folder").select("*").eq("id", folderId).single();

  if (error) {
    throw error;
  }

  return data;
};

export const retrieveListOfFolders = async (userId: string) => {
  const { data, error } = await supabase.from("folder").select("*").eq("user_id", userId);

  if (error) {
    throw error;
  }

  return data;
};

export const updateFolder = async (folder: Folder) => {
  const { data, error } = await supabase.from("folder").update({
    name: folder.name,
  }).eq("id", folder.id);

  if (error) {
    throw error;
  }

  return data;
};