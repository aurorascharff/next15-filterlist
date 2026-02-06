import { getDynamicOptions } from '@/data/services/dynamicOptions';
import type { TaskStatus } from '@/types/task';

export default async function Filters({ category }: { tab: TaskStatus; q?: string; category?: string | string[] }) {
  const categories = Array.isArray(category) ? category : category ? [category] : [];
  const options = await getDynamicOptions(categories);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold uppercase">
        Options for {categories.length > 0 ? `categories ${categories.join(', ')}` : 'all'}
      </label>
      <div className="flex gap-2">
        {options.map(option => {
          return (
            <button key={option} className="rounded border border-gray px-4 py-2 hover:bg-gray-100">
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
