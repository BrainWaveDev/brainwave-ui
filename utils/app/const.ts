import { codeBlock } from 'common-tags';

export const DEFAULT_SYSTEM_PROMPT =
  process.env.DEFAULT_SYSTEM_PROMPT ||
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const defaultPrompt = (contextText: string = '') => codeBlock`
      ${`
        You are an intelligent language model that answers questions using
        the information from the user's documents. Given the following sections 
        from the user's documents, answer the question using only that information,
        outputted in markdown format. Include references to the context from where 
        you got the information. If you are unsure and the answer
        is not explicitly written in the documentation, say
        "Unfortunately, I wasn't able to find relevant information in your documents. 
        Here is my generic response:\n\n" and provided a generic response. Respond as 
        markdown. 
      `}

      ${contextText.length > 0 && `Context sections:\n${contextText}`}
      `;
