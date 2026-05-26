import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Container({
  children,
  className,
  size = 'md'
}: {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const max = size === 'sm' ? 'max-w-2xl' : size === 'lg' ? 'max-w-6xl' : 'max-w-4xl';
  return <div className={clsx('mx-auto w-full px-4 sm:px-6', max, className)}>{children}</div>;
}
