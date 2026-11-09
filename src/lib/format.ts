export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function initials(name?: string | null): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0] ?? '';
  const second = parts.length > 1 ? (parts[1][0] ?? '') : '';
  return (first + second).toUpperCase();
}

export function formatDate(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Accepts a full YouTube URL (watch / youtu.be / embed / shorts) or a bare 11-char video id. */
export function extractYoutubeId(input?: string | null): string {
  if (!input) return '';
  const value = input.trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return url.pathname.slice(1).split('/')[0] ?? '';
    if (host.endsWith('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      if (['embed', 'shorts', 'live', 'v'].includes(parts[0] ?? '')) return parts[1] ?? '';
    }
  } catch {
    /* not a URL */
  }
  return '';
}

export function averageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}
