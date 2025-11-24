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
    setDownloading(true);
  };

  return (
    <div className="video-link-put">
      {!downloading && (
        <>
          <h1 className="title">Video Downloader</h1>
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
