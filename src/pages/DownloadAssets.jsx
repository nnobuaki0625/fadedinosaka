import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileArchive, Image, Music, Film } from 'lucide-react';
import VHSOverlay from '../components/vhs/VHSOverlay';
import RecIndicator from '../components/vhs/RecIndicator';
import ScreenWipe from '../components/vhs/ScreenWipe';

const ASSETS_BG = 'https://media.base44.com/images/public/69fd89100ae84a290df97675/4a5c820d3_generated_08dc669e.png';

const ASSETS = [
  { id: 1, name: 'VHS_TEXTURE_PACK.zip', size: '248 MB', type: 'textures', icon: Image, desc: 'High-res VHS noise, grain, and scanline overlays' },
  { id: 2, name: 'OSAKA_NEON_PRESETS.lut', size: '12 MB', type: 'color', icon: Film, desc: 'Cinematic color grading LUTs for video editing' },
  { id: 3, name: 'ANALOG_GLITCH_KIT.zip', size: '186 MB', type: 'effects', icon: FileArchive, desc: 'Chromatic aberration, tracking errors, distortion' },
  { id: 4, name: 'MIDNIGHT_AMBIENCE.wav', size: '94 MB', type: 'audio', icon: Music, desc: 'Osaka rain, city hum, distant bass frequencies' },
  { id: 5, name: 'CRT_DISPLAY_FONTS.zip', size: '8 MB', type: 'fonts', icon: FileArchive, desc: 'Pixel and monospace typefaces for retro UI' },
  { id: 6, name: 'CYBERPUNK_SPRITES.png', size: '34 MB', type: 'sprites', icon: Image, desc: '16-bit character and environment sprite sheets' },
];

function AssetCard({ asset, index }) {
  const [hover, setHover] = useState(false);
  const Icon = asset.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`
        relative border border-silver/10 bg-obsidian/60 backdrop-blur-sm p-6
        transition-all duration-500 cursor-pointer group
        ${hover ? 'border-crimson/50 shadow-[0_0_30px_rgba(255,0,60,0.1)]' : ''}
      `}
    >
      {/* Scan line on hover */}
      {hover && (
        <motion.div
          className="absolute left-0 right-0 h-[1px] bg-crimson/30"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="flex items-start justify-between mb-4">
        <Icon className="w-5 h-5 text-crimson/60" />
        <span className="font-mono text-[10px] text-silver/30 tracking-wider">{asset.type.toUpperCase()}</span>
      </div>

      <h3 className="font-mono text-sm text-silver tracking-wide mb-1">{asset.name}</h3>
      <p className="font-mono text-[11px] text-silver/40 leading-relaxed mb-4">{asset.desc}</p>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-silver/25">{asset.size}</span>
        <button className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-crimson/70 hover:text-crimson transition-colors bg-transparent border-none cursor-pointer">
          <Download className="w-3 h-3" />
          EXTRACT
        </button>
      </div>

      {/* Progress bar decoration */}
      <div className="mt-4 h-[2px] bg-silver/5 overflow-hidden">
        <motion.div
          className="h-full bg-crimson/40"
          initial={{ width: '0%' }}
          animate={hover ? { width: '100%' } : { width: '0%' }}
          transition={{ duration: 1.5 }}
        />
      </div>
    </motion.div>
  );
}

export default function DownloadAssets() {
  const navigate = useNavigate();
  const [wiping, setWiping] = useState(false);

  const handleBack = () => {
    setWiping(true);
  };

  return (
    <div className="min-h-screen bg-obsidian relative">
      <VHSOverlay />
      <RecIndicator />
      <ScreenWipe active={wiping} onComplete={() => navigate('/')} />

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={ASSETS_BG} alt="" className="w-full h-full object-cover opacity-10" style={{ filter: 'saturate(0.3) blur(2px)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/90 to-obsidian" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 font-mono text-xs tracking-widest text-silver/40 hover:text-crimson transition-colors mb-12 bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            RETURN TO ARCHIVE
          </button>

          <div className="flex items-end gap-4 mb-2">
            <h1 className="font-display text-4xl md:text-6xl text-silver tracking-tight">SIGNAL RETRIEVAL</h1>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="h-[1px] flex-1 bg-silver/10" />
            <span className="font-mono text-[10px] text-silver/25 tracking-[0.4em]">CREATIVE ASSETS // {ASSETS.length} FILES</span>
            <div className="h-[1px] w-12 bg-crimson/30" />
          </div>
        </motion.div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASSETS.map((asset, i) => (
            <AssetCard key={asset.id} asset={asset} index={i} />
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 pt-8 border-t border-silver/5 flex items-center justify-between"
        >
          <span className="font-mono text-[10px] text-silver/15 tracking-widest">VHS OSAKA // ASSET ARCHIVE</span>
          <span className="font-mono text-[10px] text-silver/15 tracking-widest">ALL FILES PLACEHOLDER</span>
        </motion.div>
      </div>
    </div>
  );
}