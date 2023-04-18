import { createClient } from '@supabase/supabase-js';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { NextApiHandler } from 'next';

// OpenAIApi does currently not work in Vercel Edge Functions as it uses Axios under the hood.
// export const config = {
//   runtime: 'edge'
// };

const openAIApiKey = process.env.OPENAI_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const VectorSearch: NextApiHandler = async (req, res) => {
  if (!openAIApiKey)
    throw new Error('Missing environment variable OPENAI_API_KEY');
  if (!supabaseUrl)
    throw new Error('Missing environment variable SUPABASE_URL');
  if (!supabaseServiceKey)
    throw new Error('Missing environment variable SUPABASE_SERVICE_ROLE_KEY');

  try {
    const { query, jwt } = req.body;
    if (!jwt) throw new Error('Missing access token in request data');
    if (!query) throw new Error('Missing query in request data');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      data: { user }
    } = await supabase.auth.getUser(jwt);
    if (!user)
      return res.status(401).json({
        error: 'not_authenticated',
        description:
          'The user does not have an active session or is not authenticated'
      });

    console.log(user);

    const sanitizedQuery = query.trim();

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

    const { error: matchError, data: documentChunks } = await supabase.rpc(
      'match_document_chunks',
      {
        embedding,
        match_count: 10,
        match_threshold: 0.78,
        min_content_length: 50
      }
    );

    console.log(matchError);
    console.log(documentChunks);

    if (matchError) {
      console.error(matchError);
      throw new Error('Failed to match document chunks');
    }

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
    let tokenCount = 0;
    let contextText = '';

    for (let i = 0; i < documentChunks.length; i++) {
      const documentChunk = documentChunks[i];
      const content = documentChunk.content;
      const encoded = tokenizer.encode(content);
      tokenCount += encoded.text.length;

      if (tokenCount >= 1500) break;

      contextText += `${content.trim()}\n---\n`;
    }

    return res.status(200).json({
      contextText
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({
        error: err.message
      });
    } else {
      // Print out unexpected errors as is to help with debugging
      console.error(err);
      return res.status(500).json({
        error: 'There was an error processing your request'
      });
    }
  }
};

export default VectorSearch;
