from fastapi import HTTPException
import yt_dlp
from typing import Any, Dict
from time import time
from utils import schedule_autodelete

def download_video(video_url: str, highres: bool, subtitles: bool, type: str) -> Dict[str, Any]:
    type = type.lower()
    if type not in ["video", "audio"]:
        raise HTTPException(status_code=400, detail="Invalid type, must be 'video' or 'audio'")
    
    video_hash = abs(hash(video_url + str(highres) + str(subtitles) + str(int(time()))))
    
    with yt_dlp.YoutubeDL({}) as ydl:
        try:
            info = ydl.extract_info(video_url, download=False)
            duration = info.get('duration', 0)
            if duration > 600:
                raise HTTPException(status_code=400, detail="Video is longer than 10 minutes.")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Video is longer than 10 minutes.")
    
    ydl_opts: Dict[str, Any] = {
        'outtmpl': f'backend/tmp/{video_hash}.%(ext)s',
    }

    if type == "video":
        ydl_opts['format'] = 'bestvideo+bestaudio/best' if highres else 'best'
        ydl_opts['merge_output_format'] = 'mp4'
        if subtitles:
            ydl_opts['writesubtitles'] = True
            ydl_opts['subtitleslangs'] = ['en']
            ydl_opts['subtitleformat'] = 'srt'
    else:  
        ydl_opts.update({
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        })

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])
        video_ext = 'mp4' if type == 'video' else 'mp3'
        file_path = f"{video_hash}.{video_ext}"
        full_path = f"backend/tmp/{file_path}"
        schedule_autodelete(full_path, delay_seconds=300)


    return {"file_path": file_path, "video_hash": video_hash, "ext": video_ext}
