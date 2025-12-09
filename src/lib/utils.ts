/**
 * Truncate text at word boundary
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Find the last space within the limit
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  // If there's a space, truncate there; otherwise use maxLength
  return lastSpace > 0
    ? `${truncated.substring(0, lastSpace)}...`
    : `${truncated}...`;
}

/**
 * Normalize email address (lowercase and trim)
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * HTML escape helper to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Strip HTML tags and return plain text
 * Used for validating rich text editor content
 * Note: This is a simple regex-based approach that handles common HTML tags.
 * It may not handle edge cases like malformed HTML or HTML comments.
 * For more robust HTML parsing, consider using a dedicated HTML parser.
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Check if rich text editor content is empty
 * Quill's empty state is "<p><br></p>"
 */
export function isRichTextEmpty(html: string): boolean {
  return stripHtmlTags(html).length === 0;
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
