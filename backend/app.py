from fastapi import FastAPI, Depends, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import FileResponse
import os
import asyncio

from auth import router as auth_router, get_current_user
from download import download_video, run_download_thread
from queue import Queue, Empty
from threading import Thread
from utils import remove_file

app = FastAPI(title="VidKitty API", version="1.0.0")

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
def download(video_url: str, highres: bool = False, subtitles: bool = False, type: str = "Video", user: dict = Depends(get_current_user)):
    return download_video(video_url, highres, subtitles, type)


@app.websocket("/ws/download")
async def websocket_download(websocket: WebSocket, video_url: str, highres: bool = False, subtitles: bool = False, type: str = "Video"):
    await websocket.accept()
    q: Queue = Queue()
    
    thread = Thread(target=run_download_thread, args=(video_url, highres, subtitles, type, q), daemon=True)
    thread.start()

    try:
        while True:
            try:
                msg = await asyncio.to_thread(q.get, True, 0.5)
            except Exception:
                await websocket.send_json({"status": "heartbeat"})
                await asyncio.sleep(0.1)  # let event loop run
                continue

            await websocket.send_json(msg)
            await asyncio.sleep(0)  # yield back to loop

            if msg.get("status") in ("finished", "error"):
                break

    except WebSocketDisconnect:
        return
    finally:
        try:
            await websocket.close()
        except:
            pass


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
