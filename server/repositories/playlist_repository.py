from database import db
from bson import ObjectId
from models import PlaylistDTO
from models import Song
from typing import Optional


async def get_all_playlists():
    playlists = await db.playlist_collection.find({}).to_list()
    return [await fix_mongo_id(p) for p in playlists]


async def get_playlist_by_id(id: str):
    playlist = await db.playlist_collection.find_one({
        "_id": ObjectId(id)
    })
    return await fix_mongo_id(playlist)


async def create_new_playlist(playlist: PlaylistDTO):
    create = await db.playlist_collection.insert_one({
        "name": playlist.name,
        "created_by": playlist.created_by,
        "songs": []
    })

    result = await get_playlist_by_id(str(create.inserted_id))

    if (result):
        return True

    return False


async def add_song_to_playlist(song: Song, playlist_id: str):
    update = await db.playlist_collection.update_one(
        {"_id": ObjectId(playlist_id)},
        {"$addToSet": {"songs": song}}
    )


async def get_playlist_only_name():
    playlists = await db.playlist_collection.find(
        {},
        {"_id": 1, "name": 1}
    ).to_list()

    return [await fix_mongo_id(p) for p in playlists]


async def get_playlist_songs_by_playlist_id(id: str):
    playlist = await db.playlist_collection.find_one(
        {"_id": ObjectId(id)},
        {"songs": 1, "_id": 0}
    )

    return playlist.get("songs", []) if playlist else []


async def delete_song_from_playlist(playlist_id: str, song_id: str):
    await db.playlist_collection.update_one(
        {"_id": ObjectId(playlist_id)},
        {"$pull": {"songs": {"youtube_id": song_id}}}
    )

    return True


async def fix_mongo_id(doc: Optional[dict]) -> Optional[dict]:

    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])

    if doc and "songs" in doc and doc["songs"] and len(doc["songs"]) > 0:
        first_song = doc["songs"][0]
        youtube_id = first_song.get("youtube_id")
        if youtube_id:
            doc["cover"] = f"https://img.youtube.com/vi/{youtube_id}/hqdefault.jpg"
    return doc
