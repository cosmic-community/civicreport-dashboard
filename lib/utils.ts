import { format, formatDistanceToNow } from 'date-fns';
import type { PriorityLevel, ReportStatus } from '@/types';

// Format date for display
export function formatDate(date: string | null | undefined): string {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
}

// Format date with time
export function formatDateTime(date: string | null | undefined): string {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  } catch {
    return 'Invalid date';
  }
}

// Get relative time
export function getRelativeTime(date: string | null | undefined): string {
  if (!date) return 'N/A';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
}

// Get priority color class
export function getPriorityColor(priority: PriorityLevel | undefined): string {
  switch (priority) {
    case 'Urgent':
      return 'bg-danger-500 text-white';
    case 'High':
      return 'bg-warning-500 text-white';
    case 'Medium':
      return 'bg-primary-500 text-white';
    case 'Low':
      return 'bg-gray-400 text-white';
    default:
      return 'bg-gray-300 text-gray-700';
  }
}

// Get priority badge color
export function getPriorityBadgeColor(priority: PriorityLevel | undefined): string {
  switch (priority) {
    case 'Urgent':
      return 'bg-danger-50 text-danger-600 border-danger-200';
    case 'High':
      return 'bg-warning-50 text-warning-600 border-warning-200';
    case 'Medium':
      return 'bg-primary-50 text-primary-600 border-primary-200';
    case 'Low':
      return 'bg-gray-50 text-gray-600 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

// Get status color class
export function getStatusColor(status: ReportStatus | undefined): string {
  switch (status) {
    case 'New':
      return 'bg-blue-500 text-white';
    case 'Acknowledged':
      return 'bg-yellow-500 text-white';
    case 'In Progress':
      return 'bg-orange-500 text-white';
    case 'Resolved':
      return 'bg-green-500 text-white';
    case 'Closed':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-300 text-gray-700';
  }
}

// Get status badge color
export function getStatusBadgeColor(status: ReportStatus | undefined): string {
  switch (status) {
    case 'New':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'Acknowledged':
      return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    case 'In Progress':
      return 'bg-orange-50 text-orange-600 border-orange-200';
    case 'Resolved':
      return 'bg-success-50 text-success-600 border-green-200';
    case 'Closed':
      return 'bg-gray-50 text-gray-600 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

// Truncate text
export function truncateText(text: string | undefined, maxLength: number = 100): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}