import React from 'react';
import useSWR from 'swr';
import { useTranslation } from 'next-i18next';

import { Pokemon } from '../data/types';
import { useCustomPokeData } from '../lib/useCustomPokeData';

export function PokeDetailsExternal({ pokemon }: { pokemon: Pokemon }) {
  const { t } = useTranslation();

  const externalUri = `https://pokeapi.co/api/v2/pokemon/${pokemon.name.en.toLowerCase()}`;

  /**
   * SWR provides us with a hook that greatly simplifies fetching external data. Caching is included out of the box.
   * (SWR = stale-while-revalidate caching invalidation strategy)
   * https://swr.vercel.app/
   */
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(externalUri, fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const { abilities, sprites } = data;

  return (
    <div className="rounded-md border border-blue-400 bg-blue-50 p-4">
      <h2>Details</h2>
      <p className="text-xs text-gray-500">
        {t('External data from')} https://pokeapi.co/
      </p>
      <div className="grid grid-row-3 grid-flow-col flex gap-4">
        <div className="row-span-2 flex-grow-0">
          <img
            alt="pokemon-profile"
            width="150"
            height="150"
            src={`${sprites.front_default}`}
          />
        </div>
        <AbilitiesBox pokemon={pokemon} abilities={abilities} />
      </div>
    </div>
  );
}

export function AbilitiesBox({ pokemon, abilities }) {
  const { t } = useTranslation();

  const selectAbility = (ability: string) => {
    console.log('GOT', ability);
    setSelectedAbility(ability);
  };

  const { getSelectedAbility, setSelectedAbility } = useCustomPokeData(
    pokemon.dex
  );

  return (
    <>
      <h4 className="text-lg">{t('Abilities')}</h4>
      <div className="border rounded-md mb-4 p-4 space-y-4">
        {abilities.map((ability) => {
          const abilityName = ability.ability.name;
          const selected = abilityName === getSelectedAbility();

          const chipColor = selected ? 'pink-200' : 'white';
          return (
            <div
              key={abilityName}
              className={`border border-${chipColor} rounded-full py-1 pl-8 bg-${chipColor} cursor-pointer`}
              id={abilityName}
              onClick={() => selectAbility(abilityName)}
            >
              {abilityName}
            </div>
          );
        })}
      </div>
    </>
  );
}
