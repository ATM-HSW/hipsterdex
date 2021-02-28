import React, { useContext } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { Pokemon, Type } from '../data/types';
import { getAllPokemons, getAllTypes } from '../lib/pokemons';

import { Layout, siteTitle } from '../components/Layout';
import { PokeCard } from '../components/PokeCard';
import { FilterBox } from '../components/FilterBox';
import { FilterContext } from '../context/FilterContext';

export async function getStaticProps({ locale }) {
  const translations = await serverSideTranslations(locale);
  const pokemons = getAllPokemons();
  const types = getAllTypes();

  return {
    props: {
      locale,
      pokemons,
      types,
      ...translations,
    },
  };
}

export default function Home({
  locale,
  pokemons,
  types,
}: {
  locale: string;
  pokemons: Pokemon[];
  types: Type[];
}) {
  const { filterString, filterObj } = useContext(FilterContext);

  const filterByType = (pokemon: Pokemon) => {
    return filterObj.types.length
      ? pokemon.types.reduce((acc, type) => {
          return filterObj.types.includes(type) ? true : acc;
        }, false)
      : true;
  };

  const filterByString = (pokemon: Pokemon) => {
    return filterString
      ? String(pokemon.dex) === filterString ||
          pokemon.name[locale].toLowerCase().includes(filterString) ||
          pokemon.family.toLowerCase().includes(filterString)
      : true;
  };

  const filteredPokemons = pokemons.filter(filterByType).filter(filterByString);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <FilterBox types={types} />

      <section className="">
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredPokemons.map((pokemon, idx) => {
            return <PokeCard key={`${pokemon.dex}-${idx}`} pokemon={pokemon} />;
          })}
        </ul>
      </section>
    </Layout>
  );
}
