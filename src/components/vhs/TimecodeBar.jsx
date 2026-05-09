import React from 'react';

export default function TimecodeBar() {
  const now = new Date();
  const tc = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono text-[10px] tracking-[0.3em] text-silver/30">
      <span>TC {tc}</span>
      <span className="ml-4">SP</span>
    </div>
  );
}