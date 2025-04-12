import React from 'react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={`inline-block rounded-full border-t-transparent border-primary animate-spin ${sizes[size]} ${className || ''}`}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
} 