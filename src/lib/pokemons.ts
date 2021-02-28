import fs from 'fs';
import path from 'path';

import { Pokemon, Type } from '../data/types';

const fileName = 'pokemons.json';
const srcFile = path.join(process.cwd(), 'src', 'data', fileName);

export function getAllPokemons(): Pokemon[] {
  const json = fs.readFileSync(srcFile, 'utf8');
  const res = JSON.parse(json);
  return res;
}

export function getSinglePokemon(id: string) {
  const pokemons = getAllPokemons();
  const res = pokemons.find(
    (pokemon) => pokemon.dex == Number.parseInt(id, 10)
  );
  return res;
}

export function getAllTypes(): Type[] {
  const set = new Set<Type>();
  getAllPokemons().forEach((pokemon) => {
    pokemon.types.forEach((type) => set.add(type));
  });
  return Array.from(set);
}
