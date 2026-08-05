/** Empty string = same-origin (prod behind Caddy). Dev defaults to the Go server. */
export const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? 'http://localhost:8080' : '')

export function wsURL(path = '/api/ws'): string {
  const custom = import.meta.env.VITE_WS_URL
  if (custom) return custom
  if (import.meta.env.DEV) return `ws://localhost:8080${path}`
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}${path}`
}
