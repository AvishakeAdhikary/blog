import readingTime from 'reading-time';

export function getReadingTime(text: string): { text: string; minutes: number; words: number } {
  const r = readingTime(text);
  return { text: r.text, minutes: r.minutes, words: r.words };
}
