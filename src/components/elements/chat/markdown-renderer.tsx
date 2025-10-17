"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamic import untuk menghindari masalah SSR
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
const remarkGfm = dynamic(() => import("remark-gfm"), { ssr: false });
const rehypeHighlight = dynamic(() => import("rehype-highlight"), { ssr: false });

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
  className?: string;
}

export function MarkdownRenderer({ content, isUser = false, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headings
          h1: ({ children, ...props }) => (
            <h1
              className={cn(
                "text-lg font-bold mb-3 mt-4 first:mt-0",
                isUser ? "text-white" : "text-slate-gray-900"
              )}
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className={cn(
                "text-base font-semibold mb-2 mt-3 first:mt-0",
                isUser ? "text-white" : "text-slate-gray-900"
              )}
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className={cn(
                "text-sm font-semibold mb-2 mt-3 first:mt-0",
                isUser ? "text-white" : "text-slate-gray-900"
              )}
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className={cn(
                "text-sm font-medium mb-1 mt-2 first:mt-0",
                isUser ? "text-white" : "text-slate-gray-900"
              )}
              {...props}
            >
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5
              className={cn(
                "text-xs font-medium mb-1 mt-2 first:mt-0",
                isUser ? "text-white" : "text-slate-gray-900"
              )}
              {...props}
            >
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6
              className={cn(
                "text-xs font-medium mb-1 mt-2 first:mt-0",
                isUser ? "text-white" : "text-slate-gray-900"
              )}
              {...props}
            >
              {children}
            </h6>
          ),

          // Paragraphs
          p: ({ children, ...props }) => (
            <p
              className={cn(
                "mb-2 last:mb-0 leading-relaxed",
                isUser ? "text-white" : "text-slate-gray-800"
              )}
              {...props}
            >
              {children}
            </p>
          ),

          // Lists
          ul: ({ children, ...props }) => (
            <ul
              className={cn(
                "mb-2 ml-4 space-y-1",
                isUser ? "text-white" : "text-slate-gray-800"
              )}
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className={cn(
                "mb-2 ml-4 space-y-1",
                isUser ? "text-white" : "text-slate-gray-800"
              )}
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li
              className={cn(
                "leading-relaxed",
                isUser ? "text-white" : "text-slate-gray-800"
              )}
              {...props}
            >
              {children}
            </li>
          ),

          // Code
          code: ({ children, className, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className={cn(
                    "px-1.5 py-0.5 rounded text-xs font-mono",
                    isUser
                      ? "bg-sky-blue-500/30 text-white"
                      : "bg-slate-100 text-slate-800"
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className={cn(
                  "block p-3 rounded-lg text-xs font-mono overflow-x-auto",
                  isUser
                    ? "bg-sky-blue-500/20 text-white"
                    : "bg-slate-100 text-slate-800"
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre
              className={cn(
                "mb-2 overflow-x-auto rounded-lg p-3",
                isUser ? "bg-sky-blue-500/20" : "bg-slate-100"
              )}
              {...props}
            >
              {children}
            </pre>
          ),

          // Blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote
              className={cn(
                "border-l-4 pl-3 py-1 mb-2 italic",
                isUser
                  ? "border-sky-blue-300 text-white/90"
                  : "border-slate-300 text-slate-600"
              )}
              {...props}
            >
              {children}
            </blockquote>
          ),

          // Links
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1 underline hover:no-underline transition-colors",
                isUser
                  ? "text-sky-100 hover:text-white"
                  : "text-blue-600 hover:text-blue-800"
              )}
              {...props}
            >
              {children}
              <svg
                className="h-3 w-3 opacity-70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>External link</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ),

          // Strong/Bold
          strong: ({ children, ...props }) => (
            <strong
              className={cn(
                "font-semibold",
                isUser ? "text-white" : "text-slate-gray-900"
              )}
              {...props}
            >
              {children}
            </strong>
          ),

          // Emphasis/Italic
          em: ({ children, ...props }) => (
            <em
              className={cn(
                "italic",
                isUser ? "text-white/90" : "text-slate-gray-700"
              )}
              {...props}
            >
              {children}
            </em>
          ),

          // Tables
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-2">
              <table
                className={cn(
                  "min-w-full border-collapse border",
                  isUser
                    ? "border-sky-blue-300"
                    : "border-slate-300"
                )}
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead
              className={cn(
                isUser ? "bg-sky-blue-500/30" : "bg-slate-50"
              )}
              {...props}
            >
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr
              className={cn(
                "border-b",
                isUser
                  ? "border-sky-blue-300"
                  : "border-slate-200"
              )}
              {...props}
            >
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th
              className={cn(
                "px-3 py-2 text-left text-xs font-medium",
                isUser
                  ? "text-white"
                  : "text-slate-700"
              )}
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className={cn(
                "px-3 py-2 text-xs",
                isUser
                  ? "text-white"
                  : "text-slate-600"
              )}
              {...props}
            >
              {children}
            </td>
          ),

          // Horizontal rule
          hr: ({ ...props }) => (
            <hr
              className={cn(
                "my-3 border-0 h-px",
                isUser
                  ? "bg-sky-blue-300"
                  : "bg-slate-200"
              )}
              {...props}
            />
          ),

          // Task lists
          input: ({ type, checked, ...props }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  className={cn(
                    "mr-2 rounded",
                    isUser
                      ? "text-sky-blue-400"
                      : "text-blue-600"
                  )}
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
