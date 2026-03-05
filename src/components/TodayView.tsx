'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AppData, HabitConfig, HabitLog, DayLog } from '@/types';
import { filterHabitsForDay, getDayType, formatDate, getHabitDisplayTime, getDayKey } from '@/lib/utils-helpers';
import { HabitCard } from './HabitCard';
import { GymLogger } from './GymLogger';
import { YogaSession } from './YogaSession';
import { MorningRoutine } from './MorningRoutine';
import { Celebration } from './Celebration';
import { StreakCounter } from './StreakCounter';
import { ProgressRing } from './ProgressRing';
import { Zap } from 'lucide-react';

interface TodayViewProps {
  data: AppData;
  onLogHabit: (date: string, habitId: string, log: HabitLog) => void;
  selectedDate: Date;
  onDateChange: React.Dispatch<React.SetStateAction<Date>>;
}

function calculateStreak(data: AppData, habitId: string): number {
  const sortedDates = Object.keys(data.days).sort().reverse();
  let streak = 0;
  
  for (const dateStr of sortedDates) {
    const dayLog = data.days[dateStr];
    if (dayLog?.habits[habitId]?.status === 'done') {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export function TodayView({ data, onLogHabit, selectedDate }: TodayViewProps) {
  const [gymLoggerOpen, setGymLoggerOpen] = useState(false);
  const [yogaSessionOpen, setYogaSessionOpen] = useState(false);
  const [morningRoutineOpen, setMorningRoutineOpen] = useState(false);
  const [selectedYogaDay, setSelectedYogaDay] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{ isActive: boolean; message?: string }>({ isActive: false });
  const [lastCompletedHabit, setLastCompletedHabit] = useState<string | null>(null);

  const dateStr = formatDate(selectedDate);
  const dayType = getDayType(selectedDate, data.config);
  const mode = data.config.settings.weekMode;

  const dayLog: DayLog | undefined = data.days[dateStr];

  const habits = useMemo(() => {
    return filterHabitsForDay(data.config.habits, mode, dayType);
  }, [data.config.habits, mode, dayType]);

  const habitStreaks = useMemo(() => {
    const streaks: Record<string, number> = {};
    habits.forEach(habit => {
      streaks[habit.id] = calculateStreak(data, habit.id);
    });
    return streaks;
  }, [data, habits]);

  const handleLogHabit = useCallback((habitId: string, log: HabitLog) => {
    onLogHabit(dateStr, habitId, log);
    
    if (log.status === 'done' && lastCompletedHabit !== habitId) {
      setLastCompletedHabit(habitId);
      const streak = habitStreaks[habitId] || 0;
      const milestoneMessage = streak > 0 && streak % 7 === 0 
        ? `${streak} Day Streak!` 
        : undefined;
      
      setCelebration({ isActive: true, message: milestoneMessage });
    }
  }, [dateStr, onLogHabit, lastCompletedHabit, habitStreaks]);

  const handleHabitTap = useCallback((habit: HabitConfig) => {
    const existingLog = dayLog?.habits[habit.id];

    if (existingLog?.status === 'done') {
      handleLogHabit(habit.id, { status: 'pending' });
      return;
    }

    if (habit.id === 'gym') {
      setGymLoggerOpen(true);
    } else if (habit.id === 'yoga' || habit.id === 'yoga-travel') {
      // Get the tracking day of week - use calendar day
      const dayOfWeek = selectedDate.getDay().toString();
      setSelectedYogaDay(dayOfWeek);
      setYogaSessionOpen(true);
    } else if (habit.id === 'morningRoutine' || habit.id === 'morningRoutine-travel') {
      setMorningRoutineOpen(true);
    } else {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      handleLogHabit(habit.id, { status: 'done', time });
    }
  }, [dayLog, selectedDate, handleLogHabit]);

  const handleLongPress = useCallback((habit: HabitConfig) => {
    handleLogHabit(habit.id, { status: 'skipped', note: '' });
  }, [handleLogHabit]);

  const completedCount = habits.filter(h => dayLog?.habits[h.id]?.status === 'done').length;
  const progress = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  const activeStreaks = Object.values(habitStreaks).filter(s => s > 0).length;
  const longestStreak = Math.max(0, ...Object.values(habitStreaks));

  const morningRoutineSteps = mode === 'travel' 
    ? data.config.morningRoutine.travel 
    : data.config.morningRoutine.regular;

  return (
    <div className="space-y-4">
      <Celebration
        isActive={celebration.isActive}
        onComplete={() => setCelebration({ isActive: false })}
        type="completion"
        message={celebration.message}
      />

      <div className="flex gap-2">
        <div className="glass rounded-xl px-3 py-2 flex items-center gap-2 flex-1">
          <ProgressRing progress={progress} size={36} strokeWidth={3} />
          <span className="text-xs text-muted-foreground">{completedCount}/{habits.length}</span>
        </div>
        <div className="glass rounded-xl px-3 py-2 flex items-center gap-2 flex-1">
          <StreakCounter count={longestStreak} size="sm" />
          <span className="text-xs text-muted-foreground">{longestStreak}d best</span>
        </div>
        <div className="glass rounded-xl px-3 py-2 flex items-center gap-2 flex-1 justify-center">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">{activeStreaks} active</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs px-3 py-1 rounded-full bg-primary/15 text-primary font-semibold uppercase tracking-wider">
          {mode}
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium capitalize">
          {dayType}
        </span>
      </div>

      <div className="space-y-3">
        {habits.map((habit, index) => {
          const log = dayLog?.habits[habit.id];
          const { time, isDynamic, isOverdue } = getHabitDisplayTime(habit, dayLog, data.config);

          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <HabitCard
                habit={habit}
                log={log}
                scheduledTime={time}
                isDynamic={isDynamic}
                isOverdue={isOverdue}
                onTap={() => handleHabitTap(habit)}
                onLongPress={() => handleLongPress(habit)}
                mode={mode}
                dayType={dayType}
                config={data.config}
              />
            </motion.div>
          );
        })}
      </div>

      <GymLogger
        isOpen={gymLoggerOpen}
        onClose={() => setGymLoggerOpen(false)}
        dayType={dayType}
        config={data.config}
        existingLog={dayLog?.habits['gym']}
        onLog={(log) => handleLogHabit('gym', log)}
      />

      <YogaSession
        isOpen={yogaSessionOpen}
        onClose={() => setYogaSessionOpen(false)}
        session={selectedYogaDay ? data.config.yogaRotation[selectedYogaDay] : null}
        existingLog={selectedYogaDay ? dayLog?.habits['yoga'] || dayLog?.habits['yoga-travel'] : undefined}
        onLog={(log) => handleLogHabit(mode === 'travel' ? 'yoga-travel' : 'yoga', log)}
      />

      <MorningRoutine
        isOpen={morningRoutineOpen}
        onClose={() => setMorningRoutineOpen(false)}
        steps={morningRoutineSteps}
        existingLog={dayLog?.habits['morningRoutine'] || dayLog?.habits['morningRoutine-travel']}
        onLog={(log) => handleLogHabit(mode === 'travel' ? 'morningRoutine-travel' : 'morningRoutine', log)}
        isTravel={mode === 'travel'}
      />
    </div>
  );
}
