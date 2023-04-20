import { codeBlock, oneLine } from 'common-tags';

export const DEFAULT_SYSTEM_PROMPT =
  process.env.DEFAULT_SYSTEM_PROMPT ||
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const defaultPrompt = (contextText: string = '') => codeBlock`
      ${
        oneLine`
        You are an intelligent language model that answers questions using
        the information from the user's documents. Given the following sections 
        from the user's documents, answer the question using only that information,
        outputted in markdown format. If you are unsure about the answer, the answer is not explicitly 
        written in the user's documents or no context was provided, say` +
        `\n"Unfortunately, I wasn't able to find relevant information in your documents. Here is my generic response:"\n\n` +
        oneLine`and provide a generic response. If the context was provided and 
        your based your answer on the context, then include name of the document from where you
        got the information in the brackets in the following format: "Source: {document name}".
        Respond as markdown. 
      `
      }

      ${
        contextText.length > 0
          ? `Context sections:\n\n${contextText}`
          : 'No context.'
      }
      `;
