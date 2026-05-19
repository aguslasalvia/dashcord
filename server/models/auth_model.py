from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginReponse(BaseModel):
    token: str
