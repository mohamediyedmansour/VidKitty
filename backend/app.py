from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import FileResponse
import os

from auth import router as auth_router, get_current_user
from download import download_video
from utils import remove_file

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
def get_video(video_hash: str, ext: str, background_tasks: BackgroundTasks):
    file_path = f"backend/tmp/{video_hash}.{ext}"
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    
    background_tasks.add_task(remove_file, file_path)
    return FileResponse(
        path=file_path,
        filename=f"{video_hash}.{ext}",
        media_type='application/octet-stream'
    )
