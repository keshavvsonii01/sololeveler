import React from 'react';
import { clsx } from '../lib/utils';

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const styles = {
    error: {
      bg: 'bg-error bg-opacity-10',
      border: 'border-error',
      text: 'text-error',
      icon: '⚠️',
    },
    success: {
      bg: 'bg-primary bg-opacity-10',
      border: 'border-primary',
      text: 'text-primary',
      icon: '✓',
    },
    warning: {
      bg: 'bg-warning bg-opacity-10',
      border: 'border-warning',
      text: 'text-warning',
      icon: '⚡',
    },
    info: {
      bg: 'bg-info bg-opacity-10',
      border: 'border-info',
      text: 'text-info',
      icon: 'ℹ',
    },
  };

  const style = styles[type];

  return (
    <div
      className={clsx(
        'border-l-4 p-4 rounded-none',
        style.bg,
        style.border,
        'animate-slide-in-top'
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className={clsx('text-xl', style.text)}>{style.icon}</span>
        <div className="flex-1">
          {title && <h4 className={clsx('font-system font-bold text-label-lg', style.text)}>{title}</h4>}
          <p className={clsx('text-body-sm', style.text)}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={clsx('text-xl', style.text, 'hover:opacity-70 transition-opacity')}
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};