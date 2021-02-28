import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

import { DbPokemon } from './types';

/**
 * Any file inside the /pages/api folder will be configured as an api endpoint, reachable at [api_url]/api/[filename].
 * In here, we define a serverless function to act as a "backend" to our app, connecting to our database which is being
 * hosted on supabase.io.
 * https://en.wikipedia.org/wiki/Serverless_computing
 * https://nextjs.org/docs/api-routes/introduction
 * https://github.com/supabase/supabase-js
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { SUPABASE_URL, SUPABASE_KEY } = process.env;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Using the JS library provided by supabase, we can execute SQL queries conveniently.
  const { data: pokemons, error } = await supabase
    .from<DbPokemon>('pokemons')
    .select('*');

  if (error) {
    console.error(error);
    return res.status(500);
  }

  return res.status(200).json({ pokemons });
}
