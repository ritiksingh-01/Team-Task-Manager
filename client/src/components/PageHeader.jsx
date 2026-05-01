import React from 'react';

const PageHeader = ({ title, description, children }) => {
  return (
    <header className="bg-surface border-b border-border px-4 lg:px-8 h-16 shrink-0 w-full flex items-center">
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-textMain m-0">
            {title}
          </h2>
          {description && <span className="hidden lg:block text-sm font-medium text-textMuted border-l border-border pl-3 ml-1">{description}</span>}
        </div>
        
        {children && (
          <div className="flex shrink-0 items-center">
            {children}
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
