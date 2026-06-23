import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollProgress(progress);
      
      // Show button only after scrolling down 350px
      setIsVisible(scrollTop > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG circle calculations (radius 18, circumference = 2 * PI * 18 = 113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[95] transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="relative w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center cursor-pointer shadow-lg shadow-black/40 hover:border-pink-400/40 hover:scale-105 transition-all duration-300"
        title="Scroll to Top"
      >
        {/* SVG Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 select-none pointer-events-none">
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="transparent"
            stroke="url(#progress-gradient)"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s ease' }}
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f4c2c2" />
              <stop offset="100%" stopColor="#b76e79" />
            </linearGradient>
          </defs>
        </svg>

        {/* Up Arrow Icon */}
        <svg
          className="w-4 h-4 text-white/80 group-hover:text-white transition-colors duration-300 relative z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
