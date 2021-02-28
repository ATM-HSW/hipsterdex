import React, { useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Pokemon } from '../../data/types';
import { getAllPokemons, getSinglePokemon } from '../../lib/pokemons';

import { Layout } from '../../components/Layout';
import { PokeDetailsExternal } from '../../components/PokeDetailsExternal';

import { CaughtFavBar } from '../../components/CaughtFavBar';
import { TypeChip } from '../../components/TypeChip';
import { useCustomPokeData } from '../../lib/useCustomPokeData';

/**
 * Next.js uses `getStaticPaths` to pre-render a page for each path we are returning. We may pass in arbitrary data to
 * each path which the rendered copmonent will receive as props.
 * We use our helper function `getAllPokemons` to get the dex number we want to pass as the `id` param. Using the
 * `locales` argument provided by Next.js, we can then create a path for each pokemon in each locale.
 */
export async function getStaticPaths({ locales }) {
  const paths = [];

  getAllPokemons().map((pokemon) => {
    locales.forEach((locale) => {
      paths.push({
        params: { id: String(pokemon.dex) },
        locale: locale,
      });
    });
  });

  return {
    paths,
    fallback: false,
  };
}

/**
 * Using `getStaticProps`, we can define which props should be passed to our component below. Each path defined by
 * `getStaticPaths will be passed as input to this function.
 * We use our own helper function `getSinglePokemon` to get the data for a single pokemon from /data/pokemons.json.
 * We use next-i18next's `serverSideTranslations` to get the translations we have definedn in /public/locales.
 */
export async function getStaticProps({ locale, params }) {
  const translations = await serverSideTranslations(locale);

  const pokemon = getSinglePokemon(params.id);

  return {
    props: {
      locale,
      pokemon,
      ...translations,
    },
  };
}

/**
 * Lastly, Next.js will inject the result of `getStaticProps` as props into our React component. We now have `locale`
 * and `pokemon` available as data inside our component.
 */
export default function FactSheet({
  locale,
  pokemon,
}: {
  locale: string;
  pokemon: Pokemon;
}) {
  const name = pokemon.name[locale];
  const { caught } = useCustomPokeData(pokemon.dex);

  const { t } = useTranslation();

  const [detailsVisible, setDetailsVisible] = useState(true);
  const toggleDetails = () => setDetailsVisible(!detailsVisible);
  const showHide = detailsVisible ? t('Hide') : t('Show');

  const picSize = 160;
  const fullId = String(pokemon.dex).padStart(3, '0');
  const imgSrc = `/images/pokemon_icon_${fullId}_00.png`;
  const shinySrc = `/images/pokemon_icon_${fullId}_00_shiny.png`;

  const color = caught ? 'green' : 'gray';
  const h1Color = caught ? `text-${color}-500` : `text-${color}-600`;

  return (
    <Layout>
      <Head>
        <title>{name}</title>
      </Head>

      <article className="border border-2 rounded-md bg-white p-4">
        <div></div>
        <div className="space-y-4">
          <h1 className={`text-4xl ${h1Color}`}>{name}</h1>
          <h4>
            {t('Family')}: {pokemon.family}
          </h4>
          <CaughtFavBar pokemon={pokemon} />

          <div className="flex flex-row flex-wrap space-x-2 space-y-1">
            {pokemon.types.map((type) => {
              return <TypeChip key={type} type={type} />;
            })}
          </div>

          <div className="flex flex-row space-x-4">
            <img
              alt={`${name} profile picture`}
              className="border border-blue-400 rounded-md"
              width={picSize}
              height={picSize}
              src={imgSrc}
            />
            <img
              alt={`${name} shiny profile picture`}
              className="border border-blue-400 rounded-md"
              width={picSize}
              height={picSize}
              src={shinySrc}
            />
          </div>

          <div className="mt-8">
            <a href="#" onClick={toggleDetails}>
              {`${showHide} ${t('details')}`}
            </a>

            {detailsVisible && <PokeDetailsExternal pokemon={pokemon} />}
          </div>
        </div>
      </article>
    </Layout>
  );
}
