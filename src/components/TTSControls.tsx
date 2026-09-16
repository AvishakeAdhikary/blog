'use client';

import { useEffect, useReducer, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { getTTSController, TTS_INTRO_ID } from '@/lib/tts-controller';

export function TTSControls({ contentId = 'post-content' }: { contentId?: string }) {
  const pathname = usePathname();
  const controller = getTTSController();
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const [supported, setSupported] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => controller.subscribe(() => forceRender()), [controller]);

  useEffect(() => {
    setSupported(controller.isSupported);
    if (!controller.isSupported) return;
    const root = document.getElementById(contentId);
    if (root) controller.scan(root);
    setMenuOpen(false);
    return () => {
      controller.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, pathname]);

  if (!supported) return null;
  const sections = controller.getSections();
  if (sections.length === 0) return null;
  const jumpable = sections.filter((s) => s.id !== TTS_INTRO_ID);
  const current = sections.find((s) => s.id === controller.currentSectionId);

  function handlePlayPause() {
    if (!controller.isPlaying) controller.playAll();
    else if (controller.isPaused) controller.resume();
    else controller.pause();
  }

  const playPauseLabel = !controller.isPlaying
    ? 'read this page aloud'
    : controller.isPaused
      ? 'resume reading'
      : 'pause reading';
  const playPauseIcon = !controller.isPlaying ? '▶' : controller.isPaused ? '▶' : '⏸';

  return (
    <div className="tts-toolbar" role="region" aria-label="text to speech controls">
      <button
        type="button"
        className="tts-toolbar-btn"
        onClick={handlePlayPause}
        aria-label={playPauseLabel}
        title={playPauseLabel}
      >
        {playPauseIcon}
      </button>
      <button
        type="button"
        className="tts-toolbar-btn"
        onClick={() => controller.stop()}
        disabled={!controller.isPlaying}
        aria-label="stop reading"
        title="stop"
      >
        ■
      </button>
      <button
        type="button"
        className="tts-toolbar-btn"
        onClick={() => controller.prev()}
        disabled={!controller.isPlaying}
        aria-label="previous section"
        title="previous section"
      >
        ⏮
      </button>
      <button
        type="button"
        className="tts-toolbar-btn"
        onClick={() => controller.next()}
        disabled={!controller.isPlaying}
        aria-label="next section"
        title="next section"
      >
        ⏭
      </button>
      {jumpable.length > 0 && (
        <div className="tts-jump">
          <button
            type="button"
            className="tts-toolbar-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="listbox"
            aria-label="jump to section"
            title="jump to section"
          >
            sections ▾
          </button>
          {menuOpen && (
            <ul className="tts-jump-menu" role="listbox">
              {jumpable.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={clsx(controller.currentSectionId === s.id && 'active')}
                    onClick={() => {
                      controller.jumpTo(s.id);
                      setMenuOpen(false);
                    }}
                    role="option"
                    aria-selected={controller.currentSectionId === s.id}
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <span className="tts-now-playing" aria-live="polite">
        {current?.title || ''}
      </span>
    </div>
  );
}
