import { NextResponse } from 'next/server';
import { getDynamicOptions } from '@/data/services/dynamicOptions';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categories = searchParams.getAll('category');

  console.log('GET /api/filters', { categories });

  const options = await getDynamicOptions(categories);

  return NextResponse.json({ options });
}
