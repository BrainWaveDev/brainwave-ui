import { Conversation, ConversationIdentifiable, ConversationSummary } from '../../types/chat';
import { KeyValuePair } from '../../types/data';
import { FC } from 'react';
import { ConversationComponent } from './Conversation';
import { useAppDispatch, useAppSelector } from 'context/redux/store';
import { deleteConversation, updateConversation } from 'context/redux/conversationsSlice';
import { optimisticCurrentConversationAction } from 'context/redux/currentConversationSlice';

interface Props {
  conversations: ConversationSummary[];
}

export const Conversations: FC<Props> = ({
  conversations,
}) => {

  const dispatch = useAppDispatch();
  const currentConversation = useAppSelector((state) => state.currentConverstaion).conversation;
  return (
    <div className="flex w-full flex-col gap-1">
      {conversations
        .slice()
        .reverse()
        .map((conversation) => (
          <ConversationComponent
            key={conversation.id}
            conversation={conversation}
            isSelected={currentConversation?.id === conversation.id}
            onSelectConversation={() => {
              dispatch(optimisticCurrentConversationAction.retriveAndSelectConversation(conversation))
            }}
          />
        ))}
    </div>
  );
};
