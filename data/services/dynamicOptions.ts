import { slow } from '@/utils/slow';

// Dynamic options that vary based on category
const dynamicOptionsByCategory: Record<string, string[]> = {
  '1': ['High Priority', 'Medium Priority', 'Low Priority'],
  '2': ['This Week', 'This Month', 'This Quarter'],
  '3': ['Assigned to Me', 'Unassigned', 'Team Tasks'],
  '4': ['Blocked', 'On Track', 'At Risk'],
  default: ['All', 'Recent', 'Favorites'],
};

export async function getDynamicOptions(categories: string[]): Promise<string[]> {
  await slow(2000);

  return categories.length > 0
    ? Array.from(
        new Set(
          categories.flatMap(cat => {
            return dynamicOptionsByCategory[cat] || dynamicOptionsByCategory.default;
          }),
        ),
      )
    : dynamicOptionsByCategory.default;
}
