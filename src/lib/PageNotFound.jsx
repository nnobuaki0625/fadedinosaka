import { useLocation } from 'react-router-dom';
import VHSOverlay from '../components/vhs/VHSOverlay';
import GlitchText from '../components/vhs/GlitchText';

export default function PageNotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-6 relative">
      <VHSOverlay />
      <div className="text-center relative z-10">
        <h1 className="font-display text-8xl text-silver/10 mb-4">
          <GlitchText text="404" />
        </h1>
        <p className="font-mono text-xs text-silver/30 tracking-[0.4em] mb-2">SIGNAL NOT FOUND</p>
        <p className="font-mono text-[10px] text-silver/15 tracking-widest mb-8">
          /{location.pathname.substring(1)} // TRANSMISSION ERROR
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="font-pixel text-[10px] text-crimson tracking-widest hover:text-silver transition-colors bg-transparent border border-crimson/30 px-6 py-3 cursor-pointer"
        >
          RETURN TO ARCHIVE
        </button>
      </div>
    </div>
  );
}