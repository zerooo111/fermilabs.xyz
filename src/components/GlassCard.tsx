export default function GlassCard({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`p-16 gap-12 glass-card flex flex-col ${className}`}>
      {children}
    </div>
  );
}

export function GlassCardTitle({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <h1
      className={`text-3xl md:text-5xl font-display tracking-[0.02em]  ${className}`}
    >
      {children}
    </h1>
  );
}

export function GlassCardContent({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`flex flex-col gap-6 text-2xl text-rock/90 ${className}`}>
      {children}
    </div>
  );
}
