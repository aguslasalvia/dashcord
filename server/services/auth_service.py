from models.auth_model import *
from repositories import user_repository as ur
from core import web_token
from utils import verify_password


async def login(username: str, password: str) -> LoginReponse | None:
    # Seacrh only for username
    # bcrypt will compare password and hash
    user = await ur.login(username)
    # If there is a user
    # Checks if the password hashed is the same
    if user is not None and verify_password(password, user["password"]):
        token = web_token.create_token(username)
        return LoginReponse(token=token)
    return None
