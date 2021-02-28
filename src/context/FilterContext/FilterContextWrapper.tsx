import React, { useState } from 'react';
import { Type } from '../../data/types';

type PokeFilter = {
  family?: string;
  types: string[];
};

export type FilterContext = {
  filterObj: PokeFilter;
  filterString: string;
  updateFilterString: (evt: React.SyntheticEvent) => void;
  toggleType: (type: Type) => void;
};

const initialFilterObj = {
  family: '',
  types: [],
};

const initialFilterContext: FilterContext = {
  filterObj: initialFilterObj,
  filterString: '',
  updateFilterString: (_: React.SyntheticEvent) => undefined,
  toggleType: (_: Type) => undefined,
};

export const FilterContext = React.createContext<FilterContext>(
  initialFilterContext
);

export const FilterContextWrapper: React.FC = ({ children }) => {
  const [filterString, setFilterString] = useState('');

  const updateFilterString = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    console.log('handleFilterChange: ', evt.currentTarget.value);
    setFilterString(evt.currentTarget.value?.toLowerCase());
  };

  const [filterObj, setFilterObj] = useState<PokeFilter>(initialFilterObj);

  const toggleType = (type: Type) => {
    const { types } = filterObj;
    const idx = types.indexOf(type);
    let update;
    if (idx > -1) {
      update = [...types.slice(0, idx), ...types.slice(idx + 1)];
    } else {
      update = [...types, type];
    }
    setFilterObj({
      ...filterObj,
      types: update,
    });
  };

  return (
    <FilterContext.Provider
      value={{
        filterObj,
        filterString,
        updateFilterString,
        toggleType,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
