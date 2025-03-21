'use client';

import Form from 'next/form';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useTransition } from 'react';
import type { TaskStatus } from '@/types/task';
import SearchStatus from './ui/SearchStatus';

export default function Search() {
  const router = useRouter();
  const params = useParams();
  const activeTab = params.tab as TaskStatus;
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [isPending, startTransition] = useTransition();

  return (
    <Form action="" className="relative flex w-full flex-col gap-1 sm:w-fit" key={activeTab}>
      <label className="font-semibold uppercase" htmlFor="search">
        Search
      </label>
      <input
        autoComplete="off"
        id="search"
        onChange={e => {
          const newSearchParams = new URLSearchParams(searchParams.toString());
          newSearchParams.set('q', e.target.value);
          startTransition(() => {
            router.push(`?${newSearchParams.toString()}`, {
              scroll: false,
            });
          });
        }}
        defaultValue={q}
        className="w-full pl-10 sm:w-96"
        name="q"
        placeholder="Search in task title or description..."
        type="search"
      />
      <SearchStatus searching={isPending} />
    </Form>
  );
}

export function SearchSkeleton() {
  return <input className="mt-7 w-full sm:w-96" placeholder="Loading..." disabled />;
}
