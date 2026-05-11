"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-6 mb-3 text-white border-b border-white/10 pb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mt-5 mb-2 text-white">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mt-4 mb-2 text-white/90">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold mt-3 mb-1 text-white/80">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="mb-3 leading-relaxed text-white/80">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1 text-white/80 ml-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1 text-white/80 ml-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-primary/90">{children}</em>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return (
                <div className="my-3 rounded-xl overflow-hidden border border-white/10">
                  <div className="bg-white/5 px-4 py-1.5 text-[10px] text-white/40 uppercase tracking-wider border-b border-white/5">
                    {className?.replace('language-', '') || 'code'}
                  </div>
                  <pre className="bg-black/30 p-4 overflow-x-auto">
                    <code className="text-sm text-emerald-300 font-mono" {...props}>{children}</code>
                  </pre>
                </div>
              );
            }
            return (
              <code className="bg-white/10 text-pink-300 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 my-3 italic text-white/60 bg-white/5 py-2 rounded-r-lg">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-white/10">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-white/10 text-white/90">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-white/5">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-white/5 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wider">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-white/70">{children}</td>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
              {children}
            </a>
          ),
          hr: () => (
            <hr className="my-6 border-white/10" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
