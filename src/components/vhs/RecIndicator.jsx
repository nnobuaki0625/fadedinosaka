import React from 'react';

export default function RecIndicator() {
  return (
    <div className="fixed top-6 left-6 z-50 flex items-center gap-2 font-mono text-xs tracking-widest text-silver/60">
      <div
        className="w-2 h-2 rounded-full bg-crimson"
        style={{ animation: 'rec-blink 1.2s infinite' }}
      />
      <span>REC</span>
    </div>
  );
}