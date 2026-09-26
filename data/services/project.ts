import 'server-only';

import { prisma } from '@/db';
import { slow } from '@/utils/slow';

export async function getProject() {
  console.log('getProject');

  await slow(500);

  const project = await prisma.project.findFirst({
    include: {
      teamMembers: true,
    },
  });

  if (!project) {
    throw new Error('Project not found, run seed script');
  }

  return {
    ...project,
    teamMembers: project.teamMembers.reduce(
      (acc, member) => {
        if (!acc[member.role]) {
          acc[member.role] = { count: 0, members: [] };
        }
        acc[member.role].count += 1;
        acc[member.role].members.push(member);
        return acc;
      },
      {} as Record<string, { count: number; members: typeof project.teamMembers }>,
    ),
  };
}
