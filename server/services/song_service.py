from youtube.search import search_video_urls
from youtube.stream import get_audio_stream_url


async def search_songs(query: str, limit: int = 25):
    return await search_video_urls(query, limit=limit)


def get_stream_url(video_id: str):
    return get_audio_stream_url(video_id)