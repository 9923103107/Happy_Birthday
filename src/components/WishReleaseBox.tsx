import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';

interface ActiveLantern {
  id: number;
  text: string;
  left: number;
  driftX: number;
  delay: number;
}

export default function WishReleaseBox() {
  const [wishText, setWishText] = useState('');
  const [activeWishes, setActiveWishes] = useState<ActiveLantern[]>([]);
  const [releasedCount, setReleasedCount] = useState(0);

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    const newWish: ActiveLantern = {
      id: Date.now(),
      text: wishText,
      left: 15 + Math.random() * 70, // random left percentage (15% to 85%)
      driftX: -100 + Math.random() * 200, // random horizontal drift offset in px
      delay: 0,
    };

    // Add to active floating lanterns
    setActiveWishes((prev) => [...prev, newWish]);
    setWishText('');
    setReleasedCount((c) => c + 1);

    // Play a small sparkles sound or confetti burst local trigger
    if (typeof window !== 'undefined') {
      importConfettiAndFire();
    }

    // Auto-clean up lantern after its animation ends (14s)
    setTimeout(() => {
      setActiveWishes((prev) => prev.filter((w) => w.id !== newWish.id));
    }, 14000);
  };

  const importConfettiAndFire = () => {
    // Dynamic blast from the bottom
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.bottom = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ['#f4c2c2', '#b76e79', '#ffb7b2', '#ffdac1', '#fff8f0'];
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    // Blast particles from bottom center
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 200,
        y: height - 10,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 8,
        speedY: -6 - Math.random() * 8,
        opacity: 1,
      });
    }

    const startTime = Date.now();
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      let active = false;

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.15; // slow gravity
        p.opacity -= 0.015;

        if (p.opacity > 0) {
          active = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        }
      });

      if (active && Date.now() - startTime < 4000) {
        requestAnimationFrame(animate);
      } else {
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    }
    animate();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 z-20">
      <ScrollReveal direction="up">
        <div className="spotlight-card bg-gradient-to-br from-white/[0.01] to-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] text-center relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-transparent blur-xl pointer-events-none" />
          
          <p className="text-pink-400/60 tracking-[0.3em] text-xs uppercase mb-3 select-none">Send Your Love</p>
          <h4
            className="text-2xl md:text-3xl text-pink-50 mb-6 font-light"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Release a Birthday Lantern 🏮
          </h4>
          
          <form onSubmit={handleRelease} className="flex flex-col gap-4 relative z-20">
            <div className="relative">
              <input
                type="text"
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                maxLength={60}
                placeholder="Write a sweet wish for Ritika Jii..."
                className="w-full px-6 py-4 rounded-full bg-black/60 border border-white/10 text-pink-100 placeholder-white/30 text-sm focus:outline-none focus:border-pink-400/50 transition-all duration-300 focus:shadow-[0_0_15px_rgba(244,194,194,0.15)] pr-16 font-light"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-white/30 font-mono select-none">
                {60 - wishText.length}
              </span>
            </div>

            <button
              type="submit"
              disabled={!wishText.trim()}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-400/20 hover:from-pink-500 hover:hover:to-rose-400 text-pink-200 hover:text-black border border-pink-400/30 hover:border-pink-300 tracking-[0.15em] uppercase text-xs transition-all duration-500 font-medium cursor-pointer shadow-lg hover:shadow-pink-500/15 disabled:opacity-40 disabled:pointer-events-none"
            >
              Release Wish ✨
            </button>
          </form>

          {releasedCount > 0 && (
            <p className="text-pink-300/40 text-xs mt-4 tracking-widest uppercase animate-pulse select-none">
              Lanterns Released: {releasedCount} 
            </p>
          )}
        </div>
      </ScrollReveal>

      {/* Floating Lanterns Layer (renders globally above viewport using fixed portal styling) */}
      <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden">
        {activeWishes.map((w) => (
          <div
            key={w.id}
            className="absolute bottom-0 animate-wish-lantern sway-lantern flex flex-col items-center"
            style={{
              left: `${w.left}%`,
              // Pass custom drift distance as CSS variable
              ['--drift-x' as any]: `${w.driftX}px`,
              willChange: 'transform, opacity',
            }}
          >
            {/* Glowing Lantern Balloon */}
            <div className="relative w-14 h-18 rounded-t-full rounded-b-lg bg-gradient-to-t from-amber-500/80 via-rose-500/70 to-pink-500/80 shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center p-2 border border-amber-300/30">
              {/* Flame core */}
              <div className="absolute bottom-1 w-3 h-3 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,1)]" />
              
              {/* Subtle visual content */}
              <span className="text-[10px] text-white/40 select-none">🌸</span>
            </div>
            
            {/* Thread and Wish message wrapper */}
            <div className="w-[1px] h-6 bg-amber-400/30" />
            <div className="max-w-[150px] px-3 py-1.5 rounded-xl bg-black/85 border border-amber-300/20 backdrop-blur-md shadow-lg">
              <p 
                className="text-amber-200/90 text-center break-words text-[10px] leading-snug font-medium"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {w.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
