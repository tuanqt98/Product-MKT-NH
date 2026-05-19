"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-6 mb-3 border-b border-border pb-2 text-2xl font-bold text-foreground">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-5 mb-2 text-xl font-bold text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 mb-2 text-lg font-semibold text-foreground">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-3 mb-1 text-base font-semibold text-foreground/90">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="mb-3 leading-relaxed text-foreground/85">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 ml-2 list-inside list-disc space-y-1 text-foreground/85">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 ml-2 list-inside list-decimal space-y-1 text-foreground/85">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-primary/90">{children}</em>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return (
                <div className="my-3 overflow-hidden rounded-xl border border-border">
                  <div className="border-b border-border bg-muted px-4 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {className?.replace('language-', '') || 'code'}
                  </div>
                  <pre className="overflow-x-auto bg-foreground/[0.06] p-4">
                    <code className="font-mono text-sm text-emerald-600" {...props}>{children}</code>
                  </pre>
                </div>
              );
            }
            return (
              <code className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-sm text-primary" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 rounded-r-lg border-l-4 border-primary/50 bg-primary/5 py-2 pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted text-foreground">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="transition-colors hover:bg-muted/60">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-foreground">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-foreground/80">{children}</td>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
              {children}
            </a>
          ),
          hr: () => (
            <hr className="my-6 border-border" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
