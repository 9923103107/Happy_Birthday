import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  emoji: string;
  blur: number; // 3D Camera depth blur in px
  zIndex: number;
  opacity: number;
}

export default function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const emojis = ['🌸', '🌺', '💮', '🏵️', '✿', '❀', '🌷'];
    const newPetals: Petal[] = [];
    
    // Increase quantity slightly for layered depth (e.g. 30 petals)
    for (let i = 0; i < 32; i++) {
      const size = 10 + Math.random() * 26; // sizes range from 10px to 36px
      let blur = 0;
      let zIndex = 50;
      let duration = 8 + Math.random() * 12;
      let opacity = 0.85 + Math.random() * 0.15;

      if (size > 26) {
        // Foreground (very close to camera, blurry, floats fast, overlay above text)
        blur = 1.5 + Math.random() * 2.5; 
        zIndex = 99; // overlay above content
        duration = 5 + Math.random() * 3; // faster scroll
        opacity = 0.45 + Math.random() * 0.2; // soft focus transparency
      } else if (size < 15) {
        // Background (far away, tiny, sharp, drifts very slowly behind content)
        blur = 0.5;
        zIndex = 5; 
        duration = 16 + Math.random() * 8; // very slow drift
        opacity = 0.5 + Math.random() * 0.25;
      } else {
        // Midground (sharp, standard scrolling speed, normal index)
        blur = 0;
        zIndex = 40;
        duration = 9 + Math.random() * 5;
        opacity = 0.8 + Math.random() * 0.2;
      }

      newPetals.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration,
        size,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        blur,
        zIndex,
        opacity,
      });
    }
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 99 }}>
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="absolute select-none"
          style={{
            left: `${petal.left}%`,
            top: '-40px',
            fontSize: `${petal.size}px`,
            animation: `float-petal ${petal.duration}s ease-in-out ${petal.delay}s infinite`,
            opacity: 0, // float-petal animation keyframe handles animating this back up
            filter: petal.blur > 0 ? `blur(${petal.blur}px)` : 'none',
            zIndex: petal.zIndex,
            // Apply custom styles and scaling
            transform: `translate3d(0, 0, 0)`,
          }}
        >
          <span style={{ opacity: petal.opacity }}>{petal.emoji}</span>
        </span>
      ))}
    </div>
  );
}
