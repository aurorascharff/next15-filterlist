import Link from 'next/link';
import type { TaskStatus } from '@/types/task';
import { cn } from '@/utils/cn';

type Props = {
  href: string;
  tabId: TaskStatus;
  children: React.ReactNode;
  activeTab: string;
  header: string;
};

export default function NavTab({ href, children, activeTab, tabId, header }: Props) {
  return (
    <Link
      prefetch={true}
      scroll={false}
      className={cn(
        activeTab === tabId
          ? 'border-primary bg-primary-light dark:bg-neutral-800'
          : 'border-transparent bg-primary-lighter dark:bg-neutral-900',
        'flex w-full min-w-fit flex-col gap-3 border-b-4 p-3 outline-none outline-1 -outline-offset-2 hover:bg-primary-light focus:outline-gray-dark sm:gap-6 sm:p-6 dark:hover:bg-neutral-800 dark:focus:outline-gray-light',
      )}
      href={href}
    >
      <h3 className="text-lg font-semibold">{header}</h3>
      {children}
    </Link>
  );
}
