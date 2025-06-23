export function ariaLabel(label: string, context?: string): string {
  return context ? `${label} (${context})` : label
} 