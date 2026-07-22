from youtube.search import search_video_urls
from youtube.stream import get_audio_stream_url
from models import StreamUrlResponse


def search_songs(query: str, limit: int = 25):
    return search_video_urls(query, limit=limit)


def get_stream_url(video_id: str):
    return StreamUrlResponse(url=get_audio_stream_url(video_id))