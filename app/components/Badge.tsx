import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple';
  children: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-700 border-gray-200',
      primary: 'bg-blue-100 text-blue-700 border-blue-200',
      success: 'bg-green-100 text-green-700 border-green-200',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      danger: 'bg-red-100 text-red-700 border-red-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
          'backdrop-filter backdrop-blur-sm border',
          'transition-all duration-200',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
