from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import FileResponse

from backend.auth import router as auth_router, get_current_user
from backend.download import download_video

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

@app.get("/download")
def download(video_url: str, highres: bool = False, subtitles: bool = False, type: str = "Video"):
    return download_video(video_url, highres, subtitles, type)

@app.get("/get_vid/{video_hash}.{ext}")
def get_video(video_hash: str, ext: str):
    file_path = f"backend/tmp/{video_hash}.{ext}"
    try:
        return FileResponse(path=file_path, filename=f"{video_hash}.{ext}", media_type='application/octet-stream')
    except FileNotFoundError:
        return {"error": "File not found"}
