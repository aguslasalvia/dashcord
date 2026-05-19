from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import *

app = FastAPI()

app.include_router(auth_router, prefix='/api/auth', tags=['Auth'])
app.include_router(playlist_router, prefix="/api/playlists", tags=['Playlist'])
app.include_router(song_router, prefix="/api/songs", tags=["Song"])
app.include_router(status_router, prefix="/api/status", tags=["Status"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
