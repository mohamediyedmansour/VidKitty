import React, { useState, useEffect } from 'react';
import './VideoLinkPut.css';
import downloadIcon from '../../assets/Download.svg';
import lolCatLoading from '../../assets/LolCatLoading.gif';
import { useAuth } from '../../state/AuthContext';

const VideoLinkPut: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [videoLink, setVideoLink] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<'video' | 'audio'>('video');
  const [subtitles, setSubtitles] = useState(false);
  const [quality, setQuality] = useState<'high' | 'low' | false>('high');
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

  useEffect(() => {
    let interval: number;
    if (downloading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setDownloading(false);
            return 100;
          }
          return prev + Math.floor(Math.random() * 10) + 5; // random increment
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [downloading]);

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

  // Also clear quality when switching to audio
  React.useEffect(() => {
    if (mode === 'audio') {
      setQuality(false);
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
    // In a real app we'd send `videoLink` and the options below to the backend
    // For now we just kick off the fake progress UI
    console.log('Download options:', { videoLink, mode, subtitles, quality });
    setDownloading(true);
  };

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
        </div>
      )}
    </div>
  );
};

export default VideoLinkPut;
