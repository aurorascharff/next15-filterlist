import './globals.css';

import { Geist } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense } from 'react';
import CategoryFilter, { CategoryFilterSkeleton } from '@/components/CategoryFilter';
import LoadTime from '@/components/LoadTime';
import ProjectInfo, { ProjectInfoSkeleton } from '@/components/ProjectInfo';
import Search, { SearchSkeleton } from '@/components/Search';
import StatusTabs, { StatusTabsSkeleton } from '@/components/StatusTabs';
import { getCategoriesMap } from '@/data/services/category';
import { getTaskSummary } from '@/data/services/task';
import { cn } from '@/utils/cn';
import type { Metadata } from 'next';

const GeistSans = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  description: 'Next.js 15 filtering list example using modern React features',
  title: 'Next.js 15 Filter List',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = getCategoriesMap();
  const taskSummary = getTaskSummary();

  return (
    <html lang="en">
      <body className={cn(GeistSans.className, 'flex flex-col px-4 py-6 sm:px-16 sm:py-16 xl:px-48 2xl:px-96')}>
        <NuqsAdapter>
          <div className="group flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <h1>Project information</h1>
              <Suspense fallback={<ProjectInfoSkeleton />}>
                <ProjectInfo />
              </Suspense>
            </div>
            <div className="flex flex-col gap-6">
              <h2>Task list</h2>
              <Suspense fallback={<StatusTabsSkeleton />}>
                <StatusTabs taskSummaryPromise={taskSummary} />
              </Suspense>
            </div>
            <div className="h-[1px] bg-primary" />
            <Suspense>
              <Suspense fallback={<SearchSkeleton />}>
                <Search />
              </Suspense>
              <Suspense fallback={<CategoryFilterSkeleton />}>
                <CategoryFilter categoriesPromise={categories} />
              </Suspense>
            </Suspense>
            {children}
          </div>
          <LoadTime />
        </NuqsAdapter>
      </body>
    </html>
  );
}
