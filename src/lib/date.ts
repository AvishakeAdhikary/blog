import { format, parseISO } from 'date-fns';

export function formatDate(input: string | Date, fmt = 'MMM d, yyyy'): string {
  const date = typeof input === 'string' ? parseISO(input) : input;
  return format(date, fmt);
}

export function toISO(input: string | Date): string {
  const date = typeof input === 'string' ? parseISO(input) : input;
  return date.toISOString();
}

export function compareDateDesc(a: string, b: string): number {
  return new Date(b).getTime() - new Date(a).getTime();
}
