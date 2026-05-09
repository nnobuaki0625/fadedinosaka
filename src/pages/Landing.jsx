import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VHSOverlay from '../components/vhs/VHSOverlay';
import GlitchText from '../components/vhs/GlitchText';
import RecIndicator from '../components/vhs/RecIndicator';
import TimecodeBar from '../components/vhs/TimecodeBar';
import ArcadeButton from '../components/vhs/ArcadeButton';
import ScreenWipe from '../components/vhs/ScreenWipe';

const HERO_BG = 'https://media.base44.com/images/public/69fd89100ae84a290df97675/cf0cfe4a3_generated_6b345752.png';

export default function Landing() {
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  const [wiping, setWiping] = useState(false);
  const [wipeTarget, setWipeTarget] = useState(null);
  const [heroReady, setHeroReady] = useState(false);

  const handleEnter = useCallback(() => {
    setEntered(true);
  }, []);

  const handleNavigate = useCallback((path) => {
    setWipeTarget(path);
    setWiping(true);
  }, []);

  const handleWipeComplete = useCallback(() => {
    setWiping(false);
    if (wipeTarget) navigate(wipeTarget);
  }, [wipeTarget, navigate]);

  return (
    <div className="fixed inset-0 bg-obsidian overflow-hidden">
      <VHSOverlay />
      <RecIndicator />
      <TimecodeBar />
      <ScreenWipe active={wiping} onComplete={handleWipeComplete} />

      {/* Background image with parallax-like subtle motion */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.03, 1], x: [0, 5, -3, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover opacity-40"
          onLoad={() => setHeroReady(true)}
          style={{ filter: 'saturate(0.6) contrast(1.3)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-transparent to-obsidian/80" />
      </motion.div>

      {/* VHS tracking bar decoration */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-silver/10 z-30"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <AnimatePresence mode="wait">
        {!entered ? (
          /* HERO STATE — VHS OSAKA title */
          <motion.div
            key="hero"
            className="relative z-20 flex flex-col items-center justify-center h-full px-6"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={heroReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <h1 className="font-display text-[15vw] md:text-[12vw] leading-[0.85] tracking-tighter text-silver glitch-text select-none">
                <GlitchText text="VHS" as="span" />
                <br />
                <GlitchText text="OSAKA" as="span" />
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={heroReady ? { opacity: 1 } : {}}
              transition={{ delay: 2, duration: 1 }}
              className="mt-12"
            >
              <button
                onClick={handleEnter}
                className="group relative font-pixel text-xs md:text-sm tracking-[0.4em] text-crimson cursor-pointer bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-crimson px-4 py-2"
              >
                <span className="relative z-10">ENTER THE ARCHIVE</span>
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-crimson"
                  animate={{ scaleX: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </button>
            </motion.div>

            {/* Decorative corner elements */}
            <div className="absolute top-6 right-6 font-mono text-[10px] text-silver/20 tracking-widest">
              PLAY ▶
            </div>
            <div className="absolute bottom-6 left-6 font-mono text-[10px] text-silver/20 tracking-widest">
              CH-01 // OSAKA
            </div>
          </motion.div>
        ) : (
          /* COMMAND HUB — Two buttons */
          <motion.div
            key="hub"
            className="relative z-20 flex flex-col items-center justify-center h-full px-6 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <motion.p
              className="font-mono text-xs tracking-[0.5em] text-silver/40 mb-8 uppercase"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Select Transmission
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <ArcadeButton variant="crimson" onClick={() => handleNavigate('/game')}>
                PLAY GAME
              </ArcadeButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <ArcadeButton onClick={() => handleNavigate('/assets')}>
                DOWNLOAD ASSETS
              </ArcadeButton>
            </motion.div>

            <motion.div
              className="absolute bottom-12 font-mono text-[10px] text-silver/20 tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              VHS OSAKA // DIGITAL ARCHIVE v2.0
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}