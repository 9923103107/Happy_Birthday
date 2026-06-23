import { useEffect, useRef, useState } from 'react';
import ScrollReveal from './ScrollReveal';

interface ParallaxSectionProps {
  bgImageSrc: string;
  emoji: string;
  title: string;
  subTitle: string;
}

export default function ParallaxSection({ bgImageSrc, emoji, title, subTitle }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the section center is from the viewport center
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const diff = sectionCenter - viewportCenter;

      // Parallax speed coefficient (0.15 is smooth and stays within the 110% scaled image border)
      const offset = diff * 0.15;
      setTranslateY(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[75vh] overflow-hidden">
      {/* Parallax Background Container */}
      <div 
        className="absolute inset-0 scale-110 transition-transform duration-100 ease-out"
        style={{ 
          transform: `translate3d(0, ${translateY}px, 0) scale(1.1)`,
          willChange: 'transform'
        }}
      >
        <img
          src={bgImageSrc}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Blurred Tint Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-10" />

      {/* Floating Content */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <ScrollReveal direction="scale">
          <div className="text-center px-4">
            <p className="text-6xl mb-6 select-none">{emoji}</p>
            <h3
              className="text-3xl md:text-5xl text-white/90 font-light select-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {title}
            </h3>
            <p
              className="text-xl text-pink-200/60 mt-4 select-none"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {subTitle}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
