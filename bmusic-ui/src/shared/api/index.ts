import { API_BASE_URL, FALLBACK_COVER } from '@shared/config';

export const apiUrl = (path: string): string => `${API_BASE_URL}/${path}`;

/** Resolves a stored media path such as "data/covers/1.png" to a URL. */
export const mediaUrl = (path: string | null | undefined): string =>
  path ? apiUrl(path) : '';

export const coverUrl = (path: string | null | undefined): string =>
  mediaUrl(path) || FALLBACK_COVER;
