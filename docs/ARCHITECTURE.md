# Architecture

## Overview

```
browser ──> bmusic-ui (Angular, :4200)
   │
   └──────> bmusic-api (Express, :4000) ──> PostgreSQL
                    │
                    └──> data/uploads, data/covers (local disk)
```

The UI talks to the API over HTTP only. Audio is streamed straight from the API with HTTP range requests, so seeking works without downloading the whole file.

## API (`bmusic-api`)

Modular structure: each domain is a self-contained module with its routes, controller and repository (SQL). Modules only reach into each other through repositories.

```
src/
  server.js        starts the HTTP server, creates data folders
  app.js           Express app, mounts module routers, error handling
  config.js        environment variables and paths
  db.js            PostgreSQL connection pool
  shared/http.js   HttpError, asyncHandler, parseId, error middleware
  modules/
    songs/         list, delete, play counts
    albums/        list, find-or-create used by uploads
    artists/       list, find-or-create used by uploads
    playlists/     playlist CRUD and playlist songs
    uploads/       multer config and tag-based import
    media/         static serving of audio and cover files
```

Adding a module: create `src/modules/<name>/` with `<name>.routes.js` (and a controller and repository when needed), then mount the router in `app.js`.

Errors: throw `HttpError(status, message)` from a controller. Unique and foreign key violations from PostgreSQL are mapped to 409 and 404. Every error response has the shape `{ "error": "message" }`.

### Endpoints

| Method | Path                              | Description                                         |
| ------ | --------------------------------- | --------------------------------------------------- |
| GET    | `/health`                         | Health check                                        |
| GET    | `/songs`                          | All songs                                           |
| DELETE | `/songs/:id`                      | Delete a song and its audio file                    |
| POST   | `/songs/:id/play`                 | Increment play count, returns `{ playCount }`       |
| GET    | `/songs/:id/playlists`            | Ids of playlists that contain the song              |
| GET    | `/albums`                         | All albums                                          |
| GET    | `/artists`                        | All artists                                         |
| GET    | `/playlists`                      | All playlists                                       |
| POST   | `/playlists`                      | Create, body `{ name, description? }`               |
| GET    | `/playlists/:id`                  | One playlist                                        |
| DELETE | `/playlists/:id`                  | Delete (409 for the protected Favorites playlist)   |
| GET    | `/playlists/:id/songs`            | Songs in a playlist                                 |
| POST   | `/playlists/:id/songs`            | Add a song, body `{ songId }`                       |
| DELETE | `/playlists/:id/songs/:songId`    | Remove a song from a playlist                       |
| POST   | `/uploads`                        | Multipart upload, field `files`, returns `{ uploaded, failed }` |
| GET    | `/data/uploads/:file`             | Stream an audio file (supports `Range`)             |
| GET    | `/data/covers/:file`              | Cover image                                         |

Songs store `file_path` and `album_cover_url` as paths relative to the API root (for example `data/uploads/1700000000000-ab12cd34.mp3`), so a stored path is also its URL path.

## UI (`bmusic-ui`)

Feature-Sliced Design. Code is split into layers; a layer may only import from layers below it:

```
app → pages → widgets → features → entities → shared
```

```
src/
  app/        bootstrap, routes, root component, global data loading
  pages/      one folder per route: home, songs, albums, album, artists, artist, playlists, playlist
  widgets/    composed page blocks: header, player, songs-table, top-songs
  features/   user actions: play-song, search-songs, upload-music, song-menu,
              create-playlist, delete-playlist
  entities/   domain data: song, album, artist, playlist, player
  shared/     config (API URL), api (URL helpers), lib (formatting)
```

Rules:

- Each slice exposes a public API in its `index.ts`. Import from `@entities/song`, never from `@entities/song/model/...`.
- Slices on the same layer do not import each other. A widget composes features instead (for example the header wires `search-songs` output into `play-song`). The one exception is type-only imports between entities (`import type { Song } from '@entities/song'`).
- Path aliases `@app`, `@pages`, `@widgets`, `@features`, `@entities` and `@shared` are defined in `tsconfig.json`.
- Segments inside a slice: `ui/` components, `model/` state and types, `api/` HTTP calls, `lib/` pure helpers.

State is kept in signal-based stores provided in root:

- `SongStore`, `AlbumStore`, `ArtistStore` hold the library. They are loaded once in `AppComponent` and reloaded after an upload. Pages derive their lists from them with `computed`.
- `PlayerStore` holds the current song, the play queue, transport flags, volume and position. It is saved to `sessionStorage`, so a page reload restores the track and position (paused, because browsers block autoplay).
- `PlaybackService` (`features/play-song`) is the only place that starts songs. It loads the song into `PlayerStore`, records a play, and handles next, previous, shuffle and repeat.

Route parameters are bound to component inputs (`withComponentInputBinding`), for example `album/:albumId` sets `AlbumPageComponent.albumId`.

## Database

The schema is in [database/V1___initial_schema.sql](../database/V1___initial_schema.sql) and is applied automatically the first time the PostgreSQL container starts with an empty volume. Tables: `artists`, `albums`, `songs`, `playlists`, `playlist_songs`. A trigger prevents deleting the protected Favorites playlist.
