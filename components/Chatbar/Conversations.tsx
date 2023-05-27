import { memo } from 'react';
import { ConversationComponent } from './Conversation';
import { getConversationsFromStorage } from 'context/redux/conversationsSlice';

export default memo(function Conversations() {
  // =======================
  // Redux State
  // =======================
  const conversations = getConversationsFromStorage();

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
