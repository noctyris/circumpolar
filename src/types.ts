export interface filter_t {
  filter: string;
  exposure: number;
  count: number;
}

export interface Picture {
  id:                   number;
  title:                string;
  target:               string;
  publicid:             string;
  annotated_publicid?:  string;
  capture_date:         string;
  optics:               string;
  camera:               string;
  mount:                string;
  accessories?:         string;
  focal_length?:        number;
  f_number?:            number;
  capture_data:         filter_t[];
  processing_software?: string;
  ra?:                  number;
  dec?:                 number;
  bortle_class?:        number;
  location?:            string;
  target_category:      string;
  upload_date:          string;
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
