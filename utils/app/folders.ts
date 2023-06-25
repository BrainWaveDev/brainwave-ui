import { Folder } from '@/types/folder';
import { supabase } from '../supabase-client';
import { SupabaseClient } from '@supabase/supabase-js';

export const saveFolder = async (folder: Folder) => {
  const { data, error } = await supabase
    .from('folder')
    .insert({
      name: folder.name,
      user_id: folder.user_id!
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const deleteFolder = async (folderId: number) => {
  const { data, error } = await supabase
    .from('folder')
    .delete()
    .eq('id', folderId);

  if (error) {
    throw error;
  }

  return data;
};

export const retrieveFolder = async (folderId: number) => {
  const { data, error } = await supabase
    .from('folder')
    .select('*')
    .eq('id', folderId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const fetchAllFolders = async (supabaseClient?: SupabaseClient) => {
  const { data, error } = await (supabaseClient ?? supabase)
    .from('folder')
    .select('*');

  if (error) {
    throw Error(error.message);
  }

  return data.map((dbFolder) => {
    return {
      id: dbFolder.id,
      name: dbFolder.name,
      user_id: dbFolder.user_id
    };
  }) as Folder[];
};

export const updateFolder = async (folder: Folder) => {
  const { data, error } = await supabase
    .from('folder')
    .update({
      name: folder.name
    })
    .eq('id', folder.id);

  if (error) {
    throw error;
  }

  return data;
};

export const renameFolder = async (id: number, newName: string) => {
  const { data, error } = await supabase
    .from('folder')
    .update({
      name: newName
    })
    .eq('id', id);

  if (error) {
    throw error;
  }

  return data;
};
