import { useEffect, useRef, useCallback } from 'react';

interface ScrollCanvasProps {
  folderPath: string;
  frameCount: number;
  scrollStart: number; // 0-1 range: when in the total page scroll this section starts
  scrollEnd: number;   // 0-1 range: when in the total page scroll this section ends
}

export default function ScrollCanvas({ folderPath, frameCount, scrollStart, scrollEnd }: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const loadedRef = useRef(false);

  // Preload all images
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${folderPath}/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          loadedRef.current = true;
          drawFrame(0);
        } else if (loadedCount === 1) {
          drawFrame(0);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, [folderPath, frameCount]);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cover fit
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const cx = (canvas.width - img.width * ratio) / 2;
    const cy = (canvas.height - img.height * ratio) / 2;

    ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
  }, []);

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

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScroll;

      // Map global scroll to local progress
      if (scrollFraction < scrollStart || scrollFraction > scrollEnd) return;

      const localProgress = (scrollFraction - scrollStart) / (scrollEnd - scrollStart);
      const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.floor(localProgress * frameCount)));

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        requestAnimationFrame(() => drawFrame(frameIndex));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollStart, scrollEnd, frameCount, drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
}
