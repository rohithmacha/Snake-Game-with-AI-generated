import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "CORRUPT_SECTOR_01",
    artist: "UNKNOWN_ENTITY",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/glitch1/200/200?grayscale&blur=2"
  },
  {
    id: 2,
    title: "DATA_LEAK_DETECTED",
    artist: "SYS_ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/glitch2/200/200?grayscale&blur=2"
  },
  {
    id: 3,
    title: "OVERRIDE_PROTOCOL",
    artist: "AI_CORE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/glitch3/200/200?grayscale&blur=2"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="bg-black border-4 border-[#00ffff] p-6 w-full max-w-md flex flex-col gap-6 relative">
      <div className="absolute top-0 right-0 bg-[#ff00ff] text-black font-mono text-sm px-3 py-1">AUDIO_STREAM</div>
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex items-center gap-6 mt-4">
        <div className="w-20 h-20 border-4 border-[#ff00ff] flex-shrink-0 relative overflow-hidden grayscale contrast-200">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse' : ''}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#00ffff] mix-blend-color opacity-50"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-[#00ffff] font-mono text-lg truncate uppercase">
            {'>'} {currentTrack.title}
          </h3>
          <p className="text-[#ff00ff] text-sm truncate font-sans uppercase mt-1">
            SRC: {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div 
          className="h-6 bg-black border-2 border-[#00ffff] cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-[#ff00ff]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between font-mono text-lg">
        <div className="flex items-center gap-2 text-[#00ffff]">
          <button onClick={() => setIsMuted(!isMuted)} className="hover:bg-[#00ffff] hover:text-black px-2">
            {isMuted || volume === 0 ? '[MUT]' : '[VOL]'}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-24 h-2 bg-black border border-[#00ffff] appearance-none cursor-pointer accent-[#ff00ff]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={prevTrack}
            className="text-[#00ffff] hover:bg-[#00ffff] hover:text-black px-3 py-1"
          >
            {'<<'}
          </button>
          
          <button 
            onClick={togglePlay}
            className="text-black bg-[#ff00ff] hover:bg-[#00ffff] px-6 py-1 font-bold"
          >
            {isPlaying ? '||' : '>'}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-[#00ffff] hover:bg-[#00ffff] hover:text-black px-3 py-1"
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}
