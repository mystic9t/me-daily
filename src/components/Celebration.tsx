'use client';

import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';

interface CelebrationProps {
  isActive: boolean;
  onComplete?: () => void;
  type?: 'completion' | 'milestone' | 'streak';
  message?: string;
}

export function Celebration({ isActive, onComplete, type = 'completion', message }: CelebrationProps) {
  const triggerConfetti = useCallback(() => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 30,
    };

    const fire = (particleRatio: number, opts: confetti.Options, delayMs: number = 0) => {
      setTimeout(() => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(200 * particleRatio),
          origin: { x: 0.5, y: 0.6 },
        });
      }, delayMs);
    };

    fire(0.25, { colors: ['#6366f1', '#818cf8'] });
    fire(0.2, { colors: ['#22c55e', '#4ade80'] }, 100);
    fire(0.35, { colors: ['#f59e0b', '#fbbf24'] }, 200);
    fire(0.1, { colors: ['#ec4899', '#f472b6'] }, 300);
    fire(0.1, { colors: ['#3b82f6', '#60a5fa'] }, 400);
  }, []);

  useEffect(() => {
    if (isActive) {
      triggerConfetti();
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete, triggerConfetti]);

  const getIcon = () => {
    switch (type) {
      case 'milestone':
        return <Trophy className="w-12 h-12 text-amber-400" />;
      case 'streak':
        return <Sparkles className="w-12 h-12 text-orange-400" />;
      default:
        return <Star className="w-12 h-12 text-yellow-400" />;
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'milestone':
        return 'Milestone Reached!';
      case 'streak':
        return 'Streak Extended!';
      default:
        return 'Habit Completed!';
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30"
            >
              {getIcon()}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-foreground">
                {message || getDefaultMessage()}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
