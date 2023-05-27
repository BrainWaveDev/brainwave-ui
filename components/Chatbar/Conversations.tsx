import { memo } from 'react';
import { ConversationComponent } from './Conversation';
import { ConversationSummary } from '@/types/chat';

export default memo(function Conversations({
  conversations
}: {
  conversations: ConversationSummary[];
}) {
  return (
    <div className="flex w-full flex-col gap-1">
      {conversations
        .slice()
        .reverse()
        .map((conversation) => (
          <ConversationComponent
            key={conversation.id}
            conversation={conversation}
          />
        ))}
    </div>
  );
});
