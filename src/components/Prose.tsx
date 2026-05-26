import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('prose prose-invert max-w-none', className)}>{children}</div>;
}
