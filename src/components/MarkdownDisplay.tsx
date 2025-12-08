"use client";

import ReactMarkdown from "react-markdown";

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

export default function MarkdownDisplay({
  content,
  className = "",
}: MarkdownDisplayProps) {
  return (
    <div className={`markdown-display ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="mt-6 mb-4 font-bold text-gray-900 dark:text-gray-100 text-3xl"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="mt-6 mb-3 font-bold text-gray-900 dark:text-gray-100 text-2xl"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="mt-4 mb-3 font-bold text-gray-900 dark:text-gray-100 text-xl"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="mt-4 mb-2 font-bold text-gray-900 dark:text-gray-100 text-lg"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="space-y-2 mb-4 ml-6 text-gray-800 dark:text-gray-200 list-disc"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="space-y-2 mb-4 ml-6 text-gray-800 dark:text-gray-200 list-decimal"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="text-gray-800 dark:text-gray-200" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="bg-blue-50 dark:bg-blue-900/20 mb-4 py-2 pl-4 border-blue-500 border-l-4 text-gray-700 dark:text-gray-300 italic"
              {...props}
            />
          ),
          code: ({ node, className, ...props }) => {
            const inline = !className?.includes("language-");
            if (inline) {
              return (
                <code
                  className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded font-mono text-gray-800 dark:text-gray-200 text-sm"
                  {...props}
                />
              );
            }
            return (
              <code
                className="block bg-gray-900 dark:bg-gray-950 mb-4 p-4 rounded-lg overflow-x-auto font-mono text-gray-100 text-sm"
                {...props}
              />
            );
          },
          pre: ({ node, ...props }) => (
            <pre
              className="bg-gray-900 dark:bg-gray-950 mb-4 p-4 rounded-lg overflow-x-auto text-gray-100"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-300 dark:text-blue-400 underline"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <table
              className="mb-4 border border-gray-300 dark:border-gray-600 w-full border-collapse"
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border border-gray-300 dark:border-gray-600 font-semibold text-left"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-4 py-2 border border-gray-300 dark:border-gray-600"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr
              className="my-6 border-gray-300 dark:border-gray-600"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong
              className="font-bold text-gray-900 dark:text-gray-100"
              {...props}
            />
          ),
          em: ({ node, ...props }) => (
            <em
              className="text-gray-800 dark:text-gray-200 italic"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
