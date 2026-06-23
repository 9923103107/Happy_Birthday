import { useEffect, useRef, useState, useCallback } from 'react';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import FloatingPetals from './components/FloatingPetals';
import ScrollReveal from './components/ScrollReveal';
import BackgroundOrbs from './components/BackgroundOrbs';
import MagicalCursor from './components/MagicalCursor';
import SplitText from './components/SplitText';
import AudioController from './components/AudioController';
import ScrollToTop from './components/ScrollToTop';
import WishReleaseBox from './components/WishReleaseBox';
import ParallaxSection from './components/ParallaxSection';
import SurprisePage from './components/SurprisePage';

// ─── Spotlight Card Component ──────────────────────────────────────────────
function SpotlightWishCard({ emoji, text, index }: { emoji: string; text: string; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <ScrollReveal delay={index * 150} direction={index % 2 === 0 ? 'up' : 'scale'}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="spotlight-card group relative bg-gradient-to-br from-white/[0.01] to-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-pink-400/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
      >
        <div className="text-5xl mb-4 transition-transform duration-500 group-hover:scale-110 relative z-10 select-none">
          {emoji}
        </div>
        <p
          className="text-pink-100/80 text-xl leading-relaxed relative z-10"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          {text}
        </p>
        <div className="absolute -top-2 -right-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
          ✨
        </div>
      </div>
    </ScrollReveal>
  );
}

// ─── Confetti Physics Blast ────────────────────────────────────────────────
function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
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

  const colors = ['#f4c2c2', '#b76e79', '#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea', '#fff8f0'];
  const particles: Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
  }> = [];

  for (let i = 0; i < 180; i++) {
    particles.push({
      x: width / 2 + (Math.random() - 0.5) * 50,
      y: height / 2 + 100 + (Math.random() - 0.5) * 50,
      size: 5 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 15,
      speedY: -10 - Math.random() * 15,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
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
      p.speedY += 0.35;
      p.speedX *= 0.98;
      p.rotation += p.rotationSpeed;

      const elapsed = Date.now() - startTime;
      if (elapsed > 2000) {
        p.opacity -= 0.02;
      }

      if (p.opacity > 0 && p.y < height) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (active && Date.now() - startTime < 5000) {
      requestAnimationFrame(animate);
    } else {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  animate();
}


// ─── Frame Canvas Player Component ────────────────────────────────────────
function FramePlayer({
  folderPath,
  frameCount,
  sectionRef,
  onImageLoaded,
}: {
  folderPath: string;
  frameCount: number;
  sectionRef: React.RefObject<HTMLDivElement | null>;
  onImageLoaded: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const isUpdatingRef = useRef(false);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const cx = (canvas.width - img.width * ratio) / 2;
    const cy = (canvas.height - img.height * ratio) / 2;
    ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
  }, []);

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${folderPath}/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      
      const onImageLoad = () => {
        onImageLoaded();
        if (i === 1) {
          drawFrame(0);
        }
      };

      img.onload = onImageLoad;
      img.onerror = onImageLoad; // Count failed loads towards progress to prevent lockup
      images.push(img);
    }
    imagesRef.current = images;
  }, [folderPath, frameCount, drawFrame, onImageLoaded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
    };
    resize();
    window.addEventListener('resize', resize);

    const updateFrame = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      
      if (Math.abs(diff) < 0.0001) {
        currentProgressRef.current = targetProgressRef.current;
        isUpdatingRef.current = false;
      } else {
        currentProgressRef.current += diff * 0.08; // smooth lerp speed
        rafRef.current = requestAnimationFrame(updateFrame);
      }

      const frameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.floor(currentProgressRef.current * frameCount))
      );

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        drawFrame(frameIndex);
      }
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.scrollHeight - window.innerHeight;
      if (sectionHeight <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / sectionHeight));
      targetProgressRef.current = progress;

      if (!isUpdatingRef.current) {
        isUpdatingRef.current = true;
        updateFrame();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [frameCount, drawFrame, sectionRef]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block" 
      style={{
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
      }}
    />
  );
}

