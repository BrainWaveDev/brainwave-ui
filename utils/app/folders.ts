import { Folder } from '../../types/folder';
import { createDatabaseOperation } from './createDBOperation';
import { supabase } from '../supabase-client';


export const randomFolderId = () => {
  // generate a random number between 100,000,000 and Number.MAX_SAFE_INTEGER
  // temprory holder for id, replace with db generated id later
  const minValue = 100_000_000;
  const maxValue = Number.MAX_SAFE_INTEGER;

  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
} 




export const saveFolder = (folder: Folder) => {
  const operation = () => supabase.from("folder").insert({
    name: folder.name,
    user_id: folder.user_id,
  }).select();

  return createDatabaseOperation(operation);
};

export const deleteFolder = (folderId: number) => {
  const operation = () => supabase.from("folder").delete().eq("id", folderId);

  return createDatabaseOperation(operation);
};

export const retrieveFolder = (folderId: number) => {
  const operation = () => supabase.from("folder").select("*").eq("id", folderId).single();
  return createDatabaseOperation(operation);
};

export const retrieveListOfFolders = (userId: string) => {
  const operation = () => supabase.from("folder").select("*").eq("user_id", userId);
  return createDatabaseOperation(operation);
};


export const updateFolder = (folder: Folder) => {
  const operation = () => supabase.from("folder").update({
    name: folder.name,
  }).eq("id", folder.id);

  return createDatabaseOperation(operation);
};
