from models.auth_model import *
from repositories import user_repository as ur
from core import web_token
from utils import verify_password, create_password_hash


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


async def register(username: str, password: str) -> RegisterResponse | None:
    existing_user = await ur.login(username)
    if existing_user is not None:
        return None

    password_hash = create_password_hash(password)
    await ur.create_user(username, password_hash)

    token = web_token.create_token(username)
    return RegisterResponse(token=token)
