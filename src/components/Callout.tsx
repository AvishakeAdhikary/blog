import clsx from 'clsx';
import type { ReactNode } from 'react';

type Tone = 'info' | 'warn' | 'danger' | 'note';

export function Callout({
  tone = 'info',
  title,
  children
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  const toneClass: Record<Tone, string> = {
    info: 'border-l-4 border-l-accent',
    warn: 'border-l-4 border-l-yellow-500',
    danger: 'border-l-4 border-l-red-500',
    note: 'border-l-4 border-l-muted'
  };
  return (
    <aside
      className={clsx(
        'bg-code-bg/40 border border-border my-4 rounded px-4 py-3 text-sm',
        toneClass[tone]
      )}
    >
      {title && <div className="font-bold mb-1">{title}</div>}
      <div>{children}</div>
    </aside>
  );
}
