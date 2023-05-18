import { Message } from '../../types/chat';

export const clearSourcesFromMessages = (messages: Message[]) => {
  messages.forEach((message) => {
    if (message.role === 'assistant') {
      // Find place in the string where the source is mentioned
      const sourceIndex = message.content.indexOf('<h3>Sources</h3>');
      if (sourceIndex !== -1) {
        // Remove the source from the message content
        message.content = message.content.substring(0, sourceIndex);
      }
    }
  });
};
