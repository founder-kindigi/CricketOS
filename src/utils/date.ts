export function format(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatInputDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
