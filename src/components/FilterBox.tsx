import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';

import { FilterContext } from '../context/FilterContext';

import { TypeChip } from './TypeChip';

export function FilterBox({ types }) {
  const { t } = useTranslation();
  const { filterString, updateFilterString } = useContext(FilterContext);

  return (
    <section className="border rounded-md bg-white mb-4 p-4 space-y-4">
      <input
        className="border rounded-md p-4 w-full"
        value={filterString}
        placeholder={t('Filter by ID, name or family...')}
        onChange={updateFilterString}
      />

      <div className="flex flex-row flex-wrap space-x-2 space-y-1">
        {types.map((type) => {
          return <TypeChip clickable key={type} type={type} />;
        })}
      </div>
    </section>
  );
}
