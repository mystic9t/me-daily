'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  count: number;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { container: 'w-10 h-10', icon: 16, text: 'text-xs' },
  md: { container: 'w-14 h-14', icon: 24, text: 'text-sm' },
  lg: { container: 'w-20 h-20', icon: 32, text: 'text-base' },
};

export function StreakCounter({ count, isActive = true, size = 'md', className }: StreakCounterProps) {
  const sizeConfig = sizes[size];

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Animated background glow */}
      {isActive && count > 0 && (
        <motion.div
          className="absolute inset-0 rounded-full bg-orange-500/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Streak ring */}
      <motion.div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-full border-2 transition-colors duration-300',
          sizeConfig.container,
          isActive && count > 0
            ? 'border-orange-500 bg-gradient-to-br from-orange-500/20 to-red-500/10'
            : 'border-muted bg-muted/30'
        )}
        whileHover={isActive ? { scale: 1.05 } : {}}
        whileTap={isActive ? { scale: 0.95 } : {}}
      >
        <motion.div
          animate={isActive && count > 0 ? {
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0],
          } : {}}
          transition={{
            duration: 0.5,
            repeat: isActive && count > 0 ? Infinity : 0,
            repeatDelay: 3,
          }}
        >
          <Flame
            size={sizeConfig.icon}
            className={cn(
              'transition-colors duration-300',
              isActive && count > 0
                ? 'text-orange-500 fill-orange-500/30'
                : 'text-muted-foreground'
            )}
          />
        </motion.div>

        {/* Streak count */}
        {count > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              'absolute -bottom-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white shadow-lg',
              sizeConfig.text
            )}
          >
            {count}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}
