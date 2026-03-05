'use client';

import { useState, useMemo } from 'react';
import { AppData, HabitConfig, HabitLog, DayLog } from '@/types';
import { filterHabitsForDay, getDayType, formatDate, formatDisplayDate, getHabitDisplayTime, getScheduledTime } from '@/lib/utils-helpers';
import { HabitCard } from './HabitCard';
import { GymLogger } from './GymLogger';
import { YogaSession } from './YogaSession';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface TodayViewProps {
  data: AppData;
  onLogHabit: (date: string, habitId: string, log: HabitLog) => void;
}

export function TodayView({ data, onLogHabit }: TodayViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [gymLoggerOpen, setGymLoggerOpen] = useState(false);
  const [yogaSessionOpen, setYogaSessionOpen] = useState(false);
  const [selectedYogaDay, setSelectedYogaDay] = useState<string | null>(null);

  const dateStr = formatDate(selectedDate);
  const dayType = getDayType(selectedDate, data.config);
  const mode = data.config.settings.weekMode;
  
  const dayLog: DayLog | undefined = data.days[dateStr];
  
  const habits = useMemo(() => {
    return filterHabitsForDay(data.config.habits, mode, dayType);
  }, [data.config.habits, mode, dayType]);

  const handleLogHabit = (habitId: string, log: HabitLog) => {
    onLogHabit(dateStr, habitId, log);
  };

  const handleHabitTap = (habit: HabitConfig) => {
    if (habit.id === 'gym') {
      setGymLoggerOpen(true);
    } else if (habit.id === 'yoga' || habit.id === 'yoga-travel') {
      setSelectedYogaDay(selectedDate.getDay().toString());
      setYogaSessionOpen(true);
    } else {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      handleLogHabit(habit.id, { status: 'done', time });
    }
  };

  const handleLongPress = (habit: HabitConfig) => {
    handleLogHabit(habit.id, { status: 'skipped', note: '' });
  };

  const isToday = dateStr === formatDate(new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{isToday ? 'Today' : formatDisplayDate(selectedDate)}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium capitalize">
              {mode}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium capitalize">
              {dayType}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const today = new Date();
            setSelectedDate(today);
          }}
          className={!isToday ? 'bg-primary/10' : ''}
        >
          <Calendar className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => {
          const log = dayLog?.habits[habit.id];
          const { time, isDynamic, isOverdue } = getHabitDisplayTime(habit, dayLog, data.config);
          
          return (
            <HabitCard
              key={habit.id}
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
          );
        })}
      </div>

      <GymLogger
        isOpen={gymLoggerOpen}
        onClose={() => setGymLoggerOpen(false)}
        dayType={dayType}
        mode={mode}
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
    </div>
  );
}
