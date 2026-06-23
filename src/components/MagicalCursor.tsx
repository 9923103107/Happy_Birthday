import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  char: string;
}

export default function MagicalCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Refs for tracking cursor coordinates
  const mouseRef = useRef({ x: 0, y: 0 });
  const auraRef = useRef({ x: 0, y: 0 });
  const lastSpawnRef = useRef({ x: 0, y: 0 });
  
  // Canvas and DOM element refs
  const dotElRef = useRef<HTMLDivElement>(null);
  const auraElRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Sparkle particles list
  const particlesRef = useRef<Particle[]>([]);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Detect mobile / touch devices
    const checkDevice = () => {
      const hasTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
      setIsMobile(hasTouch);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    if (isMobile) return;

    // Handle canvas resizing
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;
      setIsVisible(true);

      // Spawn sparkle particles on movement
      const lastSpawn = lastSpawnRef.current;
      const distance = Math.hypot(clientX - lastSpawn.x, clientY - lastSpawn.y);
      
      if (distance > 12) {
        spawnParticle(clientX, clientY);
        lastSpawnRef.current = { x: clientX, y: clientY };
      }
    };

    const spawnParticle = (x: number, y: number) => {
      const colors = ['#f4c2c2', '#b76e79', '#ffb7b2', '#ffdac1', '#e2f0cb', '#c7ceea', '#fff'];
      const chars = ['✨', '🌸', '✦', '✧', '🌸', '✨'];
      
      const newParticle: Particle = {
        x,
        y,
        // Small random initial velocities (float out and drift slightly)
        vx: (Math.random() - 0.5) * 2,
        vy: 0.5 + Math.random() * 1.5, // drift downward
        size: 8 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        char: chars[Math.floor(Math.random() * chars.length)]
      };

      particlesRef.current.push(newParticle);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Dynamic hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest('a, button, [role="button"], .spotlight-card, input, select, textarea, .interactive-hover');
      if (isInteractive) {
        document.body.classList.add('cursor-hovering');
      } else {
        document.body.classList.remove('cursor-hovering');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    // Lerp & Canvas Animation Loop
    const updateLoop = () => {
      const lerpSpeed = 0.15;
      const mouse = mouseRef.current;
      const aura = auraRef.current;

      // 1. Update trailing outer circle position
      aura.x += (mouse.x - aura.x) * lerpSpeed;
      aura.y += (mouse.y - aura.y) * lerpSpeed;

      if (dotElRef.current) {
        dotElRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
      if (auraElRef.current) {
        auraElRef.current.style.transform = `translate3d(${aura.x}px, ${aura.y}px, 0) translate(-50%, -50%)`;
      }

      // 2. Animate canvas sparkles
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const particles = particlesRef.current;
        particlesRef.current = particles.filter((p) => {
          // Update physics
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          p.opacity -= 0.018; // Fade out speed

          if (p.opacity <= 0) return false;

          // Draw particle
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          
          if (p.char === '✨' || p.char === '🌸' || p.char === '✦' || p.char === '✧') {
            ctx.font = `${p.size}px Arial`;
            ctx.fillStyle = p.color;
            ctx.fillText(p.char, -p.size / 2, p.size / 2);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
          }
          ctx.restore();
          
          return true;
        });
      }

      rafIdRef.current = requestAnimationFrame(updateLoop);
    };

    rafIdRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('cursor-hovering');
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-[9997] w-screen h-screen"
        style={{ pointerEvents: 'none' }}
      />
      {isVisible && (
        <>
          <div 
            ref={dotElRef} 
            className="custom-cursor-dot" 
            style={{ willChange: 'transform' }}
          />
          <div 
            ref={auraElRef} 
            className="custom-cursor-aura" 
            style={{ willChange: 'transform' }}
          />
        </>
      )}
    </>
  );
}
