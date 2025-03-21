'use server';

import { revalidateTag } from 'next/cache';
import { prisma } from '@/db';

export async function reval() {
  // update database
  await prisma.project.update({
    data: {
      companyName: 'Company Y',
    },
    where: { id: 'b3876ae0-bdbf-4c04-8230-85d3a6da15e9' },
  });

  revalidateTag('cached-content');
}
