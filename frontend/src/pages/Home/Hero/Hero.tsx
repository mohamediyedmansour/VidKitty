import React from 'react';
import animeBackground from '../../../assets/anime_background.png';

const Hero: React.FC = () => {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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

        <p>Your hub for anime videos</p>
      </div>
    </section>
  );
};

export default Hero;
