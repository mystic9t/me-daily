'use client';

import { useState } from 'react';
import { HabitLog, DayType, WeekMode, AppConfig } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Timer, AlertCircle } from 'lucide-react';

interface GymLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  dayType: DayType;
  mode: WeekMode;
  config: AppConfig;
  existingLog: HabitLog | undefined;
  onLog: (log: HabitLog) => void;
}

export function GymLogger({ isOpen, onClose, dayType, mode, config, existingLog, onLog }: GymLoggerProps) {
  const [startTime, setStartTime] = useState<string | null>(existingLog?.startTime || null);
  const [endTime, setEndTime] = useState<string | null>(existingLog?.endTime || null);

  const dayTypeConfig = config.dayTypes[dayType];
  const isLate = endTime && endTime > '20:30';

  const handleStart = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setStartTime(now);
  };

  const handleEnd = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setEndTime(now);
  };

  const handleSave = () => {
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const duration = Math.round((end.getTime() - start.getTime()) / 60000);
      
      onLog({
        status: 'done',
        startTime,
        endTime,
        duration,
      });
      onClose();
    }
  };

  const handleSkip = () => {
    onLog({ status: 'skipped', note: 'Skipped gym session' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Gym Logger
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Gym window: {dayTypeConfig.gymWindowStart} - {dayTypeConfig.gymWindowEnd}</p>
            <p>Duration target: {dayTypeConfig.gymDuration} minutes</p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 p-4 border rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-2">Start</p>
              {startTime ? (
                <p className="text-xl font-semibold">{startTime}</p>
              ) : (
                <Button onClick={handleStart} size="sm">Start</Button>
              )}
            </div>
            
            <div className="flex-1 p-4 border rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-2">End</p>
              {endTime ? (
                <p className="text-xl font-semibold">{endTime}</p>
              ) : startTime ? (
                <Button onClick={handleEnd} size="sm">End</Button>
              ) : (
                <p className="text-xl font-semibold text-muted-foreground">--:--</p>
              )}
            </div>
          </div>

          {isLate && (
            <div className="flex items-center gap-2 text-sm text-amber-500 bg-amber-500/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>Finish dinner before 9pm - keep it light</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={!startTime || !endTime}
              className="flex-1"
            >
              Log Session
            </Button>
            <Button onClick={handleSkip} variant="outline">
              Skip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
