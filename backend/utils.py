import os
import threading
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
    
def remove_file(file_path: str):
    if os.path.exists(file_path):
        os.remove(file_path)

def schedule_autodelete(file_path: str, delay_seconds: int = 300):
    def _del_if_exists():
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception:
            # swallow any exception here to avoid crashing the timer thread
            pass

    timer = threading.Timer(delay_seconds, _del_if_exists)
    timer.daemon = True
    timer.start()
    return timer
