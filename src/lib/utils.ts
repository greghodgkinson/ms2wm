import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'gray',
    pending: 'gray',
    in_progress: 'blue',
    running: 'blue',
    analyzing: 'blue',
    completed: 'green',
    analyzed: 'green',
    deployed: 'green',
    passed: 'green',
    error: 'red',
    failed: 'red',
    unhealthy: 'red',
    warning: 'yellow',
    degraded: 'yellow',
    unknown: 'gray',
  };
  return colors[status] || 'gray';
}
