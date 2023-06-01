import { Conversation } from 'types/chat';
import { Folder } from 'types/folder';

interface ConversationType {
  type: 'conversation';
  resource: Conversation;
}

interface FolderType {
  type: 'folder';
  resource: Folder;
}

type ResourceTypeName = 'conversation' | 'folder';
type ResourceType<T> = T extends 'conversation'
  ? ConversationType
  : T extends 'folder'
  ? FolderType
  : never;

type GetResult<T extends ResourceTypeName> =
  | {
      exist: boolean;
      resource: ResourceType<T>['resource'];
    }
  | {
      exist: boolean;
      resource: null;
    };

export const get = <T extends ResourceTypeName>(
  resourceType: T,
  id: string
): GetResult<T> => {
  let data = localStorage.getItem(`${resourceType}-${id}`);
  if (data) {
    return {
      exist: true,
      resource: JSON.parse(data) as ResourceType<T>['resource']
    };
  }
  return { exist: false, resource: null };
};

export const set = <T extends ResourceTypeName>(
  resourceType: T,
  id: string,
  resource: ResourceType<T>['resource']
) => {
  localStorage.setItem(`${resourceType}-${id}`, JSON.stringify(resource));
};

export const remove = <T extends ResourceTypeName>(
  resourceType: T,
  id: string
) => {
  localStorage.removeItem(`${resourceType}-${id}`);
};

export const removeAll = <T extends ResourceTypeName>(resourceType: T) => {
  const keysToRemove = Object.keys(localStorage).filter((key) =>
    key.startsWith(`${resourceType}-`)
  );
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
