'use client';

import { useState } from 'react';
import { AppData, DayLog } from '@/types';
import { formatDate, getDayType, filterHabitsForDay, getScoreColor, getScoreBgColor } from '@/lib/utils-helpers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface HistoryViewProps {
  data: AppData;
}

export function HistoryView({ data }: HistoryViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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
    
    if (!dayLog) return 'bg-muted/50';
    
    const dayType = getDayType(date, data.config);
    const habits = filterHabitsForDay(data.config.habits, dayLog.mode, dayType);
    
    let done = 0;
    let total = 0;
    
    for (const habit of habits) {
      const isScored = data.config.scorecard.some((s) => s.habitId === habit.id);
      if (isScored) {
        total++;
        if (dayLog.habits[habit.id]?.status === 'done') {
          done++;
        }
      }
    }
    
    if (total === 0) return 'bg-muted/50';
    
    const percentage = (done / total) * 100;
    
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getMonthDays(currentDate);

  const handlePrevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const selectedDayLog = selectedDay ? data.days[selectedDay] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">History</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[140px] text-center">{monthName}</span>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="aspect-square" />;
            }
            
            const isToday = formatDate(date) === formatDate(new Date());
            const dayColor = getDayColor(date);
            const isSelected = selectedDay === formatDate(date);
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDay(formatDate(date))}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                  isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                } ${isToday ? 'border-2 border-primary' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dayColor} ${
                  dayColor === 'bg-muted/50' ? 'text-foreground' : 'text-white'
                }`}>
                  {date.getDate()}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>80%+</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>50-79%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>&lt;50%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted" />
          <span>No data</span>
        </div>
      </div>

      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {selectedDay ? new Date(selectedDay).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              }) : ''}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDayLog ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary capitalize">
                  {selectedDayLog.mode}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                  {selectedDayLog.dayType}
                </span>
              </div>
              
              {Object.entries(selectedDayLog.habits).map(([habitId, log]) => {
                const habit = data.config.habits.find((h) => h.id === habitId);
                if (!habit) return null;
                
                return (
                  <div
                    key={habitId}
                    className={`p-3 rounded-lg border ${
                      log.status === 'done' ? 'border-green-500/30 bg-green-500/10' : 
                      log.status === 'skipped' ? 'border-muted bg-muted/30' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{habit.label}</span>
                      <span className={`text-sm ${
                        log.status === 'done' ? 'text-green-500' : 'text-muted-foreground'
                      }`}>
                        {log.status === 'done' ? 'Done' : 'Skipped'}
                      </span>
                    </div>
                    {log.time && (
                      <p className="text-sm text-muted-foreground">Time: {log.time}</p>
                    )}
                    {log.startTime && log.endTime && (
                      <p className="text-sm text-muted-foreground">
                        {log.startTime} - {log.endTime}
                      </p>
                    )}
                    {log.note && (
                      <p className="text-sm text-muted-foreground mt-1">{log.note}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No data logged for this day.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
