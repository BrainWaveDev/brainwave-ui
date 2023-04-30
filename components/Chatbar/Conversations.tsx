import { Conversation, ConversationIdentifiable, ConversationSummary } from '../../types/chat';
import { KeyValuePair } from '../../types/data';
import { FC } from 'react';
import { ConversationComponent } from './Conversation';

interface Props {
  loading: boolean;
  conversations: ConversationSummary[];
  selectedConversation: Conversation | undefined;
  onSelectConversation: (conversation: ConversationIdentifiable) => void;
  onDeleteConversation: (conversation: ConversationIdentifiable) => void;
  onUpdateConversation: (
    conversation: ConversationIdentifiable,
    data: KeyValuePair
  ) => void;
}

export const Conversations: FC<Props> = ({
  loading,
  conversations,
  selectedConversation,
  onSelectConversation,
  onDeleteConversation,
  onUpdateConversation
}) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {conversations
        .slice()
        .reverse()
        .map((conversation, index) => (
          <ConversationComponent
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedConversation?.id === conversation.id}
            loading={loading}
            onSelectConversation={() => onSelectConversation(conversation)}
            onDeleteConversation={() => onDeleteConversation(conversation)}
            onUpdateConversation={(data:KeyValuePair) => onUpdateConversation(conversation, data)}
          />
        ))}
    </div>
  );
};
