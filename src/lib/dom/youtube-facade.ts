/**
 * Swaps the click-to-load YouTube facade (thumbnail + play button, built by
 * rehype-video-embed) for a real `youtube-nocookie.com` iframe on click, so
 * YouTube's iframe/JS is never loaded unless the reader actually presses play.
 */
export function enhanceYouTubeFacades(root: HTMLElement): () => void {
  const facades = Array.from(
    root.querySelectorAll<HTMLElement>('.video-embed--youtube[data-video-id]')
  );
  const cleanups: Array<() => void> = [];

  for (const facade of facades) {
    const button = facade.querySelector<HTMLButtonElement>('.video-embed__play');
    const videoId = facade.dataset.videoId;
    if (!button || !videoId) continue;

    const handler = () => {
      const iframe = document.createElement('iframe');
      iframe.className = 'video-embed__iframe';
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
      iframe.title = button.getAttribute('aria-label') || 'YouTube video';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      button.replaceWith(iframe);
    };
    button.addEventListener('click', handler);
    cleanups.push(() => button.removeEventListener('click', handler));
  }

  return () => {
    for (const fn of cleanups) fn();
  };
}
