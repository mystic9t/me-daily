'use client';

import { useState } from 'react';
import { AppData } from '@/types';
import { getWeekDates, formatDate, formatDisplayDate, getDayType, filterHabitsForDay, getScoreColor, calculateWeekScore } from '@/lib/utils-helpers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Trophy, TrendingUp } from 'lucide-react';

interface ScorecardViewProps {
  data: AppData;
}

export function ScorecardView({ data }: ScorecardViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekDates = getWeekDates(currentWeek);
  
  const { current, target, percentage } = calculateWeekScore(weekDates, data.days, data.config);
  const scoreColor = getScoreColor(percentage);

  const getDayScore = (date: Date) => {
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
    
    return { done, total, percentage: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  const getStreak = () => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
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
      
      if (total > 0 && done >= total * 0.6) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  const streak = getStreak();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scorecard</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const prev = new Date(currentWeek);
              prev.setDate(prev.getDate() - 7);
              setCurrentWeek(prev);
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {formatDisplayDate(weekDates[0]).split(',')[0]} - {formatDisplayDate(weekDates[6]).split(',')[0]}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const next = new Date(currentWeek);
              next.setDate(next.getDate() + 7);
              setCurrentWeek(next);
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Weekly Score</p>
            <p className={`text-4xl font-bold ${scoreColor}`}>
              {percentage}%
            </p>
          </div>
          <Trophy className={`w-12 h-12 ${scoreColor} opacity-50`} />
        </div>
        <div className="text-sm text-muted-foreground">
          {current} of {target} habits completed
        </div>
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Current Streak</h2>
        </div>
        <p className="text-3xl font-bold">{streak} days</p>
        <p className="text-sm text-muted-foreground mt-1">
          Keep going! You&apos;re building great habits.
        </p>
      </Card>

      <div className="space-y-3">
        <h2 className="font-semibold">Daily Breakdown</h2>
        {weekDates.map((date) => {
          const score = getDayScore(date);
          const isToday = formatDate(date) === formatDate(new Date());
          
          return (
            <Card
              key={date.toISOString()}
              className={`p-4 flex items-center justify-between ${
                isToday ? 'border-primary' : ''
              }`}
            >
              <div>
                <p className="font-medium">{formatDisplayDate(date)}</p>
                <p className="text-sm text-muted-foreground">
                  {score.done} of {score.total} habits
                </p>
              </div>
              <div className={`text-lg font-bold ${getScoreColor(score.percentage)}`}>
                {score.percentage}%
              </div>
            </Card>
          );
        })}
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">Targets</h2>
        {data.config.scorecard.map((target) => {
          const habit = data.config.habits.find((h) => h.id === target.habitId);
          if (!habit) return null;
          
          return (
            <Card key={target.habitId} className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{habit.label}</span>
                <span className="text-sm text-muted-foreground">
                  Target: {target.target}/week • Min: {target.minimum}/week
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
