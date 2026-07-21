import yt_dlp
from typing import Optional


def get_audio_stream_url(video_id: str) -> Optional[str]:
    ydl_opts = {
        "format": "bestaudio/best",
        "quiet": True,
        "noplaylist": True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(
                f"https://www.youtube.com/watch?v={video_id}",
                download=False,
            )
            return info["url"]
    except Exception:
        return None