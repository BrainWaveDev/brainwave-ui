import { Message, RequestBody, RequestMatchDocumentChunks } from '@/types/chat';
import { formatPrompt, defaultPrompt, fetchPrompts } from '@/utils/app/prompts';
import { OpenAIError, OpenAIStream } from '@/utils/server';
import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';
// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { Prompt } from '@/types/prompt';
import { Database } from '@/types/supabase';

export const config = {
  runtime: 'edge'
};

// ==== API keys ====
const openAIApiKey = process.env.OPENAI_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ratelimit_per_hour_free_user = parseInt(process.env.NEXT_PUBLIC_FREE_USER_MESSAGE_PER_HOUR!);
const ratelimit_per_hour_pro_user = parseInt(process.env.NEXT_PUBLIC_PRO_USER_MESSAGE_PER_HOUR!);

const allowRequest = async (user: User, supabase: SupabaseClient<Database>) => {
  const now = new Date();
  const one_hours_ago = new Date(now.getTime() - 60 * 60 * 1000);
  const count_res_future = supabase.rpc('count_messages', {
    p_user_id: user.id,
    p_target_time: one_hours_ago.toISOString()
  })

  const subscription_future = supabase.from('subscriptions').select("*").eq('user_id', user.id);

  const [count_res, subscriptions] = await Promise.all([count_res_future, subscription_future]);

  if (count_res.error || undefined == count_res.data) {
    console.error(count_res.error);
    throw new Error('Failed to count messages');
  }

  if (subscriptions.error) {
    throw new Error('Failed to retrive subscription messages');
  }

  if (!subscriptions.data) {
    throw new Error("unknown error, database failed")
  }
  if (subscriptions.data.length >= 2) {
    throw new Error('Subscription Table RLS has failed, please check')
  }

  let subscription_status_arr = subscriptions.data.map(s=>s.status)
  let status = subscription_status_arr[0]
  const count = count_res.data;
  const isPro = status == "active";
  if (!isPro && count >= ratelimit_per_hour_free_user) return false;
  if (isPro && count >= ratelimit_per_hour_pro_user) return false;

  return true

}

const handler = async (req: Request): Promise<Response> => {
  try {
    if (!openAIApiKey)
      throw new Error('Missing environment variable OPENAI_API_KEY');
    if (!supabaseUrl)
      throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseServiceKey)
      throw new Error('Missing environment variable SUPABASE_SERVICE_ROLE_KEY');

    const { jwt, model, messages, search_space, promptId } =
      (await req.json()) as RequestBody;
    const userQuestion = messages.at(messages.length - 1);

    if (!jwt) throw new Error('Missing access token in request data');
    if (!userQuestion) throw new Error('Missing query in request data');

    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false
      }
    });

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

    const embeddingFuture = await fetch(
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

    const allowRequestFuture = await allowRequest(user, supabase);

    const [embeddingResponse, allowResult] = await Promise.all([
      embeddingFuture,
      allowRequestFuture
    ]);

    if (!allowResult) {
      return new Response('Error', {
        status: 429,
        statusText: 'Too many requests'
      });
    }

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
      match_threshold: 0.78,
      min_content_length: 50
    };

    if (search_space) {
      search_req.search_space = search_space;
    }

    const { error: matchError, data: documentChunks } = await supabase.rpc(
      'match_document_chunks',
      // @ts-ignore
      search_req
    );

    if (matchError) {
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

    const iterator = contentByDocument.keys();
    for (const documentName of iterator) {
      const documentContent = contentByDocument.get(documentName);
      if (!documentContent || documentContent.length === 0) continue;

      // Track whether we have reached token limit
      let reachedTokenLimit = false;

      // Count tokens after each piece of content is added
      for (let i = 0; i < documentContent.length; i++) {
        const piece = documentContent[i];
        const encoded = tokenizer.encode(piece);
        tokenCount += encoded.text.length;

        if (tokenCount >= 1500) {
          reachedTokenLimit = true;
          break;
        } else {
          // Append source key to first piece of content
          if (i === 0)
            contextText += `Source key: \`${sourceKey}\`\n ` + `Content:\n\``;
          contextText += `${piece}\n`;
        }
      }

      // Stop adding context if we have reached token limit
      if (reachedTokenLimit) break;
    }

    await init((imports) => WebAssembly.instantiate(wasm, imports));
    const encoding = new Tiktoken(
      tiktokenModel.bpe_ranks,
      tiktokenModel.special_tokens,
      tiktokenModel.pat_str
    );

    // Use default prompt as a fallback
    let prompt = defaultPrompt;
    // Try to fetch prompts from database
    try {
      let prompts = await fetchPrompts(supabase);
      let requestedPrompt = prompts.find((p) => p.id === promptId) as Prompt;
      if (requestedPrompt) prompt = requestedPrompt;
    } catch (error: any) {
      console.error(
        'Failed to fetch prompts withe following error message:',
        error.message
      );
    }
    // Default prompt content
    let promptToSend = formatPrompt(
      prompt && prompt.content ? prompt.content : defaultPrompt.content!,
      contextText
    );

    let messagesToSend: Message[] = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = {
        role: messages[i].role,
        content: messages[i].content,
        index: i
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
      messagesToSend
      // sources
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
