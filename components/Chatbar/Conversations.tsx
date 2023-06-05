import { memo, useMemo } from 'react';
import { ConversationComponent } from './Conversation';
import { ConversationSummary } from '@/types/chat';
import { getCurrentConversationFromStore } from '../../context/redux/currentConversationSlice';
// @ts-ignore
import { AnimatePresence } from 'framer-motion';

export default memo(function Conversations({
  conversations
}: {
  conversations: ConversationSummary[];
}) {
  const { conversation: currentConversation } =
    getCurrentConversationFromStore();
  const renderedConversations = useMemo(
    () => conversations.slice().reverse(),
    [conversations]
  );
  return (
    <div className="flex w-full flex-col gap-1">
      <AnimatePresence initial={false}>
        {renderedConversations.map((conversation) => (
          <ConversationComponent
            key={conversation.id}
            conversation={conversation}
            current={
              currentConversation
                ? currentConversation.id === conversation.id
                : false
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
});
