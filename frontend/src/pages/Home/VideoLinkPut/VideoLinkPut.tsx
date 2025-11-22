import React, { useState, useEffect } from 'react';
import './VideoLinkPut.css';
import downloadIcon from '../../../assets/Download.svg';
import lolCatLoading from '../../../assets/LolCatLoading.gif';

const VideoLinkPut: React.FC = () => {
  const [videoLink, setVideoLink] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    let timer: number | undefined;
    if (showError) {
      timer = window.setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [showError]);

  useEffect(() => {
    let interval: NodeJS.Timer;
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

  const handleDownload = () => {
    if (!videoLink) {
      setShowError(true);
      return;
    }
    setShowError(false);
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
                if (showError && e.target.value) setShowError(false);
              }}
            />
            <button className="download-btn" onClick={handleDownload}>
              <img src={downloadIcon} className="download-icon" alt="Download" />
              Download
            </button>
          </div>
          {showError && <div className="input-error">Pweaaasseee input a link!</div>}
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
