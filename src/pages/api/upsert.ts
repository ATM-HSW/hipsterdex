import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

import { DbPokemon } from './types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { SUPABASE_URL, SUPABASE_KEY } = process.env;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { body } = req;

  const { data, error } = await supabase
    .from<DbPokemon>('pokemons')
    .insert([JSON.parse(body)], { upsert: true });

  if (error) {
    console.error(error);
    return res.status(500);
  }

  return res.status(200).json(data[0]);
}
