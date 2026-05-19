import jwt
import datetime
from jwt import ExpiredSignatureError, InvalidTokenError
from core.config import get_jwt_secret


class JWT:
		def __init__(self) -> None:
				self.secret = get_jwt_secret()

		def create_token(self, username: str) -> str:
				payload = {
						"sub": username,
						"exp": datetime.datetime.utcnow() + datetime.timedelta(days=30),
						"iat": datetime.datetime.utcnow()
				}

				return jwt.encode(payload, self.secret, algorithm="HS256")

		def verify_token(self, token: str) -> str | None:
				# Decodifica y valida firma y expiración automáticamente
				payload = jwt.decode(token, self.secret, algorithms=["HS256"])

				# Si todo está bien, devuelve el subject (user_id, username, etc.)
				return payload.get("sub")


web_token = JWT()
