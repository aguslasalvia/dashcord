from pydantic import BaseModel


class Song(BaseModel):
    title: str
    youtube_id: str
