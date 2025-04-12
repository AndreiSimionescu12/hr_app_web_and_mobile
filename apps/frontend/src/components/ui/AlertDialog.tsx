import React from 'react';

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export const AlertDialog = ({ open, onOpenChange, children }: AlertDialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
};

AlertDialog.Content = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`${className || ''}`} {...props}>
    {children}
  </div>
);

AlertDialog.Header = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 border-b dark:border-gray-700 ${className || ''}`} {...props}>
    {children}
  </div>
);

AlertDialog.Title = ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={`text-lg font-semibold ${className || ''}`} {...props}>
    {children}
  </h2>
);

AlertDialog.Description = ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`mt-2 text-sm text-gray-500 dark:text-gray-400 ${className || ''}`} {...props}>
    {children}
  </p>
);

AlertDialog.Footer = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 flex justify-end space-x-4 border-t dark:border-gray-700 ${className || ''}`} {...props}>
    {children}
  </div>
);

AlertDialog.displayName = 'AlertDialog'; 