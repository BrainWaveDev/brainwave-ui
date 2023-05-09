import { codeBlock, oneLine } from 'common-tags';

export const DEFAULT_SYSTEM_PROMPT =
  process.env.DEFAULT_SYSTEM_PROMPT ||
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const defaultPrompt = (contextText: string = '') => codeBlock`
      ${
        oneLine`
        Write an answer to the user's questions based on the provided context.
        If the context provides insufficient information or no context was provided,
        you must say` +
        `\n"There is not enough context to answer this question. Here is my generic response:"\n\n` +
        oneLine`and provide a generic response. DO NOT mention the document in 
        the response by saying "According to..." or similar phrases. For each 
        sentence in your answer, indicate which sources most support it
        via valid citation markers at the end of sentences, like (Source Name).
        Output your response as a Markdown.\n\n` +
        `${
          contextText.length > 0
            ? `Context sections, separated by ---:\n\n${contextText}`
            : 'No context.'
        }`
      }`;
