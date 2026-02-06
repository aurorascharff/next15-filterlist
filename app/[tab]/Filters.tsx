'use client';

import useSWR from 'swr';
import type { TaskStatus } from '@/types/task';

const fetcher = (url: string) => {
  return fetch(url).then(res => {
    return res.json();
  });
};

export default function Filters({ category }: { tab: TaskStatus; q?: string; category?: string | string[] }) {
  const categories = Array.isArray(category) ? category : category ? [category] : [];
  const searchParams = new URLSearchParams();
  categories.forEach(c => {
    return searchParams.append('category', c);
  });
  const { data, isLoading } = useSWR<{ options: string[] }>(`/api/filters?${searchParams.toString()}`, fetcher);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold uppercase">
        Options for {categories.length > 0 ? `categories ${categories.join(', ')}` : 'all'}
      </label>
      {isLoading ? (
        <div className="w-fit rounded border border-gray px-4 py-2 opacity-50">Loading...</div>
      ) : (
        <div className="flex gap-2">
          {data?.options.map(option => {
            return (
              <button key={option} className="rounded border border-gray px-4 py-2 hover:bg-gray-100">
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
