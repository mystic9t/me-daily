import { HabitConfig, HabitTrigger, WeekMode, DayType, DayLog, AppConfig } from '@/types';
import { dayTypeSchedule } from '@/lib/config';

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

export function addMinutes(timeStr: string, minutes: number): string {
  const { hours, minutes: mins } = parseTime(timeStr);
  const date = new Date();
  date.setHours(hours, mins + minutes, 0, 0);
  return formatTime(date);
}

export function getDayType(date: Date, config: AppConfig): DayType {
  const dateStr = date.toISOString().split('T')[0];
  const override = config.settings.dayTypeOverrides[dateStr];
  if (override) return override;
  return dayTypeSchedule[date.getDay()];
}

export function getScheduledTime(
  habit: HabitConfig,
  dayLog: DayLog | undefined,
  config: AppConfig
): string | null {
  const trigger = habit.trigger;

  if (trigger.type === 'fixed' && trigger.time) {
    return trigger.time;
  }

  if (trigger.type === 'dynamic' && trigger.afterHabitId && trigger.offsetMinutes !== undefined) {
    const afterLog = dayLog?.habits[trigger.afterHabitId];
    if (afterLog?.status === 'done') {
      const baseTime = afterLog.endTime || afterLog.time;
      if (baseTime) {
        return addMinutes(baseTime, trigger.offsetMinutes);
      }
    }
  }

  return null;
}

export function filterHabitsForDay(
  habits: HabitConfig[],
  mode: WeekMode,
  dayType: DayType
): HabitConfig[] {
  return habits.filter(
    (h) =>
      h.enabled &&
      h.appliesTo.modes.includes(mode) &&
      h.appliesTo.dayTypes.includes(dayType)
  );
}

export function getHabitDisplayTime(
  habit: HabitConfig,
  dayLog: DayLog | undefined,
  config: AppConfig
): { time: string | null; isDynamic: boolean; isOverdue: boolean } {
  const scheduledTime = getScheduledTime(habit, dayLog, config);
  const now = formatTime(new Date());
  const isDynamic = habit.trigger.type === 'dynamic';
  const isOverdue = scheduledTime ? scheduledTime < now : false;

  return { time: scheduledTime, isDynamic, isOverdue };
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

export function getWeekDates(date: Date): Date[] {
  const weekStart = getWeekStart(date);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function calculateWeekScore(
  weekDates: Date[],
  days: Record<string, DayLog>,
  config: AppConfig
): { current: number; target: number; percentage: number } {
  let totalDone = 0;
  let totalTarget = 0;

  for (const date of weekDates) {
    const dateStr = date.toISOString().split('T')[0];
    const dayLog = days[dateStr];
    const dayType = getDayType(date, config);
    const habits = filterHabitsForDay(config.habits, config.settings.weekMode, dayType);

    for (const habit of habits) {
      const isScored = config.scorecard.some((s) => s.habitId === habit.id);
      if (isScored && dayLog?.habits[habit.id]?.status === 'done') {
        totalDone++;
      }
      if (isScored) {
        totalTarget++;
      }
    }
  }

  const percentage = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0;
  return { current: totalDone, target: totalTarget, percentage };
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-500';
  if (percentage >= 50) return 'text-yellow-500';
  return 'text-red-500';
}

export function getScoreBgColor(percentage: number): string {
  if (percentage >= 80) return 'bg-green-500/20';
  if (percentage >= 50) return 'bg-yellow-500/20';
  return 'bg-red-500/20';
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
