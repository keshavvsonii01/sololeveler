import React from 'react';
import { clsx } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className, children, disabled, ...props }, ref) => {
    const baseStyles = 'font-system uppercase tracking-widest transition-all duration-200 focus:outline-none';

    const variants = {
      primary: 'bg-primary text-primary-dark hover:shadow-bloom active:scale-[0.98]',
      secondary: 'border border-primary text-primary hover:bg-primary hover:bg-opacity-10 active:scale-[0.98]',
      ghost: 'text-primary hover:shadow-bloom active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-label-sm',
      md: 'px-6 py-3 text-label-lg',
      lg: 'px-8 py-4 text-headline-sm',
    };

    const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          disabledStyles,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';