from fastapi import APIRouter, HTTPException
from services import auth_service as service
from models.auth_model import *

router = APIRouter()

@router.post('/login')
async def login(login_req: LoginRequest, response_model=list[LoginReponse]):
    if login_req.username != '' and login_req.password != '':
        response = await service.login(login_req.username, login_req.password)
        if response is not None:
            return response
        else:
            raise HTTPException(status_code=404, detail="User Not Found")

    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@router.post('/register')
async def register(register_req: RegisterRequest, response_model=RegisterResponse):
    response = await service.register(register_req.username, register_req.password)
    if response is not None:
        return response
    else:
        raise HTTPException(status_code=409, detail="Username already taken")
