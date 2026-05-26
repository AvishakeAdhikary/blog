interface Props {
  fill?: string;
  className?: string;
}

export function Spotlight({ fill = 'var(--accent)', className = '' }: Props) {
  return (
    <svg
      className={`pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[120%] max-w-none opacity-0 animate-spotlight ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 560"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="blur-spot" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="80" />
        </filter>
        <radialGradient id="grad-spot" cx="50%" cy="10%" r="60%">
          <stop offset="0%" stopColor={fill} stopOpacity="0.18" />
          <stop offset="70%" stopColor={fill} stopOpacity="0.06" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        cx="720"
        cy="0"
        rx="800"
        ry="400"
        fill="url(#grad-spot)"
        filter="url(#blur-spot)"
      />
    </svg>
  );
}
