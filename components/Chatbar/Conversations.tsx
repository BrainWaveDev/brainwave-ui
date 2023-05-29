import { memo, useMemo } from 'react';
import { ConversationComponent } from './Conversation';
import { useAppSelector } from 'context/redux/store';

export default memo(function Conversations({searchTerm}: {searchTerm: string}) {

  const conversations = useAppSelector((state) => state.conversations);

  const filteredConversations = useMemo(
    () =>
      conversations.filter((conversation) => {
        const searchable = conversation.name.toLocaleLowerCase();
        return searchable.toLowerCase().includes(searchTerm.toLowerCase());
      }),
    [searchTerm, conversations]
  );
  return (
    <div className="flex w-full flex-col gap-1">
      {filteredConversations
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
