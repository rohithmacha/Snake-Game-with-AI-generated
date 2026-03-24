import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-sans overflow-hidden relative flex flex-col items-center justify-center p-4 crt-flicker">
      <div className="static-noise"></div>
      <div className="scanlines"></div>
      
      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12">
        
        {/* Left/Top side: Title and Music Player */}
        <div className="flex flex-col items-center lg:items-start gap-8 w-full max-w-md">
          <div className="text-center lg:text-left border-l-8 border-[#ff00ff] pl-6 py-2">
            <h1 className="text-4xl md:text-5xl font-mono text-[#00ffff] glitch-text uppercase tracking-tighter" data-text="SYS.SNAKE_EXE">
              SYS.SNAKE_EXE
            </h1>
            <p className="text-[#ff00ff] font-sans text-2xl mt-2 uppercase tracking-widest">
              {'>'} STATUS: CORRUPTED
            </p>
          </div>
          
          <MusicPlayer />
          
          <div className="hidden lg:block w-full p-4 bg-black border-4 border-[#00ffff] relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#ff00ff] animate-pulse"></div>
            <h3 className="text-[#ff00ff] font-sans text-2xl uppercase tracking-widest mb-2">{'>'} MEM_ALLOC_SCORE</h3>
            <div className="text-5xl font-mono text-[#00ffff] glitch-text" data-text={score.toString().padStart(6, '0')}>
              {score.toString().padStart(6, '0')}
            </div>
          </div>
        </div>

        {/* Right/Center side: Game */}
        <div className="flex-shrink-0 relative border-8 border-[#ff00ff] p-2 bg-black">
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-8 border-l-8 border-[#00ffff]"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-8 border-r-8 border-[#00ffff]"></div>
          <SnakeGame onScoreUpdate={setScore} />
        </div>

      </div>
    </div>
  );
}
