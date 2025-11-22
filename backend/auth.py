from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from utils import verify_password, hash_password, create_jwt, decode_jwt


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


fake_db = {"test@example.com": hash_password("password123")}


@router.post("/register")
def register(email: str, password: str):
    if email in fake_db:
        raise HTTPException(status_code=400, detail="Email already exists")
    fake_db[email] = hash_password(password)
    return {"message": "User registered"}


@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    email = form.username
    password = form.password


    if email not in fake_db or not verify_password(password, fake_db[email]):
        raise HTTPException(status_code=401, detail="Invalid credentials")


    token = create_jwt({"sub": email})
    return {"access_token": token, "token_type": "bearer"}




def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_jwt(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload