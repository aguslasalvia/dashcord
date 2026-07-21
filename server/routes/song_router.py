from fastapi import APIRouter, Depends
from services import song_service as service
from utils import get_current_user
router = APIRouter()


@router.get('/search')
async def search(q: str, current_user: dict = Depends(get_current_user)):
    return await service.search_songs(q)
    


@router.get('/stream-url')
async def stream_url(video_id:str,current_user:dict = Depends(get_current_user)):
    return service.get_audio_stream_url(video_id)