'use client';

import { HabitConfig, HabitLog, WeekMode, DayType, AppConfig } from '@/types';
import { Card } from '@/components/ui/card';
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

  const getStatusStyles = () => {
    if (!log || log.status === 'pending') {
      if (isOverdue) return 'border-amber-500/50 bg-amber-500/5';
      return 'border-border bg-card hover:bg-accent/50';
    }
    if (log.status === 'done') return 'border-green-500/50 bg-green-500/10';
    if (log.status === 'skipped') return 'border-muted bg-muted/30 opacity-60';
    return 'border-border bg-card';
  };

  const getStatusIcon = () => {
    if (!log || log.status === 'pending') {
      if (habit.id === 'gym') return <Dumbbell className="w-5 h-5" />;
      if (habit.id.includes('yoga')) return <Moon className="w-5 h-5" />;
      if (habit.id.includes('morningRoutine')) return <Sparkles className="w-5 h-5" />;
      return <Icon className="w-5 h-5" />;
    }
    if (log.status === 'done') return <Check className="w-5 h-5 text-green-500" />;
    if (log.status === 'skipped') return <X className="w-5 h-5 text-muted-foreground" />;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <Card
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={cn(
        'p-4 border-2 transition-all cursor-pointer select-none',
        getStatusStyles()
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
          log?.status === 'done' ? 'bg-green-500/20' : 'bg-primary/10'
        )}>
          {getStatusIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-medium truncate',
            log?.status === 'skipped' && 'line-through text-muted-foreground'
          )}>
            {habit.label}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {scheduledTime && (
              <span className={cn(
                'flex items-center gap-1',
                isDynamic && 'italic',
                isOverdue && !log && 'text-amber-500 font-medium'
              )}>
                {isDynamic && <Timer className="w-3 h-3" />}
                {scheduledTime}
              </span>
            )}
            
            {log?.status === 'done' && log.time && (
              <span className="text-green-500">Done at {log.time}</span>
            )}
            
            {log?.status === 'skipped' && (
              <span className="text-muted-foreground">Skipped</span>
            )}
          </div>
        </div>

        {!log || log.status === 'pending' ? (
          isOverdue && (
            <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          )
        ) : log.status === 'done' ? (
          <Check className="w-5 h-5 text-green-500 shrink-0" />
        ) : (
          <X className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </div>
      
      {log?.note && (
        <p className="mt-2 text-xs text-muted-foreground pl-14">{log.note}</p>
      )}
    </Card>
  );
}
