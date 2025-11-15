
import React from 'react';

// FIX: Made children and title props optional to resolve type errors across the app. Added explicit prop types and used React.FC.
interface ContentCardProps {
  title?: any;
  children?: React.ReactNode;
  showHeader?: boolean;
  className?: string;
  titleClassName?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ title, children, showHeader = true, className = '', titleClassName = '' }) => {
  const titleId = title ? title.replace(/\s+/g, '-').toLowerCase() : '';

  // If there's no title to click on, render a non-collapsible simple card.
  if (!title || !showHeader) {
    return (
      <section aria-labelledby={titleId} className={className}>
        <div className="bg-card-dark rounded-lg shadow-md p-4 md:p-6 border border-gray-700 flex flex-col h-full">
          <div className="flex-grow">{children}</div>
        </div>
      </section>
    );
  }
  
  return (
    <details className={`bg-card-dark rounded-lg shadow-md border border-gray-700 group ${className}`} open={false}>
      <summary className="p-4 md:p-6 cursor-pointer list-none flex justify-between items-center" aria-labelledby={titleId}>
        <h2 id={titleId} className={`text-2xl font-bold text-accent-green ${titleClassName}`}>
          {title}
        </h2>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 transition-transform transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </summary>
      <div className="p-4 md:p-6 pt-0">
        <div className="flex-grow border-t border-gray-700 pt-4">{children}</div>
      </div>
    </details>
  );
};

export default ContentCard;