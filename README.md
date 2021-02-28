# Hipsterdex 3000
A Pokedex built with the hippest web stack around (the ["JAM stack"](https://jamstack.org/)). Specifically, we're using
[Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/) and [Supabase](https://app.supabase.io/).

# Get Started
```
npm install

npm run dev
```
**The environment variables `SUPABASE_URL` and `SUPABASE_KEY` need to be set for the app to function properly. You can
set them, for example, via a .env file in the root directory.**

# Walkthrough
Code comments can be found in all the interesting parts of the code base, explaining what is going on. Additionally, the
following high-level concepts are being implemented in this app and are being explained here separately.


## Next.js: Hybrid Static & Server Side Rendering
[Next.js](https://nextjs.org/) is a framework that provides "the best developer experience" (their words) for setting up
a modern, minimal, statically or server side rendered app. It builds an abstraction layer on top of
[React](https://reactjs.org/), one of the modern standards in web development and provides a set of opinionated defaults
and a compiler/bundler that provides the developer the tools to apply modern best practices "out of the box".

It is a product of [Vercel](https://vercel.com/), a platform for deploying hybrid apps, providing a tightly integrated
deployment pipe for Next.js apps.

## Api Routes: Serverless Functions
An interesting concept realised in this app are [serverless functions](https://en.wikipedia.org/wiki/Serverless_computing).
These are async functions that act as the "backend" to our app. They might be used to query external data, interact with
the filesystem or any number of different use cases. In any case, they provide our app with a backend that we can query,
*hydrating our statically rendered pages with dynamic data*.

## Supabase: Serverless Database
Speaking of serverless: One very interesting concept that comes with this paradigm are *serverless databases*, in our
case provided by [Supabase](https://app.supabase.io/). These make it possible to "create a backend in less than 2 minutes."
Indeed, it is quite easy to set up a database for our app that doesn't have a dedicated backend it comes with.
We use it to save some "custom" pokemon data like if the user has caught a certain pokemon, if it's a favourite or which
ability is currently selected.

An example and explanation of this can be found in `pages/api/list.ts`:
```typescript
/**
 * Any file inside the /pages/api folder will be configured as an api endpoint, reachable at [api_url]/api/[filename].
 * In here, we define a serverless function to act as a "backend" to our app, connecting to our database which is being
 * hosted on supabase.io.
 * https://en.wikipedia.org/wiki/Serverless_computing
 * https://nextjs.org/docs/api-routes/introduction
 * https://github.com/supabase/supabase-js
 */
export default async function handler(...) {...}
```

The `CaughtFavBar` component, for example, uses the database to toggle if a pokemon is caught or a favourite via our custom
`useCustomPokeData` which exposes the database functionality defined in `components/AppContextWrapper`.
```typescript
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
    </div>
  );
}
```


## API Calls With SWR
We can also query data from external sources directly from within our components. In our app, we use the
[SWR](https://swr.vercel.app/) library to do just that. It provides us with a React hook that abstracts away all
cumbersome caching functionality and allows us to query external data easily and use it directly, minimising network
traffic. A simple example can be found in `components/PokeDetailsExternal.tsx`:
```typescript
/**
 * SWR provides us with a hook that greatly simplifies fetching external data. Caching is included out of the box.
 * (SWR = stale-while-revalidate caching invalidation strategy)
 */
const fetcher = (url: string) => fetch(url).then((res) => res.json());
const { data, error } = useSWR(externalUri, fetcher);
```
With it, we're querying the [https://pokeapi.co/](https://pokeapi.co/) to get some additional data for our pokemons.

A more complex pattern is implemented in `components/AppContext.tsx` where we use SWR's `mutate` helper to implement the
optimistic updates pattern, where we apply changes to the locally held data immediately to provide instant feedback to
the user and then apply the actual updates to the database in the background. When the database responds with the actual
update, we only compare the result with our optimistic expectations. In the success case the user will never experience
any delay, only in the error case we would have to roll back the updates we did optimistically.
```typescript
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
```
## Global State via React Context
There are a lot of ways to handle global state in a React app. For more advanced use cases one would probably use
something like [Redux](https://redux.js.org/), for our simple use case, though, the built in
[React Context API](https://reactjs.org/docs/context.html) provides us with a simple and easy way to expose global state
to our app. We're using context to make our custom pokemon data available which we are fetching from the database. The
`AppContext` defined in `context/AppContext` serves as the central "command center" to interact with our database:
```typescript
/**
 * We use the React Context API to as a simple way of keeping global state for our app. Here, we're querying our
 * database via our "backend" api route to get the IDs of the pokemons already caught. This data will be exposed to all
 * our app, easily accessible via the `useContext` hook.
 * We're using an SWR hook to query our api route, see also /components/PokeDetailsExternal.tsx.
 * https://reactjs.org/docs/context.html
 * https://swr.vercel.app/
 */
export const AppContextWrapper: React.FC = ({ children }) => {...}
```

Another example can be found in `context/FilterContext` where we keep the currently active filters in a central spot so
any component can access it easily. This is especially handy if many components are working with the same data and avoids
the so-called "props drilling". For example, the `FilterContext` is being used in `components/FilterBox.tsx`,
`components/TypeChip.tsx` and `pages/index.tsx`.

## i18n
Next.js provides some i18n support out of the box. In addition to this, we're using the `next-i18next.js` and `i18next`
packages to implement full i18n functionality.

We are using the [sub-path routing strategy](https://nextjs.org/docs/advanced-features/i18n-routing#sub-path-routing),
where each sub-path can be prefixed with a locale abbreviation. Next.js will inject a `locale` prop into our pages,
which we can use to select the correct display strings.

After extracting display strings (marked by the `t()` function) to `/public/locales/lANGUAGE`, we can use the
`useTranslation` hook, to access our translations in a component.

An example of this can be seen in `pages/[id].tsx` where [`serverSideTranslations`](https://github.com/isaachinman/next-i18next#serversidetranslations)
is being used to inject the available translations. On line 71, we're using the locale provided by Next.js to select
the correct pokemon name and further down on line 99 we're using the `t()` function to translate the "Family" string.

## Tailwind: Utility CSS
For styling our app, we use [Tailwind](https://tailwindcss.com/), a quite modern way of using CSS via utiliy classes.
Instead of giving semantic class names to elements like "type-chip" and possibly running into the problem of conflicting
CSS rules, Tailwind provides a set of utility classes that are being used as a sort of modifier and can be combined for
more complex styling. For example, our `TypeChip.tsx` is defined as follows (using template strings for dynamic colouring):
```
<div
    className={`border rounded-full text-sm py-1 px-2 bg-${bgColor}-200 ${cursor}`}
    id={type}
    onClick={clickable ? handleClickType : undefined}
>
    {type}
</div>
```
