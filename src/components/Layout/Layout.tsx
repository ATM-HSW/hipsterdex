import React from 'react';
import { useTranslation } from 'next-i18next';

import Head from 'next/head';
import Link from 'next/link';

import utilStyles from '../../styles/utils.module.css';
import { useRouter } from 'next/router';

export const siteTitle = 'Hipsterdex 3000';
export const siteDescription =
  'A Pokedex built with the hippest web tech around.';

type Props = {
  children: React.ReactNode;
  home?: boolean;
};

export function Layout({ children, home }: Props) {
  const { t } = useTranslation();

  const route = useRouter();

  const maxWidth = home ? 'max-w-4xl' : 'max-w-4xl';

  return (
    <div className={`${maxWidth} my-3 mx-6 mx-auto`}>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="description" content={siteDescription} />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <header className="flex flex-col">
        <Link href="/">
          <a>
            <img
              src="/images/profile.png"
              className="w-24 h-24 rounded-full"
              alt="Profile picture"
            />
          </a>
        </Link>
        <h1 className={utilStyles.headingLg}>
          <Link href="/">
            <a className={utilStyles.colorInherit}>{siteTitle}</a>
          </Link>
        </h1>
        <div className="flex flex-row space-x-2 mb-4">
          <Link
            href={{ pathname: route.pathname, query: route.query }}
            locale="en"
          >
            {route.locale === 'en' ? (
              <span className="text-sm">EN</span>
            ) : (
              <a className="text-sm" title="Switch to English version">
                EN
              </a>
            )}
          </Link>
          <Link
            href={{ pathname: route.pathname, query: route.query }}
            locale="de"
          >
            {route.locale === 'de' ? (
              <span className="text-sm">DE</span>
            ) : (
              <a className="text-sm" title="Zur deutschen Version wechseln">
                DE
              </a>
            )}
          </Link>
        </div>
      </header>

      <main>{children}</main>

      {!home && (
        <div className="mt-3 bg-white rounded-md p-4">
          <Link href="/">
            <a>{t('Back to Home')}</a>
          </Link>
        </div>
      )}
    </div>
  );
}
