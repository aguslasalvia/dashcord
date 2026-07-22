from fastapi import APIRouter, Depends
from services import song_service as service
from utils import get_current_user
router = APIRouter()


@router.get('/search')
def search(q: str, limit: int = 25, current_user: dict = Depends(get_current_user)):
    return service.search_songs(q, limit)


@router.get('/stream-url')
def stream_url(id: str, current_user: dict = Depends(get_current_user)):
    return service.get_stream_url(id)