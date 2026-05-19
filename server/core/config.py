import os
from dotenv import load_dotenv

load_dotenv()


def get_secret_key() -> str:
    secret_key = os.getenv("SESSION_SECRET_KEY")
    if not secret_key:
        raise ValueError("No secret key set")
    return secret_key


def get_mongo_url() -> str:
    mongo_uri = os.getenv("MONGO_URL")
    if not mongo_uri:
        raise ValueError("No MongoDB URI set")
    return mongo_uri


def get_jwt_secret() -> str:
    jwt_secret = os.getenv("JWT_SECRET_KEY")
    if not jwt_secret:
        raise ValueError("No JWT Secret set")
    return jwt_secret
