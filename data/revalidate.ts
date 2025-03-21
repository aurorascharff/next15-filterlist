'use server';

import { revalidateTag } from 'next/cache';

export async function reval() {
  revalidateTag('cached-content');
}
