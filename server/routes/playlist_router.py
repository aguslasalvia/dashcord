from fastapi import Depends, APIRouter
from services import playlist_service as service
from fastapi.responses import JSONResponse, Response
from models import PlaylistDTO
from utils import get_current_user

router = APIRouter()


@router.get("/all")
async def get_all_user_playlists(current_user: dict = Depends(get_current_user)):
    playlists = await service.get_all_user_playlists(current_user)
    return playlists


@router.get("/playlist")
async def get_playlist_by_id(id: str, current_user: dict = Depends(get_current_user)):

    playlist = await service.get_playlist_by_id(id)
    if (playlist != None):
        return JSONResponse(playlist, 200)
    return JSONResponse(None, 404)


@router.patch("/add")
async def add_song_to_playlist(data: dict, current_user: dict = Depends(get_current_user)):
    response = await service.add_song_to_playlist(data['id'], data['song'])
    return 200


@router.post("/create")
async def create_new_playlist(playlist_req: PlaylistDTO, current_user: dict = Depends(get_current_user)):
    playlist_created = await service.create_new_playlist(playlist_req)
    if (playlist_created):
        return Response(status_code=201)
    return JSONResponse({"error": "Unable to create playlist"}, 400)


@router.get("/names")
async def get_playlist_names():
    playlists = await service.get_playlist_names()
    return playlists


@router.get("/songs")
async def get_playlist_songs_by_id(id: str, current_user: dict = Depends(get_current_user)):
    songs = await service.get_playlist_songs_by_id(id)
    return songs


@router.delete("/song")
async def delete_song_from_playlist(data: dict, current_user: dict = Depends(get_current_user)):
    response = await service.delete_song_from_playlist(data['playlist_id'], data['song_id'])
    if response:
        return Response(status_code=204)
    return JSONResponse({"error": "Unable to delete song from playlist"}, 400)


@router.delete("/playlist")
async def delete_playlist(id: str, current_user: dict = Depends(get_current_user)):
    response = await service.delete_playlist(id)
    if response:
        return Response(status_code=204)
    return JSONResponse({"error": "Unable to delete playlist"}, 400)
