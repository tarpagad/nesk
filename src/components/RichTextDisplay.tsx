/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <content is sanitized> */
"use client";

import DOMPurify from "isomorphic-dompurify";

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export default function RichTextDisplay({
  content,
  className = "",
}: RichTextDisplayProps) {
  // Sanitize HTML to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      className={`rich-text-display prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
