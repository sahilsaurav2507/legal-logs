/**
 * Text formatting utilities for blog content
 */

export interface FormattedContent {
  html: string;
  plainText: string;
}

/**
 * Convert markdown-like text to HTML with proper formatting
 */
export function formatBlogContent(content: string): FormattedContent {
  if (!content) {
    return { html: '', plainText: '' };
  }

  let html = content;
  
  // Convert headings
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-lawvriksh-navy mb-3 mt-6">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-lawvriksh-navy mb-4 mt-8">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-lawvriksh-navy mb-6 mt-8">$1</h1>');
  
  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-lawvriksh-navy">$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong class="font-semibold text-lawvriksh-navy">$1</strong>');
  
  // Convert italic text
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/_(.*?)_/g, '<em class="italic">$1</em>');
  
  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-lawvriksh-burgundy hover:text-lawvriksh-navy underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Convert bullet points
  html = html.replace(/^\* (.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
  
  // Convert numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
  
  // Wrap consecutive list items in ul/ol tags
  html = html.replace(/(<li class="ml-4 mb-1">.*<\/li>\s*)+/gs, (match) => {
    return `<ul class="list-disc list-inside mb-4 space-y-1">${match}</ul>`;
  });
  
  // Convert line breaks to paragraphs
  const paragraphs = html.split(/\n\s*\n/);
  html = paragraphs
    .filter(p => p.trim())
    .map(p => {
      // Don't wrap if already wrapped in HTML tags
      if (p.trim().startsWith('<') && p.trim().endsWith('>')) {
        return p.trim();
      }
      return `<p class="mb-4 text-gray-700 leading-relaxed">${p.trim()}</p>`;
    })
    .join('\n');
  
  // Convert single line breaks to <br> within paragraphs
  html = html.replace(/\n(?!<)/g, '<br>');
  
  // Clean up extra spaces
  html = html.replace(/\s+/g, ' ').trim();
  
  // Extract plain text for summaries
  const plainText = content
    .replace(/[#*_\[\]()]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return { html, plainText };
}

/**
 * Create a summary from formatted content
 */
export function createSummary(content: string, maxLength: number = 150): string {
  const { plainText } = formatBlogContent(content);
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last complete sentence within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSentence > maxLength * 0.7) {
    return plainText.substring(0, lastSentence + 1);
  } else if (lastSpace > 0) {
    return plainText.substring(0, lastSpace) + '...';
  } else {
    return truncated + '...';
  }
}

/**
 * Sanitize HTML content for safe rendering
 */
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove potentially dangerous tags
  const dangerousTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const dangerousAttributes = /on\w+="[^"]*"/gi;
  
  return html
    .replace(dangerousTags, '')
    .replace(dangerousAttributes, '')
    .trim();
}


