# 🎧 DashCord

**DashCord** is a cross-platform desktop app for managing YouTube playlists — search songs, build playlists, and play them back — backed by a local FastAPI + MongoDB server, with optional integration into a companion [Discord music bot](https://github.com/AgusLasalvia/bandicoot-discord-bot.git).

## Repo layout

This is a monorepo with two parts. **Each folder has its own README with the full details** (setup, scripts, environment variables, project structure) — start there.

```
DashCord/
├── client/   # Desktop app: React 19 + Vite, packaged with Tauri v2 (Windows, macOS, Linux)
│             # → see client/README.md
├── server/   # Backend API: Python + FastAPI + MongoDB, JWT auth
│             # → see server/README.md
└── .github/  # CI: builds & releases the desktop app for Windows/Ubuntu/macOS
```

- 🖥️ **[`client/`](./client) — desktop app.** Read [`client/README.md`](./client/README.md).
- 🐍 **[`server/`](./server) — backend API.** Read [`server/README.md`](./server/README.md).

## Quick start

```bash
git clone https://github.com/AgusLasalvia/DashCord.git
cd DashCord

# 1. backend — full instructions in server/README.md
cd server
pip install -r requirements.txt
# create a .env with MONGO_URL, SESSION_SECRET_KEY, JWT_SECRET_KEY (see server/README.md)
python main.py

# 2. desktop app — full instructions in client/README.md
cd ../client
bun install
bun run tauri dev
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

## License

See [LICENSE](./LICENSE).
