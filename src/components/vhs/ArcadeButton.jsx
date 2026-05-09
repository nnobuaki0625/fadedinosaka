import React, { useState } from 'react';

export default function ArcadeButton({ children, onClick, variant = 'default' }) {
  const [hover, setHover] = useState(false);

  const borderColor = variant === 'crimson' ? 'border-crimson' : 'border-silver/40';
  const glowColor = variant === 'crimson'
    ? 'shadow-[0_0_30px_rgba(255,0,60,0.3),inset_0_0_30px_rgba(255,0,60,0.1)]'
    : 'shadow-[0_0_30px_rgba(226,226,226,0.1),inset_0_0_30px_rgba(226,226,226,0.05)]';
  const hoverGlow = variant === 'crimson'
    ? 'shadow-[0_0_60px_rgba(255,0,60,0.6),inset_0_0_40px_rgba(255,0,60,0.2)]'
    : 'shadow-[0_0_60px_rgba(226,226,226,0.2),inset_0_0_40px_rgba(226,226,226,0.1)]';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`
        relative px-10 py-6 md:px-16 md:py-8
        border-2 ${borderColor}
        bg-obsidian/80 backdrop-blur-sm
        font-pixel text-sm md:text-base text-silver tracking-[0.2em]
        transition-all duration-300 cursor-pointer
        ${hover ? hoverGlow : glowColor}
        focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-obsidian
        active:scale-95
      `}
      style={hover ? { animation: 'chromatic-shift 0.3s ease-in-out infinite' } : {}}
    >
      <span className="relative z-10">{children}</span>
      {hover && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,60,0.1) 2px, rgba(255,0,60,0.1) 4px)',
          }}
        />
      )}
    </button>
  );
}