import { useEffect, useState } from 'react';

interface AudioControllerProps {
  shouldStart: boolean;
  isMuted?: boolean;
}

export default function AudioController({ shouldStart, isMuted = false }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Proactively enable playing state when preloader fades out, if not muted
  useEffect(() => {
    if (shouldStart && !isMuted) {
      setIsPlaying(true);
    }
  }, [shouldStart]);

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  // The BGM YouTube iframe should only render if start is triggered, BGM is unmuted, and surprise page is inactive
  const shouldRenderPlayer = shouldStart && isPlaying && !isMuted;

  return (
    <div className="fixed top-[18px] right-6 z-[95]">
      {/* Hidden YouTube Iframe Player for "Chitthi | QK, UK Rapi Boy | Hustle 2.0" */}
      {shouldRenderPlayer && (
        <iframe
          width="0"
          height="0"
          src="https://www.youtube.com/embed/8CifN2yqdg4?autoplay=1&loop=1&playlist=8CifN2yqdg4&enablejsapi=1&controls=0&mute=0&start=5"
          title="BGM YouTube Player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          className="absolute w-0 h-0 pointer-events-none opacity-0"
          style={{ pointerEvents: 'none' }}
        />
      )}

      <button
        onClick={togglePlayback}
        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center cursor-pointer hover:border-pink-400/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-black/40"
        title={isPlaying && !isMuted ? 'Mute Music' : 'Play Music'}
      >
        {isPlaying && !isMuted ? (
          /* Sound wave visualizer bars */
          <div className="flex items-end gap-[2px] h-[16px] w-[16px]">
            <div className="w-[2.5px] bg-pink-200 audio-bar audio-bar-1" />
            <div className="w-[2.5px] bg-pink-300 audio-bar audio-bar-2" />
            <div className="w-[2.5px] bg-pink-400 audio-bar audio-bar-3" />
            <div className="w-[2.5px] bg-rose-300 audio-bar audio-bar-4" />
          </div>
        ) : (
          /* Sleek Muted Speaker Icon */
          <svg
            className="w-[18px] h-[18px] text-white/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H1.5v6h3l4.5 3V6z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
