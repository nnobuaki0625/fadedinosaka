import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Eye } from 'lucide-react';
import VHSOverlay from '../components/vhs/VHSOverlay';
import GlitchText from '../components/vhs/GlitchText';
import RecIndicator from '../components/vhs/RecIndicator';

const SECRETS = [
  { label: 'UNRELEASED_FOOTAGE_01.mp4', status: 'CLASSIFIED' },
  { label: 'OSAKA_FIELD_RECORDINGS.wav', status: 'DECLASSIFIED' },
  { label: 'PROTOTYPE_DESIGNS.psd', status: 'CLASSIFIED' },
  { label: 'DIRECTOR_CUT_EDIT.mov', status: 'CLASSIFIED' },
  { label: 'HIDDEN_TRACK_MIX.flac', status: 'DECLASSIFIED' },
];

export default function SecretArchive() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-obsidian relative flex flex-col">
      <VHSOverlay />
      <RecIndicator />

      {/* Animated background grid */}
      <div className="fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,0,60,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,60,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto px-6 py-16 w-full">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-mono text-xs tracking-widest text-silver/40 hover:text-crimson transition-colors mb-16 bg-transparent border-none cursor-pointer self-start"
        >
          <ArrowLeft className="w-3 h-3" />
          EXIT ARCHIVE
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <Eye className="w-5 h-5 text-crimson" />
            <span className="font-mono text-[10px] tracking-[0.5em] text-crimson/60">CLEARANCE LEVEL: MAXIMUM</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-silver">
            <GlitchText text="SECRET" />
            <br />
            <GlitchText text="ARCHIVE" />
          </h1>
          <p className="font-mono text-xs text-silver/30 mt-6 tracking-widest">
            ACCESS GRANTED // RESTRICTED CONTENT BELOW
          </p>
        </motion.div>

        <div className="space-y-3">
          {SECRETS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.15 }}
              className="flex items-center justify-between border border-silver/8 bg-cobalt/30 px-6 py-4 hover:border-crimson/30 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <Lock className="w-3.5 h-3.5 text-crimson/40 group-hover:text-crimson transition-colors" />
                <span className="font-mono text-sm text-silver/70 tracking-wide">{item.label}</span>
              </div>
              <span className={`font-mono text-[10px] tracking-widest ${item.status === 'DECLASSIFIED' ? 'text-cyan/60' : 'text-crimson/40'}`}>
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-auto pt-16 text-center"
        >
          <p className="font-mono text-[10px] text-silver/15 tracking-[0.4em]">
            VHS OSAKA // RESTRICTED SECTOR // END OF TRANSMISSION
          </p>
        </motion.div>
      </div>
    </div>
  );
}