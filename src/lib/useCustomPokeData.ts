import { useAppContext } from '../context/AppContext';

/**
 * A React hook to capsulate the functionality around our custom data provided by our AppContext.
 */
export function useCustomPokeData(id: number) {
  const ctx = useAppContext();
  return {
    ability: null,
    caught: ctx.pokemonsCaught.includes(id),
    favorited: ctx.pokemonsFavorited.includes(id),
    togglePokemonCaught: () => ctx.togglePokemonCaught(id),
    togglePokemonFavorited: () => ctx.togglePokemonFavorited(id),
    getSelectedAbility: () => ctx.getSelectedAbility(id),
    setSelectedAbility: (ability: string) =>
      ctx.setSelectedAbility(id, ability),
  };
}
