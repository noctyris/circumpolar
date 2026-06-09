export interface filter_t {
  type: string;
  exposure: number;
  count: number;
}

export interface Picture {
  id: number;
  title: string;
  publicID: string;
  capture_date?: string; // ISO string
  scope?: string;
  camera?: string;
  filters?: filter_t[];
  stacking?: string;
  type?: string;
}

export function formatDuration(seconds: number): string {
  if (seconds < 1e-3) {
    const µs = Math.round(seconds * 1e6);
    return `${µs}µs`;
  }

  if (seconds < 1) {
    const ms = Math.round(seconds * 1000);
    return `${ms}ms`;
  }

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hrs) parts.push(`${hrs}h`);
  if (mins) parts.push(`${mins}mn`);
  if (secs || (!hrs && !mins)) parts.push(`${secs}s`);

  return parts.join(" ");
}
