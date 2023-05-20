import { Chat } from '@/components/Chat/Chat';
import { Chatbar } from '@/components/Chatbar/Chatbar';
import {
  RequestBody,
  Conversation,
  Message,
  ConversationSummary,
  ConversationIdentifiable
} from '../../types/chat';
import { KeyValuePair } from '../../types/data';
import { Folder } from '../../types/folder';
import { Prompt } from '../../types/prompt';
import {
  cleanConversationHistory,
  cleanSelectedConversation
} from '@/utils/app/clean';
import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/prompts';
import {
  clearAllConversations,
  createConversation,
  deleteConversation,
  inseartMessage,
  retriveConversation,
  retriveConversations,
  saveConversation,
  updateConversation,
  updateConversationFolder
} from '@/utils/app/conversation';
import {
  deleteFolder,
  retrieveListOfFolders,
  saveFolder,
  updateFolder
} from '@/utils/app/folders';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { randomNumberId } from '@/utils/app/createDBOperation';
import { getDocumentListServerSideProps } from '@/utils/supabase-admin';
import { Document } from '../../types';
import { clearSourcesFromMessages } from '@/utils/app/messages';
import { useSelector } from 'react-redux';
import { RootState, useAppSelector } from 'context/redux/store';
import { OpenAIModelID, OpenAIModels, fallbackModelID } from 'types/openai';

interface ChatProps {
  defaultModelId: OpenAIModelID;
  documents: Document[];
  error?: string;
}

// This interface is used to pass document information to the filter component
export interface DocumentInfo {
  id: number;
  name: string;
  selected: boolean;
}

const ChatUI: React.FC<ChatProps> = ({ defaultModelId, documents }) => {
  const { t } = useTranslation('chat');

  // STATE ----------------------------------------------
  const [loading, setLoading] = useState<boolean>(false);
  const [lightMode, setLightMode] = useState<'dark' | 'light'>('dark');
  const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false);

  const [folders, setFolders] = useState<Folder[]>([]);

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();
  const [currentMessage, setCurrentMessage] = useState<Message>();

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const { isLoading, session, error } = useSessionContext();

  // Managing documents for the filter component
  const [searchSpace, setSearchSpace] = useState<Set<number>>(
    new Set<number>(documents.map((document) => document.id))
  );

  const reduxFolders = useAppSelector((state: RootState) => state.folders);
  console.log("reduxFolders", reduxFolders);

  useEffect(() => {
    // loading after login
    if (isLoading || error) {
      return;
    }
    const user_id = session?.user?.id!;
    retrieveListOfFolders(user_id)
      .then((data) => {
        setFolders(
          data.map((dbFolder) => {
            return {
              id: dbFolder.id,
              name: dbFolder.name,
              user_id: dbFolder.user_id
            };
          })
        );
      })
      .catch((error) => {
        console.error(error);
      });

    retriveConversations(user_id)
      .then((data) => {
        setConversations(data);
        if (data.length > 0) {
          retriveConversation(data[0].id).then((conversation) => {
            setSelectedConversation(conversation);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isLoading, error]);

  // REFS ----------------------------------------------

  const containerRef = useRef<HTMLDivElement>(null);
  const stopConversationRef = useRef<boolean>(false);

  // FETCH RESPONSE ----------------------------------------------

  const handleSend = async (message: Message) => {
    if (!selectedConversation) return;

    // Remove sources from selectedConversation
    clearSourcesFromMessages(selectedConversation.messages);

    let updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message]
    };

    setSelectedConversation(updatedConversation);
    setLoading(true);
    setMessageIsStreaming(true);

    if (error || !session || !session.access_token) {
      setLoading(false);
      setMessageIsStreaming(false);
      toast.error(
        error?.message ? error.message : 'Error getting current user session'
      );
      return;
    }

    const requestBody: RequestBody = {
      jwt: session.access_token,
      model: updatedConversation.model,
      messages: updatedConversation.messages,
      search_space: Array.from(searchSpace)
    };

    const controller = new AbortController();
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok || !response.body) {
      setLoading(false);
      setMessageIsStreaming(false);
      if (!response.ok) toast.error(response.statusText);
      return;
    }

    const data = response.body;

    if (updatedConversation.messages.length === 1) {
      const { content } = message;
      const customName =
        content.length > 30 ? content.substring(0, 30) + '...' : content;

      updatedConversation = {
        ...updatedConversation,
        name: customName
      };
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;
    let text = '';

    while (!done) {
      if (stopConversationRef.current) {
        controller.abort();
        done = true;
        break;
      }
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunkValue = decoder.decode(value);

      text += chunkValue;

      if (isFirst) {
        isFirst = false;
        const updatedMessages: Message[] = [
          ...updatedConversation.messages,
          { id: undefined, role: 'assistant', content: chunkValue }
        ];

        updatedConversation = {
          ...updatedConversation,
          messages: updatedMessages
        };

        setSelectedConversation(updatedConversation);
      } else {
        const updatedMessages: Message[] = updatedConversation.messages.map(
          (message, index) => {
            if (index === updatedConversation.messages.length - 1) {
              return {
                ...message,
                content: text
              };
            }

            return message;
          }
        );

        updatedConversation = {
          ...updatedConversation,
          messages: updatedMessages
        };

        setSelectedConversation(updatedConversation);
      }
    }

    saveConversation(updatedConversation, session.user.id!).catch((error) => {
      console.error(error);
    });

    const updatedConversations: ConversationSummary[] = conversations.map(
      (conversation) => {
        if (conversation.id === selectedConversation.id) {
          return updatedConversation;
        }

        return conversation;
      }
    );

    if (updatedConversations.length === 0) {
      updatedConversations.push(updatedConversation);
    }

    setConversations(updatedConversations);

    setMessageIsStreaming(false);
  };

  // BASIC HANDLERS --------------------------------------------

  const handleLightMode = (mode: 'dark' | 'light') => {
    setLightMode(mode);
    localStorage.setItem('theme', mode);
  };

  const handleToggleChatbar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('showChatbar', JSON.stringify(!showSidebar));
  };

  const handleSelectConversation = (conversation: ConversationIdentifiable) => {
    setSelectedConversation(undefined);
    retriveConversation(conversation.id!)
      .then((data) => {
        setSelectedConversation(data);
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  // FOLDER OPERATIONS  --------------------------------------------

  

  const handleDeleteFolder = (folderId: number) => {
    const updatedFolders = folders.filter((f) => f.id !== folderId);
    setFolders(updatedFolders);
    deleteFolder(folderId).catch((_) => {
      setFolders(folders);
    });
  };

  const handleUpdateFolder = (folderId: number, name: string) => {
    var updatedFolder = folders.find((f) => f.id === folderId);
    if (!updatedFolder) return;
    const updatedFolders = folders.map((f) => {
      if (f.id === folderId) {
        return {
          ...f,
          name
        };
      }
      return f;
    });

    setFolders(updatedFolders);
    updatedFolder.name = name;
    updateFolder(updatedFolder).catch((_) => {
      setFolders(folders);
    });
  };

  // CONVERSATION OPERATIONS  --------------------------------------------

  const handleNewConversation = () => {
    const defaultModel = OpenAIModels[defaultModelId];
    const newConversation: Conversation = {
      id: randomNumberId(),
      name: `${t('New Conversation')}`,
      messages: [],
      model: defaultModel,
      prompt: DEFAULT_SYSTEM_PROMPT,
      folderId: null
    };

    const updatedConversations = [...conversations, newConversation];

    setSelectedConversation(newConversation);
    setConversations(updatedConversations);

    // if success, update the conversation with the database id
    createConversation(newConversation, session?.user!)
      .then((data) => {
        setConversations(
          updatedConversations.map((c) => {
            if (c.id === newConversation.id) {
              return {
                ...c,
                id: data.id
              };
            }
            return c;
          })
        );
        setSelectedConversation({
          ...newConversation,
          id: data.id
        });
      })
      .catch((_) => {
        setConversations(conversations);
      });

    setLoading(false);
  };

  const handleDeleteConversation = (conversation: ConversationIdentifiable) => {
    const updatedConversations = conversations.filter(
      (c) => c.id !== conversation.id
    );
    setConversations(updatedConversations);
    deleteConversation(conversation.id!).catch((_) => {
      // if error, restore the conversation
      setConversations(conversations);
    });
  };

  const handleUpdateConversation = async (
    conversation: ConversationIdentifiable | ConversationSummary,
    data: KeyValuePair
  ) => {
    const updatedConversation = {
      ...conversation,
      [data.key]: data.value
    };

    let isUpdated = false;

    if ([data.key].find((key) => key === 'folderId')) {
      setConversations(
        conversations.map((c) => {
          if (c.id === conversation.id) {
            return {
              ...c,
              folderId: data.value
            };
          }
          return c;
        })
      );
      isUpdated = await updateConversationFolder(conversation.id!, data.value);
    }

    if ([data.key].find((key) => key === 'name')) {
      setConversations(
        conversations.map((c) => {
          if (c.id === conversation.id) {
            return {
              ...c,
              name: data.value
            };
          }
          return c;
        })
      );
      isUpdated = await updateConversation(updatedConversation);
    }

    if (isUpdated) {
      try {
        const [selectedConvData, allConvData] = await Promise.all([
          retriveConversation(conversation.id!),
          retriveConversations(session?.user?.id!)
        ]);
        setSelectedConversation(selectedConvData);
        setConversations(allConvData);
      } catch (error) {
        console.warn(error);
      }
    } else {
      setConversations(conversations);
    }
  };

  const handleClearConversations = () => {
    setConversations([]);
    setSelectedConversation(undefined);
    clearAllConversations(session?.user?.id!).catch((_) => {
      console.error('Error clearing conversations');
    });
  };

  const handleEditMessage = (message: Message, messageIndex: number) => {
    if (!selectedConversation) {
      throw new Error('No conversation selected, this should not happen');
    }
    const updatedMessages = selectedConversation.messages
      .map((m, i) => {
        if (i < messageIndex) {
          return m;
        }
      })
      .filter((m) => m) as Message[];

    const updatedConversation = {
      ...selectedConversation,
      messages: updatedMessages
    };

    const prev_message = currentMessage;
    const prev_conversation = selectedConversation;
    setSelectedConversation(updatedConversation);
    setCurrentMessage(message);
    inseartMessage(
      message,
      messageIndex,
      selectedConversation.id!,
      session?.user?.id!
    ).catch((_) => {
      // if error, restore the conversation
      setSelectedConversation(prev_conversation);
      setCurrentMessage(prev_message);
      console.error('Error editing message');
    });
  };

  // EFFECTS  --------------------------------------------

  useEffect(() => {
    if (!currentMessage) {
      return;
    }
    handleSend(currentMessage);
    setCurrentMessage(undefined);
  }, [currentMessage]);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }
  }, [selectedConversation]);

  // ON LOAD --------------------------------------------

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      setLightMode(theme as 'dark' | 'light');
    }

    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }

    const showChatbar = localStorage.getItem('showChatbar');
    if (showChatbar) {
      setShowSidebar(showChatbar === 'true');
    }

    const prompts = localStorage.getItem('prompts');
    if (prompts) {
      setPrompts(JSON.parse(prompts));
    }

    const conversationHistory = localStorage.getItem('conversationHistory');
    if (conversationHistory) {
      const parsedConversationHistory: Conversation[] =
        JSON.parse(conversationHistory);
      const cleanedConversationHistory = cleanConversationHistory(
        parsedConversationHistory
      );
      setConversations(cleanedConversationHistory);
    }

    const selectedConversation = localStorage.getItem('selectedConversation');
    if (selectedConversation) {
      const parsedSelectedConversation: Conversation =
        JSON.parse(selectedConversation);
      const cleanedSelectedConversation = cleanSelectedConversation(
        parsedSelectedConversation
      );
      setSelectedConversation(cleanedSelectedConversation);
    } else {
      setSelectedConversation({
        id: randomNumberId(),
        name: 'New conversation',
        messages: [],
        model: OpenAIModels[defaultModelId],
        prompt: DEFAULT_SYSTEM_PROMPT,
        folderId: null
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>BrainBot</title>
        <meta name="description" content="ChatGPT but better." />
        <meta
          name="viewport"
          content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`flex h-[calc(100vh_-_4rem)] min-w-full flex-col text-sm text-white dark:text-white ${lightMode}`}
      >
        <div
          className="flex h-full w-full pt-0 relative"
          ref={containerRef}
        >
          <Chatbar
            loading={messageIsStreaming}
            conversations={conversations}
            lightMode={lightMode}
            selectedConversation={selectedConversation}
            showSidebar={showSidebar}
            handleToggleChatbar={handleToggleChatbar}
            onToggleLightMode={handleLightMode}
            onNewConversation={handleNewConversation}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onUpdateConversation={handleUpdateConversation}
            onClearConversations={handleClearConversations}
          />
          <div className="flex flex-1 w-full">
            <Chat
              conversation={selectedConversation}
              messageIsStreaming={messageIsStreaming}
              loading={loading}
              prompts={prompts}
              onSend={handleSend}
              onUpdateConversation={handleUpdateConversation}
              onEditMessage={handleEditMessage}
              stopConversationRef={stopConversationRef}
              documents={documents}
              searchSpace={searchSpace}
              setSearchSpace={setSearchSpace}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatUI;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const defaultModelId =
    (process.env.DEFAULT_MODEL &&
      Object.values(OpenAIModelID).includes(
        process.env.DEFAULT_MODEL as OpenAIModelID
      ) &&
      process.env.DEFAULT_MODEL) ||
    fallbackModelID;

  const props = {
    defaultModelId,
    ...(await serverSideTranslations(context.locale ?? 'en', [
      'common',
      'chat',
      'sidebar',
      'markdown',
      'promptbar'
    ]))
  };

  // Combine with the props containing the document list
  return getDocumentListServerSideProps(context, props);
};
