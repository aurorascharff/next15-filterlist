import 'server-only';

import { connection } from 'next/server';
import { prisma } from '@/db';
import type { TaskStatus, TaskSummary } from '@/types/task';
import { slow } from '@/utils/slow';
import { getCategoriesMap } from './category';

export async function getTasks(filter?: { q?: string; status?: TaskStatus; categories?: number[] }) {
  console.log('getTasks', filter);

  await connection();
  await slow(2000);

  return prisma.task.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      AND: [
        filter?.q
          ? {
              OR: [{ title: { contains: filter.q } }, { description: { contains: filter.q } }],
            }
          : {},
        filter?.status ? { status: filter.status } : {},
        filter?.categories && filter.categories.length > 0 ? { categoryId: { in: filter.categories } } : {},
      ],
    },
  });
}

export async function getTaskSummary(): Promise<TaskSummary> {
  console.log('getTaskSummary');

  await connection();
  await slow(1500);

  const categoriesMap = await getCategoriesMap();

  const groupedTasks = await prisma.task.groupBy({
    _count: {
      id: true,
    },
    by: ['status', 'categoryId'],
  });

  return groupedTasks.reduce((acc, task) => {
    const status = task.status as TaskStatus;
    const category = categoriesMap[task.categoryId];

    if (!acc[status]) {
      acc[status] = {};
    }

    if (!acc[status][category.id]) {
      acc[status][category.id] = {
        count: task._count.id,
        name: category.name,
      };
    }

    return acc;
  }, {} as TaskSummary);
}
