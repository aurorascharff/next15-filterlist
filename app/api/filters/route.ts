import { NextRequest, NextResponse } from 'next/server';
import { slow } from '@/utils/slow';

// Pretend filter options that vary based on category
const filterOptionsByCategory: Record<string, string[]> = {
  '1': ['High Priority', 'Medium Priority', 'Low Priority'],
  '2': ['This Week', 'This Month', 'This Quarter'],
  '3': ['Assigned to Me', 'Unassigned', 'Team Tasks'],
  '4': ['Blocked', 'On Track', 'At Risk'],
  default: ['All', 'Recent', 'Favorites'],
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categories = searchParams.getAll('category');

  console.log('GET /api/filters', { categories });

  await slow(1000);

  const options =
    categories.length > 0
      ? [...new Set(categories.flatMap(cat => filterOptionsByCategory[cat] || filterOptionsByCategory.default))]
      : filterOptionsByCategory.default;

  return NextResponse.json({ options });
}
