# DashCord — Client

Desktop app for DashCord: a React 19 + Vite frontend packaged as a native, cross-platform app with [Tauri v2](https://v2.tauri.app/). Talks to the [`server`](../server) API for auth, playlists, and YouTube search, and plays tracks in-app via the YouTube IFrame Player API.

> Looking for the backend or the repo overview? See [`../server/README.md`](../server/README.md) and [`../README.md`](../README.md).

## Tech stack

- **React 19** + **TypeScript**, bundled with **Vite 6**
- **React Router** (`HashRouter`, required for Tauri's `tauri://` origin)
- **Redux Toolkit** for player state
- **Axios** for the API client
- **Tauri v2** (Rust) for the native desktop shell — window, packaging, installers
- **Bun** as the package manager / script runner

## Project structure

```
client/
├── src/
│   ├── components/     # Reusable UI (Player, Sidebar, BottomNav, PlaylistCard, SongCard, Toast)
│   ├── pages/           # Route-level views (Login, Playlists, Playlist, Songs, Profile, DashboardLayout)
│   ├── hooks/           # useAuth, useToast
│   ├── lib/             # API calls (auth, playlist, songs) + token storage
│   ├── store/           # Redux store + playerSlice
│   ├── types.ts         # Shared TS types (IPlaylist, ISong)
│   └── main.tsx         # App entry + route definitions
├── src-tauri/           # Rust/Tauri project (native shell, bundler config, icons)
│   ├── src/             # Rust entrypoint (main.rs, lib.rs)
│   ├── icons/            # App icons for every platform (.ico, .icns, .png)
│   └── tauri.conf.json  # Window, bundle targets, dev/build hooks
├── public/               # Static assets served as-is
├── vite.config.ts
└── tsconfig.json
```

## Setup

Requires [Bun](https://bun.sh) and, for native builds, the [Rust toolchain](https://www.rust-lang.org/tools/install) plus [Tauri's platform prerequisites](https://v2.tauri.app/start/prerequisites/).

```bash
bun install
```

Create a `.env` file in `client/` pointing at your running backend:

```bash
VITE_API_URL=http://localhost:8000/api
```

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Start the Vite dev server at `http://localhost:3000` (web-only, no Tauri window) |
| `bun run build` | Type-check-free production build of the frontend into `dist/` |
| `bun run preview` | Preview the production build locally |
| `bun run tauri dev` | Run the full desktop app (spins up Vite, opens a native Tauri window) |
| `bun run tauri build` | Build native installers for the **current** platform (see below) |

## Building native installers

`src-tauri/tauri.conf.json` restricts `bundle.targets` per platform so each OS only produces the installer formats people actually expect:

- **Ubuntu/Linux** → `.deb`
- **Windows** → `.msi` and `.exe` (NSIS)
- **macOS** → `.app` and `.dmg`

Run `bun run tauri build` on the target OS to produce its installer locally (output lands in `src-tauri/target/release/bundle/`). Cross-compiling from one OS to another isn't supported by Tauri — that's what CI is for.

### CI/CD

Two GitHub Actions workflows (at the repo root, `../.github/workflows/`) build the app for **Windows, Ubuntu, and macOS (Apple Silicon + Intel)**:

- **`build.yml`** — runs on every push/PR to `main`; uploads the installers as workflow artifacts (no release created).
- **`release.yml`** — runs when a `v*` tag is pushed; builds all platforms and publishes a **draft** GitHub Release with every installer attached.

## Notes

- Routing uses `HashRouter` on purpose — Tauri serves the frontend from a custom scheme, and a regular `BrowserRouter` would break navigation/refresh.
- Auth token and user info are stored in `localStorage`; the app has no server-side session.
