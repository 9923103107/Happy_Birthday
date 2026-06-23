import React from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number; // base delay in ms
  stagger?: number; // stagger delay between letters in ms
}

export default function SplitText({ text, className = '', delay = 0, stagger = 30 }: SplitTextProps) {
  const words = text.split(' ');
  
  // Keep track of letter index for stagger calculation
  let letterCount = 0;

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, wordIndex) => {
        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split('').map((char, charIndex) => {
              const currentDelay = delay + letterCount * stagger;
              letterCount++;
              return (
                <span key={charIndex} className="char-container">
                  <span
                    className="char-reveal"
                    style={{
                      animationDelay: `${currentDelay}ms`,
                    }}
                  >
                    {char}
                  </span>
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
