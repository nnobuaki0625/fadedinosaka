import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlitchText from '../vhs/GlitchText';
import ArcadeButton from '../vhs/ArcadeButton';

export default function GameOverlay({ type, onRetry }) {
  const navigate = useNavigate();
  const isWin = type === 'win';

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-obsidian/95 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glitch flash */}
      <motion.div
        className="absolute inset-0 bg-silver"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {isWin ? (
        <>
          <motion.div
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-4"
          >
            <h1 className="font-display text-5xl md:text-8xl text-cyan glitch-text">
              <GlitchText text="ACCESS" />
            </h1>
            <h1 className="font-display text-5xl md:text-8xl text-cyan glitch-text">
              <GlitchText text="GRANTED" />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="font-pixel text-xs text-crimson tracking-[0.3em] mb-12"
          >
            SPECIAL ARCHIVE UNLOCKED
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 }}
            className="flex flex-col items-center gap-4"
          >
            <ArcadeButton variant="crimson" onClick={() => navigate('/secret')}>
              ENTER SECRET ARCHIVE
            </ArcadeButton>
            <button
              onClick={() => navigate('/')}
              className="font-mono text-[10px] text-silver/30 tracking-widest hover:text-silver/60 transition-colors bg-transparent border-none cursor-pointer mt-4"
            >
              RETURN TO HUB
            </button>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-5xl md:text-7xl text-crimson glitch-text">
              <GlitchText text="SIGNAL" />
            </h1>
            <h1 className="font-display text-5xl md:text-7xl text-crimson glitch-text">
              <GlitchText text="LOST" />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="font-mono text-xs text-silver/40 tracking-widest mb-12"
          >
            TIME EXPIRED // TRANSMISSION FAILED
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col items-center gap-4"
          >
            <ArcadeButton variant="crimson" onClick={onRetry}>
              RETRY
            </ArcadeButton>
            <button
              onClick={() => navigate('/')}
              className="font-mono text-[10px] text-silver/30 tracking-widest hover:text-silver/60 transition-colors bg-transparent border-none cursor-pointer mt-4"
            >
              RETURN TO HUB
            </button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}