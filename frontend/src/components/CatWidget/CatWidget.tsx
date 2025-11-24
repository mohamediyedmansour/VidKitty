import React, { useState, useRef } from 'react';
import './CatWidget.css';
import tomTheCat from '../../assets/CatWidget/tomthecat.gif';

const sleepyLines = [
  'Stop disturbing my sleep... 😴💤',
  'Zzz... leave me alone! 🛌💖',
  'I am too comfy right now… UwU 🌙✨',
  'Do not poke me! >.< 🐾',
  'Let me nap in peace! 💤💜',
  'Nya~ I’m snoozing… UwU 🐱',
  'Shhh… tiny kitty sleeping 😽💤',
  'Nap time is sacred! 🌸😴',
  'Leave me be, human! 🐾💖',
  'Soft kitty, warm kitty… Zzz 🐱💤',
  'I’m dreaming of treats… 🍣😽',
  'Paw me not! UwU 🐾💤',
  'Snooze mode activated… 💤✨',
  'No touching, UwU 😼💖',
  'Comfy, cozy, sleepy… 🌙💤',
  'Snuggle me later… 🐱💜',
  'Nap first, pet later… UwU 😽',
  'I iz sleepy… 😴💫',
  'Leave me in peace, UwU 🐾💖',
  'Tiny kitty needs zzz… 🐱💤',
  'Quiet… kitty dreams! 💤🌸',
  'Do not disturb UwU 😽✨',
  'I iz napping… 🛌💜',
  'Sweet dreams for me… 🌙😴',
  'Soft paws, soft snooze… UwU 🐾💤',
  'Let me snooze UwU 😽💖',
  'Sleepy beans resting… 🐾💤',
  'Zzz… kitty nap time! 🌸😴',
  'Purr… I am resting… UwU 😽',
];

export default function CatWidget() {
  const [bubble, setBubble] = useState('');
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [clickStreak, setClickStreak] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function createHearts(num: number) {
    const newHearts = [];
    for (let i = 0; i < num; i++) {
      newHearts.push({
        id: Date.now() + Math.random() * 1000 + i,
        x: Math.random() * 80 - 40, // random x offset
        y: Math.random() * 50 - 25, // random y offset
      });
    }
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.includes(h)));
    }, 1000);
  }

  function handleTap() {
    const heartsCount = clickStreak + 1; // increase hearts per click streak
    createHearts(heartsCount);
    setClickStreak(clickStreak + 1);

    setBubble(sleepyLines[Math.floor(Math.random() * sleepyLines.length)]);
    setTimeout(() => setBubble(''), 1900);
  }

  return (
    <div className="cat-widget-root">
      <div className="cat-container" ref={containerRef} onClick={handleTap}>
        <img src={tomTheCat} className="cat-gif" alt="Tom the cat" />

        {hearts.map((h) => (
          <div key={h.id} className="heart" style={{ left: `${50 + h.x}%`, top: `${-10 + h.y}px` }}>
            ❤
          </div>
        ))}

        {bubble && <div className="cat-bubble">{bubble}</div>}
      </div>
    </div>
  );
}
