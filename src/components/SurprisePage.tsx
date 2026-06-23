import { useEffect, useRef, useState } from 'react';

interface SurprisePageProps {
  onClose: () => void;
}

interface ComicalEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  angle: number;
}

export default function SurprisePage({ onClose }: SurprisePageProps) {
  const [emojis, setEmojis] = useState<ComicalEmoji[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate random silly scattering emojis
    const sillyEmojis = ['😜', '🤡', '🦄', '🐒', '🥳', '👻', '🤠', '🦖', '🐷', '🦙', '👽', '🍩'];
    const generated: ComicalEmoji[] = [];
    
    for (let i = 0; i < 24; i++) {
      generated.push({
        id: i,
        emoji: sillyEmojis[Math.floor(Math.random() * sillyEmojis.length)],
        x: 10 + Math.random() * 80,
        y: 15 + Math.random() * 70,
        scale: 0.8 + Math.random() * 0.8,
        angle: Math.random() * 360,
      });
    }
    setEmojis(generated);

    // Lock scrolling on main page while surprise is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleEmojiHover = (id: number) => {
    setEmojis((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            x: 10 + Math.random() * 80,
            y: 15 + Math.random() * 70,
            angle: e.angle + 45 + Math.random() * 90,
            scale: 0.8 + Math.random() * 0.8,
          };
        }
        return e;
      })
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[2000] bg-[#050204] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden scale-reveal-enter"
    >
      {/* Hidden YouTube Iframe Player to play "Bache Ki Jaan Leve Gi" audio */}
      <iframe
        width="0"
        height="0"
        src="https://www.youtube.com/embed/5gPGR6ly8Fw?autoplay=1&loop=1&playlist=5gPGR6ly8Fw&enablejsapi=1&controls=0&mute=0"
        title="YouTube BGM"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        className="absolute w-0 h-0 pointer-events-none opacity-0"
        style={{ pointerEvents: 'none' }}
      ></iframe>

      {/* Background comical grid lines */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #f4c2c2 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Scattering Interactive Emojis Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {emojis.map((e) => (
          <div
            key={e.id}
            onMouseEnter={() => handleEmojiHover(e.id)}
            onTouchStart={() => handleEmojiHover(e.id)}
            className="absolute pointer-events-auto cursor-help text-5xl transition-all duration-500 ease-out animate-emoji-dance select-none"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              transform: `scale(${e.scale}) rotate(${e.angle}deg) translate3d(0,0,0)`,
              animationDelay: `${e.id * 0.1}s`,
              willChange: 'left, top, transform',
            }}
          >
            {e.emoji}
          </div>
        ))}
      </div>

      {/* Glowing Comical Center Card */}
      <div className="relative z-20 max-w-xl bg-black/60 backdrop-blur-xl border border-yellow-400/20 p-10 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col items-center">
        
        <div className="text-7xl mb-8 animate-bounce-slow">🤪</div>
        
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-rose-400 drop-shadow-[0_2px_10px_rgba(239,68,68,0.2)]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          YOU ASKED FOR IT!
        </h1>
        
        <p 
          className="text-xl text-yellow-100/90 leading-relaxed mb-8 max-w-md font-light"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          "Hope your birthday is as crazy, wild, and Haryanvi-flavored as this music! Go wild, dance around, and have the best day ever! 🎂🎈"
        </p>

        <button
          onClick={onClose}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-400/20 hover:from-white hover:to-white text-yellow-300 hover:text-black border border-yellow-400/30 hover:border-white tracking-[0.15em] uppercase text-xs transition-all duration-500 font-semibold cursor-pointer shadow-lg hover:shadow-white/10"
        >
          🌸 Go Back to Beautiful World
        </button>
      </div>

      {/* Background orbs */}
      <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-yellow-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-orange-600/5 blur-[100px] pointer-events-none z-0" />
    </div>
  );
}
