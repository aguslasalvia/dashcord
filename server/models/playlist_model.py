from pydantic import BaseModel
from typing import List
from .song_model import Song


class PlaylistDTO(BaseModel):
    _id: str | None
    name: str
    created_by: str
    songs: List[Song]


class PlaylistUpdateDTO(BaseModel):
    _id: str
    song: Song
