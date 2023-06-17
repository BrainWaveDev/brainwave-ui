import { memo, useMemo } from 'react';
import { ConversationComponent } from './Conversation';
import { ConversationSummary } from '@/types/chat';
import { getCurrentConversationFromStore } from '../../context/redux/currentConversationSlice';
// @ts-ignore
import { motion, AnimatePresence } from 'framer-motion';

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
      <AnimatePresence initial={true}>
        {renderedConversations.map((conversation) => (
          <motion.div
            key={conversation.id}
            initial={{ height: 0 }}
            animate={{ height: 'fit-content' }}
            transition={{ ease: 'easeOut', duration: 0.5 }}
          >
            <ConversationComponent
              conversation={conversation}
              current={
                currentConversation
                  ? currentConversation.id === conversation.id
                  : false
              }
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});
