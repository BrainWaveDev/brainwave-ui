import { Prompt } from '../../types/prompt';

export const updatePrompt = (updatedPrompt: Prompt, allPrompts: Prompt[]) => {
  const updatedPrompts = allPrompts.map((c) => {
    if (c.id === updatedPrompt.id) {
      return updatedPrompt;
    }

    return c;
  });

  savePrompts(updatedPrompts);

  return {
    single: updatedPrompt,
    all: updatedPrompts
  };
};

export const savePrompts = (prompts: Prompt[]) => {
  localStorage.setItem('prompts', JSON.stringify(prompts));
};

import { codeBlock, oneLine } from 'common-tags';

export const DEFAULT_SYSTEM_PROMPT =
  process.env.DEFAULT_SYSTEM_PROMPT ||
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const qaPrompt = (contextText: string = '') => codeBlock`
      ${
        oneLine`
        Write an answer to the user's questions based on the provided context. 
        If the context provides insufficient information or no context was provided, 
        you must say` +
        `\n"There is not enough context to provide a definitive answer. I will try my best to answer this question using my knowledge and reasoning."\n` +
        oneLine` and provide a generic response. DO NOT make up information about unknown entities. 
        DO NOT mention the document in the response by saying "According to", 
        "As discussed in" or similar phrases. Respond as if the information in 
        the provided context is true and accurate. For each sentence in your answer, 
        indicate key of the source that most supports it via valid citation markers 
        before the at the end of sentence, like (1). DO NOT try to make up sources. 
        Format your response using markdown.` +
        `\n\n${
          contextText.length > 0
            ? `Context sections, separated by ---:\n---\n${contextText}`
            : 'No context.'
        }`
      }`;