// ─── Sparkle Component ─────────────────────────────────────────────────────
function Sparkles() {
  const sparkles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    size: 2 + Math.random() * 4,
    duration: 2 + Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Countdown Timer ────────────────────────────────────────────────────────
function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? scrollTop / maxScroll : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const scrollProgress = useScrollProgress();
  const [showNav, setShowNav] = useState(false);
  
  // Loading states
  const [isLoaded, setIsLoaded] = useState(false);
  const [readyToEnter, setReadyToEnter] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showMorePage, setShowMorePage] = useState(false);
  
  const loadedCountRef = useRef(0);
  const totalFrames = 299 + 240; // 539 frames total
  const progressTextRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleImageLoaded = useCallback(() => {
    loadedCountRef.current++;
    const percentage = Math.min(100, Math.floor((loadedCountRef.current / totalFrames) * 100));
    
    if (progressTextRef.current) {
      progressTextRef.current.innerText = `${percentage}%`;
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${percentage}%`;
    }
    
    if (loadedCountRef.current >= totalFrames) {
      setTimeout(() => {
        setReadyToEnter(true);
      }, 300);
    }
  }, [totalFrames]);

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Confetti trigger effect for candle blowout
  useEffect(() => {
    if (candlesBlown) {
      triggerConfetti();
    }
  }, [candlesBlown]);

  const wishes = [
    { emoji: '🌸', text: 'May your day bloom with happiness' },
    { emoji: '✨', text: 'May every moment sparkle with joy' },
    { emoji: '🌷', text: 'May life gift you beautiful surprises' },
    { emoji: '💖', text: 'May love surround you always' },
    { emoji: '🦋', text: 'May your dreams take flight' },
    { emoji: '🌺', text: 'May your smile never fade' },
  ];

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, syncTouch: true }}>
      <div className={`relative bg-black min-h-screen ${!isLoaded ? 'h-screen overflow-hidden' : ''}`}>
        <MagicalCursor />
        <BackgroundOrbs />
        <AudioController shouldStart={isLoaded} isMuted={showMorePage} />
        <ScrollToTop />
        
        {/* ── Preloader Overlay ── */}
        <div
          className={`fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center transition-all duration-1000 ${
            isLoaded ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
          }`}
        >
          <div className="relative flex flex-col items-center max-w-md px-6 text-center">
            {/* Minimal glowing rose flower */}
            <div className="text-3xl mb-8 opacity-90 animate-pulse select-none">🌸</div>
            
            <h2
              className="text-white text-3xl font-light tracking-[0.25em] mb-3 uppercase select-none"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Ritika Jii
            </h2>
            <p
              className="text-white/40 text-xs tracking-[0.4em] mb-12 uppercase select-none"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Celebration of Joy & Magic
            </p>
            
            {/* Loading progress (Fades out when ready to enter) */}
            <div className={`transition-all duration-700 flex flex-col items-center ${readyToEnter ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100'}`}>
              <div ref={progressTextRef} className="text-white/60 font-light tracking-widest text-sm font-mono select-none">
                0%
              </div>
              
              <div className="w-48 h-[1px] bg-white/10 rounded-full overflow-hidden mt-4">
                <div
                  ref={progressBarRef}
                  className="h-full bg-white w-0 transition-[width] duration-100"
                />
              </div>
            </div>

            {/* Apple-style "Enter the Magic" button */}
            {readyToEnter && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center animate-fade-up">
                <button
                  onClick={() => setIsLoaded(true)}
                  className="px-10 py-3.5 rounded-full border border-white/20 hover:border-white/80 bg-white/5 hover:bg-white text-white hover:text-black tracking-[0.25em] uppercase text-xs transition-all duration-500 cursor-pointer shadow-lg hover:shadow-white/10"
                >
                  Enter the Magic
                </button>
              </div>
            )}
          </div>
        </div>

        <FloatingPetals />

        {/* ── Progress Bar ── */}
        <div className="fixed top-0 left-0 w-full h-1 z-[100]">
          <div
            className="h-full bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500"
            style={{ width: `${scrollProgress * 100}%`, transition: 'width 0.1s' }}
          />
        </div>

        {/* ── Floating Nav ── */}
        <nav
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[90] transition-all duration-700 ${
            showNav ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
          }`}
        >
          <div className="bg-black/60 backdrop-blur-xl border border-pink-500/20 rounded-full px-6 py-2.5 flex items-center gap-4">
            <span className="text-lg">🌸</span>
            <span className="text-pink-200 text-sm font-medium" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Happy Birthday Ritika Jii
            </span>
            <span className="text-lg" style={{ animation: 'heart-beat 1.5s ease-in-out infinite' }}>💝</span>
          </div>
        </nav>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: HERO - Full Screen Opening
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="/images/hero-flowers.jpeg"
              alt=""
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
          </div>

          <Sparkles />

          <div className="relative z-10 text-center px-4">
            <div className="mb-6 text-6xl" style={{ animation: 'heart-beat 1.5s ease-in-out infinite' }}>
              🌸
            </div>
            <h2
              className="text-xl md:text-2xl text-pink-300/80 mb-4 tracking-[0.3em] uppercase opacity-0 animate-[fade-up_1s_ease-out_0.2s_forwards]"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}
            >
              Wishing a very
            </h2>
            <h1
              className="text-shimmer text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight opacity-0 animate-[fade-up_1s_ease-out_0.5s_forwards]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Happy Birthday
            </h1>
            <h2
              className="text-4xl md:text-6xl lg:text-7xl text-pink-200 mb-8 opacity-0 animate-[fade-up_1s_ease-out_0.8s_forwards]"
              style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}
            >
              Ritika Jii 💐
            </h2>
            <p className="text-pink-300/60 text-lg tracking-widest mt-12 opacity-0 animate-[fade-up_1s_ease-out_1.1s_forwards]">
              SCROLL DOWN
            </p>
            <div className="mt-4 animate-bounce text-pink-300/40 text-2xl opacity-0 animate-[fade-up_1s_ease-out_1.3s_forwards]">↓</div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: First Video Frames (Scroll-driven)
        ═══════════════════════════════════════════════════════════════════ */}
        <section ref={section1Ref} className="relative" style={{ height: '400vh' }}>
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <FramePlayer
              folderPath="/video_frame_her"
              frameCount={299}
              sectionRef={section1Ref}
              onImageLoaded={handleImageLoaded}
            />
          {/* Overlay gradient at edges */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
          </div>
          {/* Subtle corner decorations */}
          <div className="absolute top-6 left-6 text-3xl opacity-30">🌸</div>
          <div className="absolute top-6 right-6 text-3xl opacity-30">🌸</div>
          <div className="absolute bottom-6 left-6 text-3xl opacity-30">✿</div>
          
          {/* Watermark Cover Badge for Ritika Jii */}
          <div className="absolute bottom-6 right-6 z-20 bg-black/80 backdrop-blur-md border border-pink-500/20 rounded-full px-5 py-2 shadow-lg select-none">
            <span className="text-pink-200 text-xs tracking-widest font-light uppercase select-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Celebrating Ritika Jii 🌸
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: Text Reveal - "RITIKA JII"
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-32">
        <div className="absolute inset-0">
          <img src="/images/sparkles.jpg" alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <Sparkles />
        <div className="relative z-10 text-center px-4">
          <ScrollReveal>
            <p className="text-pink-400/70 text-sm tracking-[0.5em] uppercase mb-8">
              A Special Message For
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h2
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-shimmer"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <SplitText text="RITIKA JII" delay={300} stagger={60} />
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <div className="flex items-center justify-center gap-4 my-8">
              <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-pink-400/50" />
              <span className="text-3xl">🌺</span>
              <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-pink-400/50" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <p
              className="text-2xl md:text-3xl text-pink-200/80 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              "The world became a little more beautiful the day you were born"
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: Birthday Wishes Grid
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0a10] to-black" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h3
                className="text-4xl md:text-5xl text-pink-100 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Birthday Wishes 🌸
              </h3>
              <div className="h-0.5 w-24 bg-gradient-to-r from-pink-500 to-rose-300 mx-auto rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {wishes.map((wish, i) => (
              <SpotlightWishCard key={i} emoji={wish.emoji} text={wish.text} index={i} />
            ))}
          </div>

          <WishReleaseBox />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: Parallax Image Divider
      ═══════════════════════════════════════════════════════════════════ */}
      <ParallaxSection
        bgImageSrc="/images/flowers-section.jpg"
        emoji="🎂"
        title="Make a Wish"
        subTitle="Close your eyes and believe..."
      />


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: Birthday Cake / Photo
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0d0508] to-black" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <ScrollReveal direction="left" className="flex-1">
            <div className="relative cursor-pointer group" onClick={() => !candlesBlown && setCandlesBlown(true)}>
              <div className="absolute -inset-4 bg-gradient-to-br from-pink-500/15 to-rose-500/15 rounded-3xl blur-xl transition-all duration-700 group-hover:from-pink-500/35 group-hover:to-rose-500/35" />
              <img
                src="/images/birthday-cake.jpg"
                alt="Birthday Cake"
                className={`relative rounded-2xl w-full max-w-md mx-auto shadow-2xl transition-all duration-1000 ${
                  candlesBlown ? 'shadow-amber-500/20 filter brightness-95 scale-[0.98]' : 'shadow-pink-500/10'
                }`}
                style={{ animation: candlesBlown ? 'none' : 'pulse-glow 4s ease-in-out infinite' }}
              />
              {!candlesBlown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-black/80 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-white text-xs tracking-widest uppercase font-medium select-none shadow-lg">
                    Blow Out Candles 🎂
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="flex-1 text-center lg:text-left">
            <p className="text-pink-400/60 tracking-[0.3em] text-sm uppercase mb-4">Celebrating You</p>
            <h3
              className="text-4xl md:text-5xl text-pink-50 mb-6 leading-tight transition-all duration-700"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {candlesBlown ? (
                <span className="text-shimmer drop-shadow-[0_0_15px_rgba(255,255,255,0.35)]">✨ Wish Granted! ✨</span>
              ) : (
                <>
                  Today is
                  <br />
                  <span className="text-shimmer">Your Day</span> 🎉
                </>
              )}
            </h3>
            <p className="text-pink-200/60 leading-relaxed text-lg mb-8 transition-all duration-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {candlesBlown ? (
                "The candles are blown, the stars have aligned, and your wish is on its way. Here's to a year where all your heartfelt dreams transform into beautiful reality."
              ) : (
                "Another year of being amazing, another year of spreading joy and warmth wherever you go. Here's to more laughter, more love, and more beautiful moments."
              )}
            </p>
            <div
              className="text-2xl text-pink-300/80 italic transition-all duration-700"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {candlesBlown ? (
                "\"Close your eyes, hold onto the magic, and let the universe do the rest.\" 💖"
              ) : (
                "\"Age is merely the number of years the world has been enjoying you\" 💕"
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7: Second Video Frames (Flower Video)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16">
        <ScrollReveal>
          <div className="text-center mb-8">
            <p className="text-pink-400/60 tracking-[0.3em] text-sm uppercase mb-2">A Floral Gift</p>
            <h3
              className="text-3xl md:text-4xl text-pink-100"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Flowers For You 🌷
            </h3>
          </div>
        </ScrollReveal>
      </section>

      <section ref={section2Ref} className="relative" style={{ height: '350vh' }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <FramePlayer
            folderPath="/flower_frames"
            frameCount={240}
            sectionRef={section2Ref}
            onImageLoaded={handleImageLoaded}
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
          </div>
          {/* Floral frame overlay */}
          <div className="absolute inset-0 pointer-events-none border-[12px] border-transparent"
            style={{
              borderImage: 'linear-gradient(135deg, rgba(244,194,194,0.15), transparent, rgba(183,110,121,0.15)) 1',
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8: Special Message
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-32">
        <div className="absolute inset-0">
          <img src="/images/flower-border.png" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <Sparkles />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-7xl mb-8" style={{ animation: 'heart-beat 1.5s ease-in-out infinite' }}>
              💝
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h2
              className="text-4xl md:text-6xl text-pink-50 mb-8 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Wishing You The Most
              <br />
              <span className="text-shimmer">Magical Birthday</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p
              className="text-2xl md:text-3xl text-pink-200/70 leading-relaxed mb-12"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              May this new chapter of your life be filled with endless joy,
              beautiful adventures, and all the love your heart can hold.
              You deserve nothing but the best, today and always. 🌸
            </p>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <div className="flex items-center justify-center gap-3 text-4xl">
              <span>🌸</span>
              <span>🌺</span>
              <span>🌷</span>
              <span>💐</span>
              <span>🌹</span>
              <span>🌻</span>
              <span>🌸</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 9: Footer / Closing
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-[#1a0510]" />
        <Sparkles />

        <div className="relative z-10 text-center">
          <ScrollReveal>
            <div className="text-5xl mb-6">🎂</div>
            <h2
              className="text-5xl md:text-7xl text-shimmer mb-4"
              style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}
            >
              Happy Birthday!
            </h2>
            <h3
              className="text-3xl md:text-4xl text-pink-200/80 mb-12"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ritika Jii 🌸
            </h3>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-500/30" />
              <span className="text-pink-400/40 text-sm tracking-[0.3em]">WITH LOVE</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-500/30" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={500}>
            <p className="text-pink-300/30 text-sm">
              Made with 💖 for someone special
            </p>
          </ScrollReveal>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 10: Surprise Teaser Section
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-[#1a0510] to-[#050204] text-center border-t border-white/5 z-10">
        <ScrollReveal>
          <p className="text-pink-400/50 text-xs tracking-[0.4em] uppercase mb-4 select-none">Wait... is that all?</p>
          <h3 className="text-xl md:text-2xl text-white/80 font-light mb-8 select-none" style={{ fontFamily: "'Playfair Display', serif" }}>
            There might be one more little surprise...
          </h3>
          <button
            onClick={() => setShowMorePage(true)}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 hover:from-amber-500 hover:to-pink-500 text-amber-200 hover:text-black border border-amber-500/30 hover:border-pink-300 tracking-[0.25em] uppercase text-xs transition-all duration-700 font-semibold cursor-pointer shadow-lg hover:shadow-pink-500/10"
          >
            U Want More? 🎁
          </button>
        </ScrollReveal>
      </section>

      {/* ── Fullscreen Comical Surprise Overlay ── */}
      {showMorePage && (
        <SurprisePage onClose={() => setShowMorePage(false)} />
      )}
      </div>
    </ReactLenis>
  );
}

