import React from 'react';

export default function GlitchText({ text, className = '', as: Tag = 'span' }) {
  return (
    <Tag className={`relative inline-block ${className}`} aria-label={text}>
      <span className="relative z-10">{text}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 text-crimson opacity-70"
        style={{ animation: 'glitch-1 2.5s infinite linear alternate-reverse', clipPath: 'inset(0 0 65% 0)' }}
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 text-cyan opacity-70"
        style={{ animation: 'glitch-2 2.5s infinite linear alternate-reverse', clipPath: 'inset(65% 0 0 0)' }}
      >
        {text}
      </span>
    </Tag>
  );
}