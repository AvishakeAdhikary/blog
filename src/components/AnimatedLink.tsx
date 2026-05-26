'use client';

import Link from 'next/link';
import clsx from 'clsx';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof Link> & { className?: string };

export function AnimatedLink({ className, children, ...rest }: Props) {
  return (
    <Link className={clsx('anim-underline', className)} {...rest}>
      {children}
    </Link>
  );
}
