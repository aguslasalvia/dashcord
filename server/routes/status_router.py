from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get('/state')
async def server_up():
    return JSONResponse({"state": "up"}, 200)
