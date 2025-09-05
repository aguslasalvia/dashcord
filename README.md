# 🎧 DashCord

> **Your cross-platform desktop dashboard for managing YouTube playlists, powered by Tauri, FastAPI, and MongoDB.**

---

## ✨ What is DashCord?

**DashCord** is a modern desktop application that lets you manage, search, and store YouTube playlists locally—no cloud required! Seamlessly integrated with a [Discord music bot](https://github.com/AgusLasalvia/bandicoot-discord-bot.git), DashCord empowers you to:

- 🎵 Organize your favorite YouTube tracks into playlists
- 🔍 Search for new music and videos
- 💾 Keep your data private and local (MongoDB)
- 🤖 Control your Discord bot’s music queue
- 🖥️ Enjoy a fast, cross-platform experience (Windows, macOS, Linux)

All with a beautiful, lightweight interface built on Next.js and Tauri.

---

## 🚀 Features

- 🎼 **Playlist Management:** Create, edit, and delete YouTube playlists
- 🔎 **YouTube Search:** Find songs and videos via the YouTube Search API
- 🤖 **Discord Bot Integration:** Sync with your Discord music bot
- 💽 **Local Storage:** All data is stored locally using MongoDB
- ⚡ **FastAPI Backend:** High-performance Python API
- 🖥️ **Cross-Platform Desktop:** Built with Tauri for native speed
- 🌙 **Modern Frontend:** Next.js (client-side only)

---

## 🧩 Tech Stack (Monorepo)

- **Frontend:**
  - ⚛️ Next.js (React, TypeScript)
  - 🎨 CSS Modules
  - 🦀 Tauri (Rust-powered desktop framework)
- **Backend:**
  - 🐍 Python 3 + FastAPI
  - 🍃 MongoDB (local or Atlas)
- **Integration:**
  - 🤖 Discord Bot ([bandicoot-discord-bot](https://github.com/AgusLasalvia/bandicoot-discord-bot.git))
  - 🔍 YouTube Search API
- **Other:**
  - 🛠️ Monorepo structure (client + python backend)
  - 📦 Modern package management (npm, pip)

---

## 📡 API Endpoints

All endpoints return JSON and use standard HTTP status codes (e.g., 200 OK, 404 Not Found, 401 Unauthorized). Authentication is required for most endpoints.

### 🎵 Playlist Endpoints

- **GET `/playlists/all`**
  - Returns all playlists for the authenticated user.
- **GET `/playlists/playlist?id=<playlist_id>`**
  - Returns a single playlist by its unique ID.
- **PATCH `/playlists/add`**
  - Add a song to a playlist. Body: `{ id: <playlist_id>, song: <song_object> }`
- **POST `/playlists/create`**
  - Create a new playlist. Body: Playlist object.
- **GET `/playlists/names`**
  - Returns the names of all playlists.
- **GET `/playlists/songs?id=<playlist_id>`**
  - Returns all songs in a playlist.
- **DELETE `/playlists/song`**
  - Remove a song from a playlist. Body: `{ playlist_id, song_id }`

### 🔍 Song Endpoints

- **GET `/songs/search?q=<search_term>`**
  - Search YouTube for videos matching the query.

### 🔐 Auth Endpoints

- **POST `/auth/login`**
  - Authenticate a user. Body: `{ username, password }`

### 🩺 Status Endpoint

- **GET `/status/state`**
  - Check if the server is running.

---

## ⚙️ Environment Variables

Set these in a `.env` file in the `python` directory:

- `MONGODB_URI` — MongoDB connection string
- `SECRET_KEY` — Secret key for authentication/token signing

---

## 🛠️ Getting Started

```bash
# Clone the repo
$ git clone https://github.com/AgusLasalvia/DashCord.git
$ cd DashCord

# Backend setup
$ cd python
$ pip install -r requirements.txt
$ cp .env.example .env
# Edit .env with your variables
$ uvicorn main:app --reload

# Frontend setup
$ cd ../client
$ npm install
$ npm run dev

# To run as a desktop app (Tauri)
$ npm run tauri dev
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

