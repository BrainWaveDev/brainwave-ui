import { Prompt } from '@/types/prompt';
import { codeBlock } from 'common-tags';
import { SupabaseClient } from '@supabase/supabase-js';

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

export const DEFAULT_SYSTEM_PROMPT =
  process.env.DEFAULT_SYSTEM_PROMPT ||
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const formatPrompt = (promptText: string, context?: string) => codeBlock`
    ${promptText}\n\n${
  context && context.length > 0
    ? `Context sections, separated by ---:\n---\n${context}`
    : 'No context.'
}`;

// ==== Partial prompt definitions ====
export const defaultPrompt: Prompt = {
  id: 1,
  name: 'Default',
  content: DEFAULT_SYSTEM_PROMPT
};

export const fetchPrompts = async (supabaseAdmin: SupabaseClient) => {
  const { data, error } = await supabaseAdmin.from('prompt').select('*');
  if (error) throw Error(error.message);
  return data;
};
