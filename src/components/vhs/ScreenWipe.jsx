import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScreenWipe({ active, onComplete }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[100] bg-silver/10"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [0, 1, 1, 0] }}
          transition={{ duration: 0.8, times: [0, 0.3, 0.6, 1], ease: 'easeInOut' }}
          onAnimationComplete={onComplete}
          style={{ transformOrigin: 'center' }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-1 bg-crimson" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}