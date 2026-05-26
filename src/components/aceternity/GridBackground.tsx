interface Props {
  children?: React.ReactNode;
  className?: string;
  dots?: boolean;
  fade?: boolean;
}

export function GridBackground({ children, className = '', dots = false, fade = true }: Props) {
  const pattern = dots
    ? `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1' fill='%231f1f1f'/%3E%3C/svg%3E")`
    : `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V0h40' stroke='%231f1f1f' stroke-width='0.6'/%3E%3C/svg%3E")`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: pattern,
          maskImage: fade
            ? 'radial-gradient(ellipse 90% 70% at 50% 0%, black 20%, transparent 100%)'
            : undefined,
          WebkitMaskImage: fade
            ? 'radial-gradient(ellipse 90% 70% at 50% 0%, black 20%, transparent 100%)'
            : undefined
        }}
      />
      {children}
    </div>
  );
}
