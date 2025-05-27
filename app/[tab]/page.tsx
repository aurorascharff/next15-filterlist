import { notFound } from 'next/navigation';
import React from 'react';
import { ActionIcon } from '@/components/ui/icons/ActionIcon';
import { getTasks } from '@/data/services/task';
import { taskStatusSchema, type TaskStatus } from '@/types/task';
import { cn } from '@/utils/cn';
import { getCategoryColor } from '@/utils/getCategoryColor';

type PageProps = {
  params: Promise<{
    tab: TaskStatus;
  }>;
  searchParams: Promise<{
    q?: string;
    category?: string | string[];
  }>;
};

export default async function TabPage({ params, searchParams }: PageProps) {
  const { tab } = await params;
  const { q, category } = await searchParams;

  try {
    taskStatusSchema.parse(tab);
  } catch {
    notFound();
  }

  const tasks = await getTasks({
    categories: Array.isArray(category) ? category.map(Number) : category ? [Number(category)] : undefined,
    q,
    status: tab,
  });

  return (
    <div className="overflow-x-auto rounded group-has-[[data-pending]]:animate-pulse">
      <table>
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Category</th>
            <th scope="col">Created Date</th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const color = getCategoryColor(task.categoryId);
            return (
              <tr key={task.id}>
                <td className="font-medium">{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <div className={cn(color, 'flex w-fit justify-center px-3 py-1 text-white dark:text-black')}>
                    {task.category.name}
                  </div>
                </td>
                <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                <td>
                  <button aria-label="Options">
                    <ActionIcon aria-hidden="true" width={20} height={20} />
                  </button>
                </td>
              </tr>
            );
          })}
          {tasks.length === 0 && (
            <tr>
              <td className="italic" colSpan={5}>
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
