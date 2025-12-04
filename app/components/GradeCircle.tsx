import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GradeCircleProps extends HTMLAttributes<HTMLDivElement> {
  grade: number;
  date?: string;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
}

export const GradeCircle = forwardRef<HTMLDivElement, GradeCircleProps>(
  ({ grade, date, size = 'md', clickable = false, className, ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-14 h-14 text-xl',
    };

    // цвета в зависимости от оценки
    const gradeColors = {
      5: 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-green-500/30',
      4: 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-blue-500/30',
      3: 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-yellow-500/30',
      2: 'bg-gradient-to-br from-red-400 to-rose-500 shadow-red-500/30',
    };

    return (
      <div
        ref={ref}
        title={date ? new Date(date).toLocaleDateString('ru-RU') : undefined}
        className={cn(
          'rounded-full flex items-center justify-center font-bold text-white',
          'shadow-lg transition-all duration-300',
          'backdrop-filter backdrop-blur-sm',
          sizes[size],
          gradeColors[grade as keyof typeof gradeColors] || 'bg-gray-400',
          clickable && 'cursor-pointer hover:scale-110 hover:shadow-xl active:scale-95',
          className
        )}
        {...props}
      >
        {grade}
      </div>
    );
  }
);

GradeCircle.displayName = 'GradeCircle';
