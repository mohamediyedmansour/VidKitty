import yt_dlp
from typing import Any, Dict
from time import time

def download_video(video_url: str, highres: bool, subtitles: bool, type: str) -> str:
    type = type.lower()
    if type not in ["video", "audio"]:
        return {"error": "Invalid type, must be 'Video' or 'Audio'"}
    
    video_hash = abs(hash(video_url + str(highres) + str(subtitles) + str(int(time()))))
    
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
    else:  # audio
        ydl_opts.update({
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        })

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(video_url, download=True)
        video_ext = 'mp4' if type == 'video' else 'mp3'
        file_path = f"{video_hash}.{video_ext}"

    return {"file_path": file_path, "video_hash": video_hash, "ext": video_ext}
