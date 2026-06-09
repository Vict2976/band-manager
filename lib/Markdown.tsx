'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Renders markdown text with the app's `.md` styling. */
export default function Markdown({ children, className = '' }: { children: string; className?: string }) {
  return (
    <div className={`md ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Open links in a new tab, keep them safe.
          a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
