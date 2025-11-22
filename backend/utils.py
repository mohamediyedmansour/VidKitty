import os
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt


pwd = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


SECRET_KEY = os.getenv("SECRET_KEY", "devsecret")
ALGO = "HS256"




def hash_password(password: str):
    return pwd.hash(password)


def verify_password(password: str, hashed: str):
    return pwd.verify(password, hashed)


def create_jwt(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=2)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGO)


def decode_jwt(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
    except Exception:
        return None