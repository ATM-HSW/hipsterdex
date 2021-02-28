import React from 'react';
import { useTranslation } from 'next-i18next';

import { useCustomPokeData } from '../lib/useCustomPokeData';

export function CaughtFavBar({ pokemon }) {
  const { t } = useTranslation();

  /**
   * We can access the context from anywhere in our app, giving us easy access to the database functionality provided
   * by the `AppContextWrapper`.
   */
  const {
    caught,
    favorited,
    togglePokemonCaught,
    togglePokemonFavorited,
  } = useCustomPokeData(pokemon.dex);

  return (
    <div className="flex mr-2">
      <label htmlFor="cb-caught" className="flex">
        <input
          id="cb-caught"
          className="inline-block"
          value={pokemon.dex}
          type="checkbox"
          checked={caught}
          onChange={togglePokemonCaught}
          title="Caught"
        />
        <span className="inline-block text-xs ml-1 mt-1">{t('Caught')}</span>
      </label>

      <div className="flex ml-2">
        <label htmlFor="cb-favorite" className="">
          <input
            id="cb-favorite"
            className="inline-block"
            type="checkbox"
            value={pokemon.dex}
            checked={favorited}
            onChange={togglePokemonFavorited}
            title="Favorite"
          />
          <span className="inline-block text-xs ml-1 mt-1">
            {t('Favorite')}
          </span>
        </label>
      </div>
    </div>
  );
}
