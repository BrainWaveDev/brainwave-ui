import { ClearConversations } from './ClearConversations';
import { getConversationsFromStorage } from '../../context/redux/conversationsSlice';

export const ChatbarSettings = () => {
  const conversations = getConversationsFromStorage();
  return (
    <div className="flex flex-col items-center space-y-1 pt-1 text-sm">
      {conversations && conversations.length > 0 && <ClearConversations />}
    </div>
  );
};
