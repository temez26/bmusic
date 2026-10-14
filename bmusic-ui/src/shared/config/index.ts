// The API runs on port 4000 of the same host that serves the UI, so the app
// also works when opened from another device on the local network.
export const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:4000`;

export const FALLBACK_COVER = '/cd-cover.png';
