'use client';

import Link from 'next/link';
import React from 'react';
import { cn } from '@/utils/cn';

type ToggleOption = {
  label: string;
  value: string;
};

type Props = {
  options: ToggleOption[];
  selectedValues: string[];
  toggleKey?: string;
  onToggle: (_options: string[]) => void;
};

export default function ToggleGroup({ options, selectedValues, toggleKey, onToggle }: Props) {
  const inactiveClass =
    'dark:bg-black dark:text-white dark:outline-white outline-primary focus:outline-2 bg-white text-black hover:bg-gray-light hover:dark:bg-gray-dark';
  const activeClass = 'outline-white focus:outline focus:-outline-offset-4 hover:bg-primary-dark bg-primary text-white';

  /**
   * I'm using a link here to provide a fallback functionality while JS has not yet hydrated the anchor tags.
   * This way, the user can still navigate between the different options with some reduced functionality in a no-JS environment.
   * This technique is called "progressive enhancement".
   * However, if thats not relevant to you, you can remove the Link component and use a button with an onClick handler without preventing the default behavior.
   */
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(option => {
        const isActive = selectedValues.includes(option.value.toString());
        return (
          <Link
            href={`?${toggleKey}=${isActive ? '' : option.value}`}
            key={option.value}
            className={cn(isActive ? activeClass : inactiveClass, 'w-fit rounded border border-primary px-4 py-2')}
            onClick={e => {
              e.preventDefault();
              if (isActive) {
                onToggle(
                  selectedValues.filter(selectedValue => {
                    return selectedValue !== option.value;
                  }),
                );
              } else {
                onToggle([...selectedValues, option.value]);
              }
            }}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
