import React from 'react';

export default function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Orb 1: Pink / Rose */}
      <div className="absolute top-[15%] left-[10%] w-[45vw] h-[45vw] max-w-[500px] rounded-full bg-gradient-to-br from-pink-500/15 to-rose-600/5 blur-[100px] md:blur-[140px] animate-orb-1" />
      
      {/* Orb 2: Rose Gold / Amber */}
      <div className="absolute top-[50%] right-[10%] w-[50vw] h-[50vw] max-w-[550px] rounded-full bg-gradient-to-br from-rose-400/10 to-amber-500/5 blur-[120px] md:blur-[160px] animate-orb-2" />
      
      {/* Orb 3: Soft Blush / Violet */}
      <div className="absolute bottom-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[450px] rounded-full bg-gradient-to-br from-purple-500/10 to-pink-300/10 blur-[90px] md:blur-[130px] animate-orb-3" />
    </div>
  );
}
