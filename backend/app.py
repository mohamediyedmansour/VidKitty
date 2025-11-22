from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router, get_current_user


app = FastAPI(title="Project API")


app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)


app.include_router(auth_router, prefix="/auth", tags=["auth"])


@app.get("/protected")
def protected_route(user: dict = Depends(get_current_user)):
    return {"message": "You are authorized", "user": user}