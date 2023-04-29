import { Chat } from '@/components/Chat/Chat';
import { Chatbar } from '@/components/Chatbar/Chatbar';
import { Navbar } from '@/components/Mobile/Navbar';
import { RequestBody, Conversation, Message } from '../types/chat';
import { KeyValuePair } from '../types/data';
import { Folder } from '../types/folder';
import {
  fallbackModelID,
  OpenAIModelID,
  OpenAIModels
} from '../types/openai';
import { Prompt } from '../types/prompt';
import {
  cleanConversationHistory,
  cleanSelectedConversation
} from '@/utils/app/clean';
import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';
import {
  saveConversation,
  saveConversations,
  updateConversation
} from '@/utils/app/conversation';
import { deleteFolder, randomFolderId, retrieveListOfFolders, saveFolder, updateFolder } from '@/utils/app/folders';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { supabase } from '@/utils/supabase-client';
import { useRouter } from 'next/router';
import { useSessionContext, useUser } from '@supabase/auth-helpers-react';

interface HomeProps {
  defaultModelId: OpenAIModelID;
}

const ChatUI: React.FC<HomeProps> = ({
  defaultModelId
}) => {
  const { t } = useTranslation('chat');

  // STATE ----------------------------------------------

  const [loading, setLoading] = useState<boolean>(false);
  const [lightMode, setLightMode] = useState<'dark' | 'light'>('dark');
  const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false);

  const [folders, setFolders] = useState<Folder[]>([]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();
  const [currentMessage, setCurrentMessage] = useState<Message>();

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const { isLoading, session, error } = useSessionContext();
  useEffect(() => {
    // loading after login
    if (isLoading || error) {return}
    const user = session?.user;
    retrieveListOfFolders(user?.id!)
    .onSuccess((data) => {
      setFolders(data);
    })
    .onError((error) => {
      console.log(error);
    }).execute()

  }, [isLoading, error]);

  
  // REFS ----------------------------------------------

  const containerRef = useRef<HTMLDivElement>(null);
  const stopConversationRef = useRef<boolean>(false);

  // FETCH RESPONSE ----------------------------------------------

  const handleSend = async (message: Message) => {
    if (!selectedConversation) return;

    let updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message]
    };

    setSelectedConversation(updatedConversation);
    setLoading(true);
    setMessageIsStreaming(true);

    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

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
      messages: updatedConversation.messages
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
          { role: 'assistant', content: chunkValue }
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

    saveConversation(updatedConversation);

    const updatedConversations: Conversation[] = conversations.map(
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

    saveConversations(updatedConversations);

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

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    saveConversation(conversation);
  };

  // FOLDER OPERATIONS  --------------------------------------------

  const handleCreateFolder = (name: string) => {
    const tempId = randomFolderId();
    const newFolder: Folder = {
      user_id: session?.user?.id!,
      id: tempId,
      name,
    };

    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    saveFolder(newFolder)
      .onError((error) => {
        console.log(error);
        // reset folders
        setFolders(folders);
      })
      .onSuccess((data: Folder) => {
        console.log("handleCreateFolder -> data", data)
        setFolders(updatedFolders.map((f) => {
          if (f.id === tempId) {
            return {
              ...f,
              id: data.id
            };
          }
          return f;
        }));
      })
      .execute()
  };

  const handleDeleteFolder = (folderId: number) => {
    const updatedFolders = folders.filter((f) => f.id !== folderId);
    setFolders(updatedFolders);
    deleteFolder(folderId)
      .onError((error) => {
        console.log(error);
        setFolders(folders);
      }).execute()
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
    updateFolder(updatedFolder)
    .onError((error) => {
      setFolders(folders);
    }).execute()
    
  };

  // CONVERSATION OPERATIONS  --------------------------------------------

  const handleNewConversation = () => {
    const defaultModel = {
      id: OpenAIModels[defaultModelId].id,
      name: OpenAIModels[defaultModelId].name,
      maxLength: OpenAIModels[defaultModelId].maxLength,
      tokenLimit: OpenAIModels[defaultModelId].tokenLimit
    }
    const lastConversation = conversations[conversations.length - 1];

    const newConversation: Conversation = {
      id: uuidv4(),
      name: `${t('New Conversation')}`,
      messages: [],
      model: lastConversation?.model || defaultModel,
      prompt: DEFAULT_SYSTEM_PROMPT,
      folderId: null
    };

    const updatedConversations = [...conversations, newConversation];

    setSelectedConversation(newConversation);
    setConversations(updatedConversations);

    saveConversation(newConversation);

    setLoading(false);
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.filter(
      (c) => c.id !== conversation.id
    );
    setConversations(updatedConversations);
    saveConversations(updatedConversations);

    if (updatedConversations.length > 0) {
      setSelectedConversation(
        updatedConversations[updatedConversations.length - 1]
      );
      saveConversation(updatedConversations[updatedConversations.length - 1]);
    } else {
      setSelectedConversation({
        id: uuidv4(),
        name: 'New conversation',
        messages: [],
        model: OpenAIModels[defaultModelId],
        prompt: DEFAULT_SYSTEM_PROMPT,
        folderId: null
      });
      localStorage.removeItem('selectedConversation');
    }
  };

  const handleUpdateConversation = (
    conversation: Conversation,
    data: KeyValuePair
  ) => {
    debugger
    // const updatedConversation = {
    //   ...conversation,
    //   [data.key]: data.value
    // };

    // const { single, all } = updateConversation(
    //   updatedConversation,
    //   conversations
    // );

    // setSelectedConversation(single);
    // setConversations(all);
  };

  const handleClearConversations = () => {
    setConversations([]);
    localStorage.removeItem('conversationHistory');

    setSelectedConversation({
      id: uuidv4(),
      name: 'New conversation',
      messages: [],
      model: OpenAIModels[defaultModelId],
      prompt: DEFAULT_SYSTEM_PROMPT,
      folderId: null
    });
    localStorage.removeItem('selectedConversation');

    // TODO: update converstation and folder in db
  };

  const handleEditMessage = (message: Message, messageIndex: number) => {
    if (!selectedConversation) {
      return;
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

    const { single, all } = updateConversation(
      updatedConversation,
      conversations
    );

    setSelectedConversation(single);
    setConversations(all);

    setCurrentMessage(message);

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
        id: uuidv4(),
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
      {selectedConversation && (
        <div
          className={`flex h-[calc(100vh_-_4rem)] flex-col text-sm text-white dark:text-white ${lightMode}`}
        >
          <div className="fixed top-0 w-full sm:hidden">
            <Navbar
              selectedConversation={selectedConversation}
              onNewConversation={handleNewConversation}
            />
          </div>
          <div
            className="flex h-full w-full pt-[48px] sm:pt-0 relative"
            ref={containerRef}
          >
            <Chatbar
              loading={messageIsStreaming}
              conversations={conversations}
              lightMode={lightMode}
              selectedConversation={selectedConversation}
              folders={folders}
              showSidebar={showSidebar}
              handleToggleChatbar={handleToggleChatbar}
              onToggleLightMode={handleLightMode}
              onCreateFolder={(name) => handleCreateFolder(name)}
              onDeleteFolder={handleDeleteFolder}
              onUpdateFolder={handleUpdateFolder}
              onNewConversation={handleNewConversation}
              onSelectConversation={handleSelectConversation}
              onDeleteConversation={handleDeleteConversation}
              onUpdateConversation={handleUpdateConversation}
              onClearConversations={handleClearConversations}
            />
            <div
              className="flex flex-1 w-full"
              onClick={() => {
                if (showSidebar) setShowSidebar(false);
              }}
            >
              <Chat
                conversation={selectedConversation}
                messageIsStreaming={messageIsStreaming}
                loading={loading}
                prompts={prompts}
                onSend={handleSend}
                onUpdateConversation={handleUpdateConversation}
                onEditMessage={handleEditMessage}
                stopConversationRef={stopConversationRef}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatUI;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const defaultModelId =
    (process.env.DEFAULT_MODEL &&
      Object.values(OpenAIModelID).includes(
        process.env.DEFAULT_MODEL as OpenAIModelID
      ) &&
      process.env.DEFAULT_MODEL) ||
    fallbackModelID;

  return {
    props: {
      serverSideApiKeyIsSet: !!process.env.OPENAI_API_KEY,
      defaultModelId,
      ...(await serverSideTranslations(locale ?? 'en', [
        'common',
        'chat',
        'sidebar',
        'markdown',
        'promptbar'
      ]))
    }
  };
};
