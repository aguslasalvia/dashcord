from repositories import playlist_repository as pr
from models import Song


async def get_all_playlists():
    playlists = await pr.get_all_playlists()
    if playlists is None:
        return []
    return playlists


async def get_playlist_by_id(id: str):
    return await pr.get_playlist_by_id(id)


async def create_new_playlist(playlist):
    return await pr.create_new_playlist(playlist)


async def add_song_to_playlist(id: str, song: Song):
    return await pr.add_song_to_playlist(song, id)


async def get_playlist_names():
    return await pr.get_playlist_only_name()


async def get_playlist_songs_by_id(id: str):
    return await pr.get_playlist_songs_by_playlist_id(id)


async def delete_song_from_playlist(playlist_id: str, song_id: str):
		return await pr.delete_song_from_playlist(playlist_id, song_id)