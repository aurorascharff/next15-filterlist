'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (url: string) => {
  return fetch(url).then(res => {
    return res.json();
  });
};

export default function Filters() {
  const searchParams = useSearchParams();
  const categories = searchParams.getAll('category');
  const params = new URLSearchParams();
  categories.forEach(c => {
    return params.append('category', c);
  });
  const { data, isLoading } = useSWR<{ options: string[] }>(`/api/filters?${params.toString()}`, fetcher);

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
