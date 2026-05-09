import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import VHSOverlay from '../components/vhs/VHSOverlay';
import RecIndicator from '../components/vhs/RecIndicator';
import GameCanvas from '../components/game/GameCanvas';
import GameOverlay from '../components/game/GameOverlay';

export default function Game() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('playing'); // playing | won | lost
  const [gameKey, setGameKey] = useState(0);

  const handleWin = useCallback(() => setGameState('won'), []);
  const handleLose = useCallback(() => setGameState('lost'), []);

  const handleRetry = useCallback(() => {
    setGameState('playing');
    setGameKey(k => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-obsidian flex flex-col">
      <VHSOverlay />
      <RecIndicator />

      {/* Header */}
      <div className="relative z-10 px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-mono text-xs tracking-widest text-silver/40 hover:text-crimson transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          ABORT
        </button>
        <span className="font-pixel text-[10px] text-silver/20 tracking-widest">NEO-OSAKA GAUNTLET</span>
      </div>

      {/* Game area */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <GameCanvas key={gameKey} onWin={handleWin} onLose={handleLose} />
          </motion.div>
        </div>
      </div>

      {/* Game over overlays */}
      {gameState === 'won' && <GameOverlay type="win" />}
      {gameState === 'lost' && <GameOverlay type="lose" onRetry={handleRetry} />}
    </div>
  );
}