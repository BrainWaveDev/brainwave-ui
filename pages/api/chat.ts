import {
  Message,
  RequestBody,
  RequestMatchDocumentChunks
} from '../../types/chat';
import { qaPrompt } from '@/utils/app/prompts';
import { OpenAIError, OpenAIStream } from '@/utils/server';
import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';
// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge'
};

const openAIApiKey = process.env.OPENAI_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const handler = async (req: Request): Promise<Response> => {
  try {
    if (!openAIApiKey)
      throw new Error('Missing environment variable OPENAI_API_KEY');
    if (!supabaseUrl)
      throw new Error('Missing environment variable SUPABASE_URL');
    if (!supabaseServiceKey)
      throw new Error('Missing environment variable SUPABASE_SERVICE_ROLE_KEY');

    const { jwt, model, messages, search_space } =
      (await req.json()) as RequestBody;
    const userQuestion = messages.at(messages.length - 1);

    if (!jwt) throw new Error('Missing access token in request data');
    if (!userQuestion) throw new Error('Missing query in request data');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      data: { user }
    } = await supabase.auth.getUser(jwt);
    if (!user)
      return new Response('Error', {
        status: 401,
        statusText:
          'The user does not have an active session or is not authenticated'
      });

    const sanitizedQuery = userQuestion.content.trim();

    const embeddingResponse = await fetch(
      'https://api.openai.com/v1/embeddings',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: sanitizedQuery.replaceAll('\n', ' ')
        })
      }
    );

    if (embeddingResponse.status !== 200) {
      throw new Error('Failed to create embedding for question');
    }

    const {
      data: [{ embedding }]
    } = await embeddingResponse.json();

    let search_req: RequestMatchDocumentChunks = {
      user_id: user.id,
      embedding,
      match_count: 10,
      match_threshold: 0.75,
      min_content_length: 50
    };

    if (search_space) {
      search_req.search_space = search_space;
    }

    const { error: matchError, data: documentChunks } = await supabase.rpc(
      'match_document_chunks',
      search_req
    );


    if (matchError) {
      console.error(matchError);
      throw new Error('Failed to match document chunks');
    }

    const contentByDocument = new Map<string, string[]>();

    for (let i = 0; i < documentChunks.length; i++) {
      const documentName = documentChunks[i].document_name.split('/')[1];
      const documentChunk = documentChunks[i].content.trim();

      const documentContent = contentByDocument.get(documentName);

      if (documentContent) {
        documentContent.push(documentChunk);
      } else {
        contentByDocument.set(documentName, [documentChunk]);
      }
    }

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
    let tokenCount = 0;
    let contextText = '';
    let sourceKey = 1;
    let sources =
      documentChunks.length > 0 ? `\n\n<h3>Sources</h3>` : undefined;

    const iterator = contentByDocument.keys();
    for (const documentName of iterator) {
      const documentContent = contentByDocument.get(documentName);
      if (!documentContent || documentContent.length === 0) {
        continue;
      }

      const content =
        `Source key: \`${sourceKey}\`\n ` +
        `Content:\n\`` +
        `${documentContent.join('\n')}\`\n---\n`;

      const encoded = tokenizer.encode(content);
      tokenCount += encoded.text.length;

      if (tokenCount >= 1500) {
        break;
      } else {
        contextText += content;
        sources += `${sourceKey}. ${documentName}<br/>`;
        ++sourceKey;
      }
    }

    await init((imports) => WebAssembly.instantiate(wasm, imports));
    const encoding = new Tiktoken(
      tiktokenModel.bpe_ranks,
      tiktokenModel.special_tokens,
      tiktokenModel.pat_str
    );

    let promptToSend = qaPrompt(contextText);

    let messagesToSend: Message[] = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = {
        role: messages[i].role,
        content: messages[i].content
      };
      const tokens = encoding.encode(message.content);

      if (tokenCount + tokens.length + 1000 > model.tokenLimit) {
        break;
      }
      tokenCount += tokens.length;
      messagesToSend = [message, ...messagesToSend];
    }

    encoding.free();

    const stream = await OpenAIStream(
      model,
      promptToSend,
      messagesToSend,
      sources
    );

    return new Response(stream);
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError || error instanceof Error) {
      return new Response('Error', { status: 400, statusText: error.message });
    } else {
      return new Response('Error', {
        status: 500,
        statusText: 'There was an error processing your request'
      });
    }
  }
};

export default handler;
