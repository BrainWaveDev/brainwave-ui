import { Conversation, ConversationIdentifiable, ConversationSummary } from '../../types/chat';
import { KeyValuePair } from '../../types/data';
import { FC } from 'react';
import { ConversationComponent } from './Conversation';
import { useAppDispatch } from 'context/redux/store';
import { deleteConversation, updateConversation } from 'context/redux/conversationsSlice';

interface Props {
  loading: boolean;
  conversations: ConversationSummary[];
  selectedConversation: Conversation | undefined;
  onSelectConversation: (conversation: ConversationIdentifiable) => void;
}

export const Conversations: FC<Props> = ({
  loading,
  conversations,
  selectedConversation,
  onSelectConversation,
}) => {

  return (
    <div className="flex w-full flex-col gap-1">
      {conversations
        .slice()
        .reverse()
        .map((conversation) => (
          <ConversationComponent
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedConversation?.id === conversation.id}
            loading={loading}
            onSelectConversation={() => onSelectConversation(conversation)}
          />
        ))}
    </div>
  );
};
