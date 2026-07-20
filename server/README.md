# DashCord — Server

Backend API for DashCord: a **FastAPI** service that handles auth, playlist storage, and YouTube search, backed by **MongoDB**. Consumed by the [`client`](../client) desktop app.

> Looking for the desktop app or the repo overview? See [`../client/README.md`](../client/README.md) and [`../README.md`](../README.md).

## Tech stack

- **Python 3** + **FastAPI**, served via **Uvicorn**
- **MongoDB** via **Motor** (async driver)
- **PyJWT** for bearer-token auth, **bcrypt** for password hashing
- YouTube search via `yt-search` / `youtube-search-python`

## Project structure

```
server/
├── main.py                    # Entry point: tests DB connection, runs uvicorn
├── app.py                     # FastAPI app + router registration + CORS
├── core/
│   ├── config.py               # Reads env vars (Mongo URL, JWT/session secrets, host/port)
│   └── security.py             # JWT creation/verification
├── database/
│   └── mongo_database.py       # Motor client, `dashcord` DB, playlists/users collections
├── models/                     # Pydantic request/response + DTO models
├── repositories/               # Data-access layer (Mongo queries)
├── services/                   # Business logic, called by routes
├── routes/                     # FastAPI routers: auth, playlists, songs, status
├── utils/                      # get_current_user (JWT dependency), hashing, serialization
└── requirements.txt
```

Request flow: **routes** (HTTP layer, auth dependency) → **services** (business logic) → **repositories** (MongoDB access).

## Setup

Requires Python 3 and a running MongoDB instance (local or Atlas).

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `server/`:

```bash
MONGO_URL=mongodb://localhost:27017
SESSION_SECRET_KEY=change-me
JWT_SECRET_KEY=change-me-too
HOST=localhost
PORT=8000
```

## Running

```bash
python main.py
# or, for auto-reload during development:
uvicorn app:app --reload --host localhost --port 8000
```

The server checks the MongoDB connection on startup (`main.py`) and logs the result.

## API reference

All routes are mounted under `/api`. Endpoints under `playlists` and `songs` require a `Authorization: Bearer <token>` header (a JWT issued by `/api/auth/login`, valid 30 days).

### Auth

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/api/auth/login` | `{ username, password }` | Authenticates a user, returns a JWT |

### Playlists

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/playlists/all` | ✅ | All playlists |
| GET | `/api/playlists/playlist?id=<id>` | ✅ | Single playlist by ID |
| GET | `/api/playlists/names` | – | Names of all playlists |
| GET | `/api/playlists/songs?id=<id>` | ✅ | Songs in a playlist |
| POST | `/api/playlists/create` | ✅ | Create a playlist (body: playlist object) |
| PATCH | `/api/playlists/add` | ✅ | Add a song to a playlist — body: `{ id, song }` |
| DELETE | `/api/playlists/song` | ✅ | Remove a song — body: `{ playlist_id, song_id }` |

### Songs

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/songs/search?q=<query>` | ✅ | Search YouTube for videos matching the query |

### Status

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/status/state` | – | Health check — `{ "state": "up" }` |

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URL` | ✅ | MongoDB connection string |
| `SESSION_SECRET_KEY` | ✅ | Secret used for session signing |
| `JWT_SECRET_KEY` | ✅ | Secret used to sign/verify auth JWTs |
| `HOST` | – | Bind host (default `localhost`) |
| `PORT` | – | Bind port (default `8000`) |
