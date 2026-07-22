from pydantic import BaseModel


class Song(BaseModel):
    title: str
    youtube_id: str


class SongSearchResult(BaseModel):
    id: str
    title: str
    thumbnail: str
    duration: str


class StreamUrlResponse(BaseModel):
    url: str
