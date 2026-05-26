'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>/\\|[]{}';

interface Props {
  text: string;
  trigger?: 'mount' | 'hover' | 'visible';
  speed?: number;
  className?: string;
}

export function EncryptedText({ text, trigger = 'mount', speed = 35, className }: Props) {
  const [display, setDisplay] = useState(() => (trigger === 'mount' ? '' : text));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isAnimating = useRef(false);

  const animate = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    let current = 0;

    const tick = () => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < current) return char;
            return CHARSET[Math.floor(Math.random() * CHARSET.length)];
          })
          .join('')
      );
      if (current < text.length) {
        current++;
        timerRef.current = setTimeout(tick, speed);
      } else {
        isAnimating.current = false;
      }
    };
    tick();
  }, [text, speed]);

  useEffect(() => {
    if (trigger === 'mount') {
      animate();
    } else if (trigger === 'visible') {
      const el = containerRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animate();
            obs.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      isAnimating.current = false;
    };
  }, [animate, trigger]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  return (
    <span
      ref={containerRef}
      className={className}
      onMouseEnter={trigger === 'hover' ? animate : undefined}
      aria-label={text}
    >
      {display || text}
    </span>
  );
}
