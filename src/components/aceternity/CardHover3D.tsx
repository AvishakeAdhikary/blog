'use client';
import { useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function CardHover3D({ children, className = '', intensity = 6 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(6px)`;
    });
  };

  const handleMouseLeave = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
    card.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    setTimeout(() => {
      if (card) card.style.transition = '';
    }, 500);
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}
