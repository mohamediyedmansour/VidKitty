import React, { useState, useEffect, useRef } from 'react';
import './CatWidget.css';

// Import all GIFs
import catRunX2 from '../../../assets/CatWidget/catrunx2.gif';
import catRunX4 from '../../../assets/CatWidget/catrunx4.gif';
import catSpritesOriginal from '../../../assets/CatWidget/catspritesoriginal.gif';
import catSpritesX2 from '../../../assets/CatWidget/catspritesx2.gif';
import catSpritesX4 from '../../../assets/CatWidget/catspritesx4.gif';
import catWalkX2 from '../../../assets/CatWidget/catwalkx2.gif';
import catWalkX4 from '../../../assets/CatWidget/catwalkx4.gif';

const catGIFs = [
  catRunX2,
  catRunX4,
  catSpritesOriginal,
  catSpritesX2,
  catSpritesX4,
  catWalkX2,
  catWalkX4,
];

const petLines = [
  'nya~',
  'pet me again!!',
  'I am smol kitty',
  'purr purr purr',
  '✨ meow ✨',
  'I like u hooman',
  'give treats pls',
];

const ouchLines = ['ouch!! >:(', 'bad hooman!!', 'hey!!', 'no hit >:c'];

export default function CatWidget() {
  const [bubble, setBubble] = useState('');
  const [heart, setHeart] = useState(false);
  const [gifIndex, setGifIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Randomly cycle GIFs every 10s for fun
  useEffect(() => {
    const interval = setInterval(() => {
      setGifIndex((i) => (i + 1) % catGIFs.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Eyes follow cursor
  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const eyes = document.querySelectorAll('.eye');
      eyes.forEach((eye) => {
        const rect = (eye as HTMLElement).getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        const angle = Math.atan2(y, x);
        const move = 3;
        const pupil = (eye as HTMLElement).querySelector('::after');
        (eye as HTMLElement).style.transform =
          `translate(${Math.cos(angle) * move}px, ${Math.sin(angle) * move}px)`;
      });
    }
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Pet (left click)
  function handlePet() {
    setHeart(true);
    setBubble(petLines[Math.floor(Math.random() * petLines.length)]);
    setTimeout(() => setHeart(false), 900);
    setTimeout(() => setBubble(''), 1900);
  }

  function handleHit(e: React.MouseEvent) {
    e.preventDefault();
    setBubble(ouchLines[Math.floor(Math.random() * ouchLines.length)]);
    if (containerRef.current) {
      containerRef.current.style.transform = 'translateY(-6px) scale(0.9)';
      setTimeout(() => {
        if (containerRef.current) containerRef.current.style.transform = 'translateY(0) scale(1)';
      }, 200);
    }
    setTimeout(() => setBubble(''), 1500);
  }

  return (
    <div className="cat-widget-root">
      <div
        className="cat-container"
        ref={containerRef}
        onClick={handlePet}
        onContextMenu={handleHit}
      >
        <img src={catGIFs[gifIndex]} className="cat-gif" alt="pixel cat" />
        <div className="cat-eyes">
          <div className="eye eye-left"></div>
          <div className="eye eye-right"></div>
        </div>
        {heart && <div className="heart">❤</div>}
        {bubble && <div className="cat-bubble">{bubble}</div>}
      </div>
    </div>
  );
}
