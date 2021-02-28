import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Pokemon } from '../data/types';
import { useCustomPokeData } from '../lib/useCustomPokeData';

import { CaughtFavBar } from './CaughtFavBar';

type Props = {
  pokemon: Pokemon;
};

export function PokeCard({ pokemon }: Props) {
  const { locale } = useRouter();

  const name = pokemon.name[locale];

  const fullId = String(pokemon.dex).padStart(3, '0');
  const imgSrc = `/images/pokemon_icon_${fullId}_00.png`;

  const { caught } = useCustomPokeData(pokemon.dex);

  const picSize = 120;

  const color = caught ? 'green' : 'gray';
  const h4Color = caught ? `text-${color}-500` : `text-${color}-600`;
  const hoverColor = caught ? 'green' : 'blue';
  const border = `${
    caught ? 'border-2' : 'border'
  } border-${color}-400 rounded-md`;

  return (
    <div
      key={pokemon.dex}
      className={`container bg-white inline-block px-0 ${border} hover:text-${hoverColor}-400 hover:bg-${color}-50 hover:border-${hoverColor}-400 flex flex-col`}
    >
      <div className="flex flex-row justify-end">
        <CaughtFavBar pokemon={pokemon} />
      </div>
      <Link href={`/pokemons/${pokemon.dex}`}>
        <div className="flex flex-row cursor-pointer">
          <div className="flex-grow-0 flex-shrink-0 w-200">
            <img
              alt={`${name} profile picture`}
              width={picSize}
              height={picSize}
              src={imgSrc}
            />
          </div>
          <div className="w-full">
            <h4 className={`text-xl ${h4Color}`}>{name}</h4>
            <p className="text-gray-400">{pokemon.family}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
