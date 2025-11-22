import React from 'react';
import animeBackground from '../../../assets/anime_background.png';
import VideoLinkPut from '../VideoLinkPut/VideoLinkPut';

const Hero: React.FC = () => {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
        background: '#222',
      }}
    >
      <img
        src={animeBackground}
        alt="Anime Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: '"Press Start 2P", cursive',
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: '3rem',
            marginBottom: '1rem',
            color: '#000000ff',
          }}
        >
          Welcome to VidKitty
        </h1>

        <p
          style={{
            fontFamily: '"Press Start 2P", cursive',
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: '1rem',
            marginBottom: '1rem',
            color: '#000000ff',
            paddingTop: '15px',
            paddingBottom: '10px',
          }}
        >
          <span role="img" aria-label="sparkles">
            ✨✨
          </span>{' '}
          {
            [
              'Paste a link real quick — VidKitty does the trick.',
              'Any site, any byte — VidKitty gets it right.',
              'Drop the URL, ring the bell — VidKitty saves it well.',
              'From YouTube to you know who — VidKitty downloads it too.',
              'If it moves on-screen, VidKitty makes it clean.',
              'If it has a link, VidKitty makes it sync.',
              'Every platform, any format — VidKitty’s got your back.',
              'If it plays, it slays — VidKitty downloads it anyways.',
              'From vids to bits, VidKitty never quits.',
              'Click, fetch, done — VidKitty gets every one.',
              'If the internet streams it, VidKitty redeems it.',
              'Stream, scream, or meme — VidKitty grabs the whole scene.',
            ][Math.floor(Math.random() * 12)]
          }{' '}
          <span role="img" aria-label="sparkles">
            ✨✨
          </span>
        </p>
        <VideoLinkPut />
      </div>
    </section>
  );
};

export default Hero;
