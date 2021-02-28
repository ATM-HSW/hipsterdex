import React from 'react';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';

import { AppContextWrapper } from '../context/AppContext';
import { FilterContextWrapper } from '../context/FilterContext';

import '../styles/global.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextWrapper>
      <FilterContextWrapper>
        <Component {...pageProps} />
      </FilterContextWrapper>
    </AppContextWrapper>
  );
}

// We inject i18n functionality via an HOC provided by next-i18next
// https://github.com/isaachinman/next-i18next
export default appWithTranslation(App);
