'use client';

import { useState, useEffect } from 'react';
import { HabitLog, MorningRoutineStep } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Check, SkipForward, Sun } from 'lucide-react';

interface MorningRoutineProps {
  isOpen: boolean;
  onClose: () => void;
  steps: MorningRoutineStep[];
  existingLog: HabitLog | undefined;
  onLog: (log: HabitLog) => void;
  isTravel?: boolean;
}

export function MorningRoutine({ isOpen, onClose, steps, existingLog, onLog, isTravel = false }: MorningRoutineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeRemaining === 0 && currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setTimeRemaining((steps[currentStepIndex + 1]?.duration || 1) * 60);
      playChime();
    } else if (isPlaying && timeRemaining === 0 && currentStepIndex === steps.length - 1) {
      setIsPlaying(false);
      setIsComplete(true);
      playChime();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, currentStepIndex, steps]);

  const playChime = () => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 528;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch {
      // Audio not supported
    }
  };

  const handleStart = () => {
    if (!isPlaying && timeRemaining === 0 && currentStep) {
      setTimeRemaining(currentStep.duration * 60);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleSkip = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setTimeRemaining((steps[currentStepIndex + 1]?.duration || 1) * 60);
      playChime();
    }
  };

  const handleMarkDone = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    onLog({
      status: 'done',
      time: now,
      note: `Completed ${currentStepIndex + 1}/${steps.length} steps`,
    });
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            {isTravel ? 'Morning Routine + Hotel Circuit' : 'Morning Routine'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isComplete || existingLog?.status === 'done' ? (
            <div className="text-center py-6">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Routine Complete</p>
              <p className="text-sm text-muted-foreground">{existingLog?.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Step {currentStepIndex + 1} of {steps.length}
                </p>
                <h3 className="text-lg font-semibold mb-2">{currentStep?.label}</h3>
                <div className="text-3xl font-mono font-bold text-amber-500">
                  {formatTime(timeRemaining)}
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex justify-between p-2 rounded text-sm ${
                      index === currentStepIndex ? 'bg-amber-500/20 font-medium' : ''
                    } ${index < currentStepIndex ? 'opacity-50 line-through' : ''}`}
                  >
                    <span>{step.label}</span>
                    <span className="text-muted-foreground">{step.duration}m</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {isPlaying ? (
                  <Button onClick={handlePause} variant="outline" className="flex-1">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button onClick={handleStart} className="flex-1 bg-amber-500 hover:bg-amber-600">
                    <Play className="w-4 h-4 mr-2" />
                    {timeRemaining > 0 ? 'Resume' : 'Start Routine'}
                  </Button>
                )}
                
                <Button 
                  onClick={handleSkip} 
                  variant="outline" 
                  size="icon" 
                  disabled={currentStepIndex >= steps.length - 1}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              <Button onClick={handleMarkDone} variant="secondary" className="w-full">
                <Check className="w-4 h-4 mr-2" />
                Mark Done Without Timer
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
