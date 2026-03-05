'use client';

import { useState, useMemo } from 'react';
import { AppData } from '@/types';
import { formatDate, getDayType, filterHabitsForDay, getScoreColor, getWeekDates, calculateWeekScore } from '@/lib/utils-helpers';
import { Card } from '@/components/ui/card';
import { StreakCounter } from './StreakCounter';
import { ProgressRing } from './ProgressRing';
import { Trophy, TrendingUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsViewProps {
  data: AppData;
}

export function StatsView({ data }: StatsViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getDayColor = (date: Date) => {
    const dateStr = formatDate(date);
    const dayLog = data.days[dateStr];
    
    if (!dayLog) return 'bg-muted/30';
    
    const dayType = getDayType(date, data.config);
    const habits = filterHabitsForDay(data.config.habits, dayLog.mode, dayType);
    
    let done = 0;
    let total = 0;
    
    for (const habit of habits) {
      if (habit.enabled) {
        total++;
        if (dayLog.habits[habit.id]?.status === 'done') {
          done++;
        }
      }
    }
    
    if (total === 0) return 'bg-muted/30';
    
    const percentage = (done / total) * 100;
    
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-green-400';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    if (percentage > 0) return 'bg-red-500';
    return 'bg-muted/50';
  };

  const monthDays = useMemo(() => getMonthDays(currentDate), [currentDate]);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Weekly scorecard
  const weekDates = getWeekDates(new Date());
  const { current, target, percentage } = calculateWeekScore(weekDates, data.days, data.config);
  const scoreColor = getScoreColor(percentage);

  // Streaks
  const getCurrentStreak = () => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);
      const dayLog = data.days[dateStr];
      
      if (!dayLog) break;
      
      const dayType = getDayType(date, data.config);
      const habits = filterHabitsForDay(data.config.habits, dayLog.mode, dayType);
      
      let done = 0;
      let total = 0;
      
      for (const habit of habits) {
        if (habit.enabled) {
          total++;
          if (dayLog.habits[habit.id]?.status === 'done') {
            done++;
          }
        }
      }
      
      if (total > 0 && done === total) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  const streak = getCurrentStreak();

  // Monthly stats
  const getMonthStats = () => {
    let perfectDays = 0;
    let totalDays = 0;
    let completedHabits = 0;
    let totalHabits = 0;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date > new Date()) break;
      
      const dateStr = formatDate(date);
      const dayLog = data.days[dateStr];
      
      if (dayLog) {
        const dayType = getDayType(date, data.config);
        const habits = filterHabitsForDay(data.config.habits, dayLog.mode, dayType);
        
        let dayDone = 0;
        let dayTotal = 0;
        
        for (const habit of habits) {
          if (habit.enabled) {
            dayTotal++;
            totalHabits++;
            if (dayLog.habits[habit.id]?.status === 'done') {
              dayDone++;
              completedHabits++;
            }
          }
        }
        
        if (dayTotal > 0 && dayDone === dayTotal) {
          perfectDays++;
        }
        totalDays++;
      }
    }

    return {
      perfectDays,
      totalDays,
      completedHabits,
      totalHabits,
      completionRate: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0
    };
  };

  const monthStats = getMonthStats();

  return (
    <div className="space-y-4">
      {/* Weekly Scorecard */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            This Week
          </h2>
          <span className="text-sm text-muted-foreground">
            {current}/{target} pts
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ProgressRing 
            progress={percentage} 
            size={80} 
            strokeWidth={8}
            showPercentage
          />
          
          <div className="flex-1 space-y-2">
            {weekDates.map((date, i) => {
              const dateStr = formatDate(date);
              const dayLog = data.days[dateStr];
              const dayType = getDayType(date, data.config);
              const habits = filterHabitsForDay(data.config.habits, data.config.settings.weekMode, dayType);
              
              let done = 0;
              let total = 0;
              
              for (const habit of habits) {
                const isScored = data.config.scorecard.some((s) => s.habitId === habit.id);
                if (isScored) {
                  total++;
                  if (dayLog?.habits[habit.id]?.status === 'done') {
                    done++;
                  }
                }
              }
              
              const dayDone = total > 0 ? (done / total) * 100 : 0;
              const isToday = formatDate(new Date()) === dateStr;
              
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-8">
                    {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                  </span>
                  <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full transition-all',
                        dayDone === 100 ? 'bg-green-500' :
                        dayDone >= 75 ? 'bg-green-400' :
                        dayDone >= 50 ? 'bg-yellow-500' :
                        dayDone > 0 ? 'bg-orange-500' : 'bg-muted'
                      )}
                      style={{ width: `${dayDone}%` }}
                    />
                  </div>
                  {isToday && (
                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">Today</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <StreakCounter count={streak} size="sm" />
          <p className="text-[10px] text-muted-foreground mt-1">Current Streak</p>
        </Card>
        
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-green-500">{monthStats.perfectDays}</div>
          <p className="text-[10px] text-muted-foreground">Perfect Days</p>
        </Card>
        
        <Card className="p-3 text-center">
          <div className="text-lg font-bold">{monthStats.completionRate}%</div>
          <p className="text-[10px] text-muted-foreground">This Month</p>
        </Card>
      </div>

      {/* Monthly Calendar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1 hover:bg-muted rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="font-semibold text-sm">{monthName}</h3>
          <button onClick={nextMonth} className="p-1 hover:bg-muted rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-[10px] text-muted-foreground py-1">
              {day}
            </div>
          ))}
          
          {monthDays.map((date, i) => {
            if (!date) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }
            
            const isToday = formatDate(new Date()) === formatDate(date);
            const isFuture = date > new Date();
            
            return (
              <div
                key={i}
                className={cn(
                  'aspect-square rounded-full flex items-center justify-center text-xs relative',
                  isToday && 'ring-2 ring-primary',
                  isFuture && 'opacity-30'
                )}
              >
                <div className={cn(
                  'absolute inset-0.5 rounded-full',
                  getDayColor(date)
                )} />
                <span className="relative z-10">{date.getDate()}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>100%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>50%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>&lt;25%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
