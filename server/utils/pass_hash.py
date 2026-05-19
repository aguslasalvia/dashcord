import bcrypt

def create_password_hash(password: str) -> str:
    hash_bytes = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hash_bytes.decode("utf-8")


def verify_password(password: str, hash_str: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hash_str.encode("utf-8"))
