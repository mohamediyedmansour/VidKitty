import React, { useState, useEffect, useRef } from 'react';
import './VideoLinkPut.css';
import downloadIcon from '../../assets/Download.svg';
import lolCatLoading from '../../assets/LolCatLoading.gif';
import { useAuth } from '../../state/AuthContext';

const VideoLinkPut: React.FC = () => {
  const { isLoggedIn, getToken } = useAuth();
  const [videoLink, setVideoLink] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [finishedFile, setFinishedFile] = useState<string | null>(null);
  const [finishedVisible, setFinishedVisible] = useState(false);
  const [mode, setMode] = useState<'video' | 'audio'>('video');
  const [subtitles, setSubtitles] = useState(false);
  const [quality, setQuality] = useState<'high' | 'low'>('high');
  const wsRef = useRef<WebSocket | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  useEffect(() => {
    let timer: number | undefined;
    if (errorMessage) {
      timer = window.setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [errorMessage]);

  // WebSocket will drive progress updates; no fake interval needed

  const isValidUrl = (url: string) => {
    // Simple URL validation regex
    return /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/\S*)?$/.test(url);
  };

  // If user switches to audio mode, disable subtitles automatically
  React.useEffect(() => {
    if (mode === 'audio') {
      setSubtitles(false);
    }
  }, [mode]);

  const handleDownload = () => {
    if (!isLoggedIn) {
      setErrorMessage('Please log in to download videos.');
      return;
    }

    if (!videoLink || !isValidUrl(videoLink)) {
      setErrorMessage('Please enter a valid link.');
      return;
    }

    setErrorMessage(null);
    setFinishedFile(null);
    setProgress(0);
    setStatusText('Connecting...');

    const token = getToken();
    if (!token) {
      setErrorMessage('Missing auth token. Please log in again.');
      return;
    }

    const params = new URLSearchParams({
      video_url: videoLink,
      type: mode === 'audio' ? 'Audio' : 'Video',
      highres: quality === 'high' ? 'true' : 'false',
      subtitles: subtitles ? 'true' : 'false',
      token,
    });
    const baseUrl = import.meta.env.VITE_API_URL as string;
    const wsUrl = `${baseUrl.replace(/^http/, 'ws')}/ws/download?${params.toString()}`;
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WS connected');
        setDownloading(true);
        setStatusText('Downloading...');
      };

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.status === 'heartbeat') return;

          if (data.status === 'downloading') {
            const pct = Number(data.progress_percent ?? data.progress ?? 0);
            setProgress(Math.min(100, Math.round(pct)));
            setStatusText('Downloading...');
            return;
          }

          if (data.status === 'finished_encoding') {
            setStatusText('Finalizing...');
            return;
          }

          if (data.status === 'finished') {
            const file = data.file_path || data.filename || null;
            if (file) {
              setFinishedFile(file);
              // ensure we show the finished button with animation after it mounts
              setTimeout(() => setFinishedVisible(true), 10);
              setStatusText('Completed');
            }
            setProgress(100);
            setDownloading(false);
            ws.close();
            wsRef.current = null;
            return;
          }

          if (data.status === 'error') {
            setErrorMessage(data.message || 'Download error');
            setDownloading(false);
            setStatusText(null);
            ws.close();
            wsRef.current = null;
            return;
          }
        } catch (err) {
          console.error('Invalid WS message', err);
        }
      };

      ws.onerror = (err) => {
        console.error('WS error', err);
        setErrorMessage('WebSocket error. See console for details.');
        setDownloading(false);
        setStatusText(null);
        ws.close();
        wsRef.current = null;
      };

      ws.onclose = () => {
        console.log('WS closed');
        setStatusText((s) => (s === 'Completed' ? s : 'Connection closed'));
        setDownloading(false);
        wsRef.current = null;
      };
    } catch (err) {
      console.error('Failed to open WS', err);
      setErrorMessage('Failed to start download.');
    }
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return (
    <div className="video-link-put">
      {!downloading && (
        <>
          <div className="input-container">
            <input
              type="text"
              placeholder="Paste your video link here..."
              value={videoLink}
              onChange={(e) => {
                setVideoLink(e.target.value);
                if (errorMessage && e.target.value) setErrorMessage(null);
              }}
            />
            <button className="download-btn" onClick={handleDownload}>
              <img src={downloadIcon} className="download-icon" alt="Download" />
              Download
            </button>
          </div>
          <div className="switches-container">
            <div className="segment-group">
              <div className="segment-label">Mode</div>
              <div className="segment">
                <button
                  className={mode === 'video' ? 'segment-btn active' : 'segment-btn'}
                  onClick={() => setMode('video')}
                >
                  Video
                </button>
                <button
                  className={mode === 'audio' ? 'segment-btn active' : 'segment-btn'}
                  onClick={() => setMode('audio')}
                >
                  Audio
                </button>
              </div>
            </div>

            {mode !== 'audio' && (
              <div className="toggle-group">
                <div className="segment-label">Subtitles</div>
                <label className="vk-toggle">
                  <input
                    type="checkbox"
                    checked={subtitles}
                    onChange={(e) => setSubtitles(e.target.checked)}
                    aria-label="Toggle subtitles"
                  />
                  <span className="vk-toggle-track">
                    <span className="vk-toggle-knob" />
                  </span>
                </label>
              </div>
            )}

            {mode !== 'audio' && (
              <div className="segment-group">
                <div className="segment-label">Quality</div>
                <div className="segment">
                  <button
                    className={quality === 'high' ? 'segment-btn active' : 'segment-btn'}
                    onClick={() => setQuality('high')}
                  >
                    High
                  </button>
                  <button
                    className={quality === 'low' ? 'segment-btn active' : 'segment-btn'}
                    onClick={() => setQuality('low')}
                  >
                    Low
                  </button>
                </div>
              </div>
            )}
          </div>
          {errorMessage && <div className="input-error">{errorMessage}</div>}
        </>
      )}

      {downloading && (
        <div className="downloading-state">
          <img src={lolCatLoading} alt="Loading..." />

          <span className="progress">{Math.min(progress, 100)}%</span>
          <div className="status-text">{statusText}</div>
        </div>
      )}

      {finishedFile && (
        <div className={`finished-state ${finishedVisible ? 'visible' : 'hidden'}`}>
          <a
            className="download-btn"
            href={`${window.location.protocol}//${window.location.hostname}:8000/get_vid/${finishedFile}`}
            download
            onClick={() => {
              // animate out then remove
              setFinishedVisible(false);
              setTimeout(() => setFinishedFile(null), 500);
            }}
          >
            <img src={downloadIcon} className="download-icon" alt="Download" />
            Download file
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoLinkPut;
