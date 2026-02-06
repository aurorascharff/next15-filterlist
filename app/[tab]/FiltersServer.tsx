import type { TaskStatus } from '@/types/task';
import { slow } from '@/utils/slow';

// Pretend filter options that vary based on category
const filterOptionsByCategory: Record<string, string[]> = {
  '1': ['High Priority', 'Medium Priority', 'Low Priority'],
  '2': ['This Week', 'This Month', 'This Quarter'],
  '3': ['Assigned to Me', 'Unassigned', 'Team Tasks'],
  '4': ['Blocked', 'On Track', 'At Risk'],
  default: ['All', 'Recent', 'Favorites'],
};

async function getFilterOptions(categories: string[]): Promise<string[]> {
  await slow(4000);

  return categories.length > 0
    ? Array.from(
        new Set(
          categories.flatMap(cat => {
            return filterOptionsByCategory[cat] || filterOptionsByCategory.default;
          }),
        ),
      )
    : filterOptionsByCategory.default;
}

export default async function Filters({ category }: { tab: TaskStatus; q?: string; category?: string | string[] }) {
  const categories = Array.isArray(category) ? category : category ? [category] : [];
  const options = await getFilterOptions(categories);

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
