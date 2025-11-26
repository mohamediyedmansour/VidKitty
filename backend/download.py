from fastapi import HTTPException
import yt_dlp
from typing import Any, Dict
from time import time
from utils import schedule_autodelete
from queue import Queue

def download_video(video_url: str, highres: bool, subtitles: bool, type: str) -> Dict[str, Any]:
    """Existing synchronous download function (kept for compatibility)."""
    type = type.lower()
    if type not in ["video", "audio"]:
        raise HTTPException(status_code=400, detail="Invalid type, must be 'video' or 'audio'")

    video_hash = abs(hash(video_url + str(highres) + str(subtitles) + str(int(time()))))

    with yt_dlp.YoutubeDL({}) as ydl:
        try:
            info = ydl.extract_info(video_url, download=False)
            duration = info.get('duration') or 0
            if duration > 600:
                raise HTTPException(status_code=400, detail="Video is longer than 10 minutes.")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Video is longer than 10 minutes.")

    # Set outtmpl explicitly so final filename is deterministic
    if type == "video":
        out_ext = "mp4"
        outtmpl = f'backend/tmp/{video_hash}.{out_ext}'
    else:
        out_ext = "mp3"
        # For audio, don't include extension in outtmpl - postprocessor will add it
        outtmpl = f'backend/tmp/{video_hash}'

    ydl_opts: Dict[str, Any] = {
        'outtmpl': outtmpl,
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

        # We set the outtmpl to the desired final extension, so return that deterministic name
        video_ext = out_ext
        file_path = f"{video_hash}.{video_ext}"
        full_path = f"backend/tmp/{file_path}"

        schedule_autodelete(full_path, delay_seconds=300)

    return {"file_path": file_path, "video_hash": video_hash, "ext": video_ext}


def run_download_thread(video_url: str, highres: bool, subtitles: bool, type: str, out_queue: Queue) -> None:
    """Run a yt_dlp download in a background thread and push progress dicts into `out_queue`.

    Progress dicts have keys like:
      - status: 'downloading'|'finished'|'error'
      - downloaded_bytes, total_bytes, progress_percent
      - fragment_index, fragment_count
      - eta (seconds)
      - file_path, video_hash, ext (on finish)
    """
    type = type.lower()
    try:
        video_hash = abs(hash(video_url + str(highres) + str(subtitles) + str(int(time()))))

        def progress_hook(d: Dict[str, Any]):
            try:
                status = d.get("status")

                if status == "downloading":

                    # NORMAL DOWNLOAD (known total size)
                    downloaded = d.get("downloaded_bytes") or 0
                    total = d.get("total_bytes") or d.get("total_bytes_est") or 0

                    if total > 0:
                        percent = round(downloaded / total * 100, 2)
                        out_queue.put({
                            "status": "downloading",
                            "downloaded_bytes": downloaded,
                            "total_bytes": total,
                            "progress_percent": percent,
                            "eta": d.get("eta"),
                        })
                        return

                    # HLS / FRAGMENTED DOWNLOAD (YouTube)
                    frag_index = d.get("fragment_index")
                    frag_count = d.get("fragment_count")

                    if frag_index is not None and frag_count:
                        # percent based on fragments
                        percent = round((frag_index / frag_count) * 100, 2)

                        # estimate ETA
                        elapsed = d.get("elapsed") or 0
                        if frag_index > 0:
                            avg_frag_time = elapsed / frag_index
                            remaining = frag_count - frag_index
                            eta = round(avg_frag_time * remaining, 2)
                        else:
                            eta = None

                        out_queue.put({
                            "status": "downloading",
                            "fragment_index": frag_index,
                            "fragment_count": frag_count,
                            "progress_percent": percent,
                            "eta": eta,
                        })
                        return

                # FINISHED DOWNLOADING A FILE
                elif status == "finished":
                    out_queue.put({
                        "status": "finished_encoding",
                        "filename": d.get("filename"),
                    })

            except Exception as e:
                out_queue.put({"status": "error", "message": f"Hook error: {str(e)}"})

        # yt-dlp options
        # Set outtmpl explicitly so final filename is deterministic
        if type == "video":
            out_ext = "mp4"
            outtmpl = f"backend/tmp/{video_hash}.{out_ext}"
        else:
            out_ext = "mp3"
            # For audio, don't include extension in outtmpl - postprocessor will add it
            outtmpl = f"backend/tmp/{video_hash}"

        ydl_opts: Dict[str, Any] = {
            "outtmpl": outtmpl,
            "progress_hooks": [progress_hook],
            "noplaylist": True,
        }

        if type == "video":
            ydl_opts["format"] = "bestvideo+bestaudio/best" if highres else "best"
            ydl_opts["merge_output_format"] = "mp4"
            if subtitles:
                ydl_opts["writesubtitles"] = True
                ydl_opts["subtitleslangs"] = ["en"]
                ydl_opts["subtitleformat"] = "srt"
        else:
            ydl_opts.update({
                "format": "bestaudio/best",
                "postprocessors": [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }]
            })

        # Start yt-dlp
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            try:
                info = ydl.extract_info(video_url, download=False)
                duration = info.get("duration") or 0
                if duration > 600:
                    out_queue.put({"status": "error", "message": "Video is longer than 10 minutes."})
                    return
            except Exception:
                out_queue.put({"status": "error", "message": "Could not extract video info."})
                return

            try:
                ydl.download([video_url])
            except Exception as e:
                out_queue.put({"status": "error", "message": f"Download error: {str(e)}"})
                return

        # Completed: we used a deterministic outtmpl, so return that filename
        video_ext = out_ext
        file_path = f"{video_hash}.{video_ext}"
        full_path = f"backend/tmp/{file_path}"

        schedule_autodelete(full_path, delay_seconds=300)

        out_queue.put({
            "status": "finished",
            "file_path": file_path,
            "video_hash": video_hash,
            "ext": video_ext
        })

    except Exception as e:
        out_queue.put({"status": "error", "message": f"Unexpected error: {str(e)}"})
