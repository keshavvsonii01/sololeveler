import React from 'react';
import { clsx } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={clsx(
            'w-full bg-transparent text-on-surface font-functional focus:outline-none',
            'border-b-2 border-outline-variant transition-colors duration-200',
            'focus:border-primary focus:shadow-[0_0_12px_rgba(0,242,255,0.3)]',
            'placeholder:text-on-surface-variant',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error text-error',
            className
          )}
          {...props}
        />
        
        {error && (
          <p className="text-error text-body-sm mt-1">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-on-surface-variant text-body-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';