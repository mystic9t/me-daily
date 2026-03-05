'use client';

import { HabitConfig, HabitLog, WeekMode, DayType, AppConfig } from '@/types';
import { motion } from 'framer-motion';
import { getIcon } from './icons';
import { cn } from '@/lib/utils';
import { Check, X, Timer, Dumbbell, Moon, Sparkles } from 'lucide-react';

interface HabitCardProps {
  habit: HabitConfig;
  log: HabitLog | undefined;
  scheduledTime: string | null;
  isDynamic: boolean;
  isOverdue: boolean;
  onTap: () => void;
  onLongPress: () => void;
  mode: WeekMode;
  dayType: DayType;
  config: AppConfig;
}

export function HabitCard({
  habit,
  log,
  scheduledTime,
  isDynamic,
  isOverdue,
  onTap,
  onLongPress,
}: HabitCardProps) {
  const Icon = getIcon(habit.icon);

  const handleClick = () => {
    onTap();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!log || log.status === 'pending') {
      onLongPress();
    }
  };

  const status = log?.status || 'pending';
  const isDone = status === 'done';
  const isSkipped = status === 'skipped';

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={cn(
          'relative overflow-hidden rounded-xl border-2 p-4 cursor-pointer select-none transition-all duration-300',
          isDone && 'habit-done shadow-[0_0_20px_rgba(34,197,94,0.15)]',
          isSkipped && 'habit-skipped opacity-60',
          isOverdue && !isDone && !isSkipped && 'habit-overdue',
          !isDone && !isSkipped && !isOverdue && 'habit-pending hover:border-primary/30 hover:shadow-lg'
        )}
      >
        {/* Animated gradient background for done state */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-teal-500/10"
          />
        )}

        {/* Overdue indicator stripe */}
        {isOverdue && !isDone && !isSkipped && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" />
        )}

        <div className="relative flex items-center gap-4">
          {/* Icon container with animated states */}
          <motion.div
            animate={{
              scale: isDone ? 1.05 : 1,
              backgroundColor: isDone ? 'rgba(34, 197, 94, 0.2)' : 'rgba(99, 102, 241, 0.1)',
            }}
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300',
              isDone && 'shadow-[0_0_16px_rgba(34,197,94,0.3)]',
              isSkipped && 'bg-muted/50',
              !isDone && !isSkipped && 'shadow-[0_0_16px_rgba(99,102,241,0.15)]'
            )}
          >
            {isDone ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Check className="w-6 h-6 text-green-400" />
              </motion.div>
            ) : isSkipped ? (
              <X className="w-5 h-5 text-muted-foreground" />
            ) : (
              <>
                {habit.id === 'gym' && <Dumbbell className="w-5 h-5 text-primary" />}
                {habit.id.includes('yoga') && <Moon className="w-5 h-5 text-indigo-400" />}
                {habit.id.includes('morningRoutine') && <Sparkles className="w-5 h-5 text-amber-400" />}
                {!['gym', 'yoga', 'yoga-travel', 'morningRoutine'].some(id => habit.id.includes(id)) && (
                  <Icon className="w-5 h-5 text-primary" />
                )}
              </>
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-semibold text-base truncate transition-all duration-200',
              isSkipped && 'line-through text-muted-foreground',
              isDone && 'text-foreground'
            )}>
              {habit.label}
            </h3>

            <div className="flex items-center gap-2 text-sm mt-0.5">
              {scheduledTime && (
                <span className={cn(
                  'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium transition-all',
                  isDynamic && 'italic',
                  isOverdue && !isDone && !isSkipped
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-muted-foreground bg-muted/50'
                )}>
                  {isDynamic && <Timer className="w-3 h-3" />}
                  {scheduledTime}
                </span>
              )}

              {isDone && log?.time && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-green-400 text-xs font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  {log.time}
                </motion.span>
              )}

              {isSkipped && (
                <span className="text-muted-foreground text-xs">Skipped</span>
              )}
            </div>
          </div>

          {/* Status indicator */}
          <div className="shrink-0">
            {!isDone && !isSkipped && isOverdue && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              />
            )}
            {isDone && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-green-400" />
              </motion.div>
            )}
            {isSkipped && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Note display */}
        {log?.note && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 text-xs text-muted-foreground pl-16 border-t border-border/50 pt-2"
          >
            {log.note}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
