from pydantic import BaseModel, Field

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginReponse(BaseModel):
    token: str

class RegisterRequest(BaseModel):
    username: str = Field(min_length=3)
    password: str = Field(min_length=6)

class RegisterResponse(BaseModel):
    token: str
