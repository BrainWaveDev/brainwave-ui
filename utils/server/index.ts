import { Message } from '../../types/chat';
import { OpenAIModel } from '../../types/openai';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval
} from 'eventsource-parser';
import { OPENAI_API_HOST } from '../app/prompts';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export class OpenAIError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(message: string, type: string, param: string, code: string) {
    super(message);
    this.name = 'OpenAIError';
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

export const OpenAIStream = async (
  model: OpenAIModel,
  systemPrompt: string,
  messages: Message[],
  sources?: string
) => {
  const res = await fetch(`${OPENAI_API_HOST}/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      ...(process.env.OPENAI_ORGANIZATION && {
        'OpenAI-Organization': process.env.OPENAI_ORGANIZATION
      })
    },
    method: 'POST',
    body: JSON.stringify({
      model: model.id,
      messages: [
        ...messages.slice(0, messages.length - 1),
        {
          role: 'system',
          content: systemPrompt
        },
        messages.at(messages.length - 1)
      ],
      max_tokens: 1000,
      temperature: 0.7,
      stream: true
    })
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const result = await res.json();
    if (result.error) {
      throw new OpenAIError(
        result.error.message,
        result.error.type,
        result.error.param,
        result.error.code
      );
    } else {
      throw new Error(
        `OpenAI API returned an error: ${
          decoder.decode(result?.value) || result.statusText
        }`
      );
    }
  }

  return new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            /* TODO: Implement new and better way to return document sources
            if (sources) {
              // Add system prompt at the final parser message
              const queue = encoder.encode(sources);
              controller.enqueue(queue);
            }
             */
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });
};

export const supabaseEdgeclient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

if (!supabaseEdgeclient) {
  throw new Error('No Supabase server client');
}
