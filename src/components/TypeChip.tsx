import React, { useContext } from 'react';
import { FilterContext } from '../context/FilterContext';

import { Type } from '../data/types';

export function TypeChip({ clickable = false, type }) {
  const { filterObj, toggleType } = useContext(FilterContext);

  const active = filterObj.types.includes(type);

  const handleClickType = (evt: React.SyntheticEvent<HTMLDivElement>) => {
    toggleType(evt.currentTarget.id as Type);
  };

  const bgColor = clickable && active ? 'green' : 'gray';
  const cursor = clickable ? 'cursor-pointer' : '';

  return (
    <div
      className={`border rounded-full text-sm py-1 px-2 bg-${bgColor}-200 ${cursor}`}
      id={type}
      onClick={clickable ? handleClickType : undefined}
    >
      {type}
    </div>
  );
}
