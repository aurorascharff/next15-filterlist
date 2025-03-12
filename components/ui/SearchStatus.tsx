'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { SearchIcon } from './icons/SearchIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

export default function SearchStatus({ searching }: { searching?: boolean }) {
  const { pending } = useFormStatus();
  const isSearching = searching || pending;

  return (
    <div className="absolute left-4 top-[41px]">
      {isSearching ? (
        <div aria-label="searching..." className="h-fit w-fit animate-spin">
          <SpinnerIcon aria-hidden="true" width={16} height={16} className="text-gray" />
        </div>
      ) : (
        <SearchIcon aria-hidden="true" width={16} height={16} className="text-gray" />
      )}
    </div>
  );
}
