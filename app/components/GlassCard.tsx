import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// утилита для объединения классов
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-3xl p-6 text-gray-900 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
