import { getTTSController } from '../tts-controller';

/** Adds a small "speak this section" button next to every h2/h3/h4. */
export function enhanceTTSHeadingButtons(root: HTMLElement): () => void {
  const controller = getTTSController();
  if (!controller.isSupported) return () => {};

  const headings = Array.from(root.querySelectorAll<HTMLElement>('h2[id], h3[id], h4[id]'));
  const cleanups: Array<() => void> = [];

  for (const heading of headings) {
    if (heading.querySelector('.tts-speak-btn')) continue;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tts-speak-btn';
    btn.textContent = '🔊';
    btn.setAttribute('aria-label', 'read this section aloud');
    const handler = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      controller.playSectionOnly(heading.id);
    };
    btn.addEventListener('click', handler);
    heading.appendChild(btn);
    cleanups.push(() => {
      btn.removeEventListener('click', handler);
      if (btn.parentNode === heading) heading.removeChild(btn);
    });
  }

  return () => {
    for (const fn of cleanups) fn();
  };
}
