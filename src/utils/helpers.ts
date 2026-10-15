// ============================================================
// Utility helpers
// ============================================================

/** Format a Date object to a readable string, e.g. "12 October 2026" */
export function formatDate(date: Date | undefined | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!date) return '';
  const defaults: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('en-IN', opts ?? defaults).format(date);
}

/** Format date + time */
export function formatDateTime(date: Date | undefined | null): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/** Generate a human-readable reference number for complaints */
export function generateReferenceNumber(): string {
  const prefix = 'BES';
  const year   = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${year}${random}`;
}

/** Format file size from bytes to KB/MB */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

/** Truncate string with ellipsis */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '…';
}

/** Check if a URL is external */
export function isExternalUrl(url: string): boolean {
  try {
    return new URL(url).origin !== window.location.origin;
  } catch {
    return false;
  }
}

/** Strip HTML tags from a string for plain-text excerpts */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

/** Sanitize user input — basic XSS protection for display */
export function sanitizeText(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Validate email address */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate Indian mobile number — accepts 10 digits or +91 prefix */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-+]/g, '');
  // Strip country code 91 if 12 digits total
  const mobile = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(mobile);
}

/** Category label maps */
export const NOTICE_CATEGORY_LABELS: Record<string, string> = {
  general:     'General',
  maintenance: 'Maintenance',
  security:    'Security',
  finance:     'Finance',
  event:       'Event',
  emergency:   'Emergency',
  utilities:   'Utilities',
  other:       'Other',
};

export const COMPLAINT_CATEGORY_LABELS: Record<string, string> = {
  maintenance: 'Maintenance',
  cleanliness: 'Cleanliness',
  security:    'Security',
  water:       'Water Supply',
  electricity: 'Electricity',
  parking:     'Parking',
  noise:       'Noise',
  other:       'Other',
};

export const DOCUMENT_CATEGORY_LABELS: Record<string, string> = {
  bylaw:       'Bylaws & Rules',
  minutes:     'Meeting Minutes',
  circular:    'Circular',
  financial:   'Financial',
  legal:       'Legal',
  maintenance: 'Maintenance',
  other:       'Other',
};

export const STATUS_COLORS: Record<string, string> = {
  submitted:    'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  in_progress:  'bg-orange-100 text-orange-800',
  resolved:     'bg-green-100 text-green-800',
  closed:       'bg-gray-100 text-gray-800',
  published:    'bg-green-100 text-green-800',
  draft:        'bg-yellow-100 text-yellow-800',
  archived:     'bg-gray-100 text-gray-800',
};

export const COMPLAINT_STATUS_LABELS: Record<string, string> = {
  submitted:    'Submitted — We have received your complaint.',
  under_review: 'Under Review — The RWA committee is reviewing your complaint.',
  in_progress:  'In Progress — Action is being taken on your complaint.',
  resolved:     'Resolved — Your complaint has been resolved. Please confirm.',
  closed:       'Closed — This complaint has been closed.',
};
