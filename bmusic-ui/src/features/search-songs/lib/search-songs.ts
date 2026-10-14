import type { Song } from '@entities/song';
import { normalizeText } from '@shared/lib';

/** Every word of the query must appear in the title, artist or album. */
export const searchSongs = (songs: Song[], query: string): Song[] => {
  const tokens = normalizeText(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return songs;

  return songs.filter((song) => {
    const haystack = normalizeText(`${song.title} ${song.artist} ${song.album}`);
    return tokens.every((token) => haystack.includes(token));
  });
};
