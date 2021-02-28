import React, { useContext } from 'react';
import useSWR, { mutate } from 'swr';

import { DbPokemon } from '../../pages/api/types';

type AppContextType = {
  pokemonsCaught: number[];
  pokemonsFavorited: number[];
  togglePokemonCaught: (_id: number) => void;
  togglePokemonFavorited: (_id: number) => void;
  getSelectedAbility: (_id: number) => string | undefined;
  setSelectedAbility: (_id: number, ability: string) => void;
};

const initialAppContext = {
  pokemonsCaught: [],
  pokemonsFavorited: [],
  togglePokemonCaught: (_id: number) => undefined,
  togglePokemonFavorited: (_id: number) => undefined,
  getSelectedAbility: (_id: number) => undefined,
  setSelectedAbility: (_id: number, _ability: string) => undefined,
};

const AppContext = React.createContext<AppContextType>(initialAppContext);

/**
 * We use the React Context API to as a simple way of keeping global state for our app. Here, we're querying our
 * database via our "backend" api route to get the IDs of the pokemons already caught. This data will be exposed to all
 * our app, easily accessible via the `useContext` hook.
 * We're using an SWR hook to query our api route, see also /components/PokeDetailsExternal.tsx.
 * https://reactjs.org/docs/context.html
 * https://swr.vercel.app/
 */
export const AppContextWrapper: React.FC = ({ children }) => {
  const apiRoute = `/api/list`;
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data } = useSWR<{ pokemons: DbPokemon[] }>(apiRoute, fetcher);

  const pokemonsCaught =
    data?.pokemons.map((pokemon) => pokemon.caught && pokemon.id) || [];

  const pokemonsFavorited =
    data?.pokemons.map((pokemon) => pokemon.favorite && pokemon.id) || [];

  const upsertPokemon = async (update) => {
    return fetch('/api/upsert', {
      method: 'POST',
      body: JSON.stringify(update),
    })
      .then((res) => res.json())
      .catch((err) => console.error(err));
  };

  /**
   * We implement the optimistic updates pattern with SWR.
   */
  const mutatePokemon = async (id: number, patch: Partial<DbPokemon>) => {
    // 1. "Upsert" local data.
    let exists = false;
    const optimisticPokemons = data.pokemons.map((pokemon, idx) => {
      if (pokemon.id === id) {
        // If we find the pokemon, we apply the update.
        exists = true;
        return { ...pokemon, ...patch };
      } else if (idx === data.pokemons.length && !exists) {
        // If the pokemon doesn't exist in our custom data, we add it.
        return { id, ...patch };
      }

      // Anything else will not be updated.
      return pokemon;
    });

    mutate('/api/list', { pokemons: optimisticPokemons }, false);

    // 2. Do the actual update in the database.
    const apiResult = await upsertPokemon({ id, ...patch });
    const confirmedPokemons = data.pokemons.map((pokemon) =>
      pokemon.id === id ? apiResult : pokemon
    );

    // 3. Confirm the update if successful, roll back if not.
    mutate('/api/list', { pokemons: confirmedPokemons });
  };

  const togglePokemonCaught = async (id: number) => {
    const patch =
      pokemonsCaught.indexOf(id) > -1 ? { caught: false } : { caught: true };

    mutatePokemon(id, patch);
  };

  const togglePokemonFavorited = async (id: number) => {
    const patch =
      pokemonsFavorited.indexOf(id) > -1
        ? { favorite: false }
        : { favorite: true };

    mutatePokemon(id, patch);
  };

  const setSelectedAbility = (id: number, ability: string) => {
    mutatePokemon(id, { ability });
  };

  const getSelectedAbility = (id: number) => {
    console.log('AOI getSelectedAbility: ', id);
    const target = data?.pokemons.find((pokemon) => pokemon.id === id);
    return target && target.ability;
  };

  return (
    <AppContext.Provider
      value={{
        ...initialAppContext,
        pokemonsCaught,
        pokemonsFavorited,
        getSelectedAbility,
        setSelectedAbility,
        togglePokemonCaught,
        togglePokemonFavorited,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}
