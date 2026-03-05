'use client';

import { useState, useEffect } from 'react';
import { HabitLog, YogaSession as YogaSessionType } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Check, SkipForward, Volume2 } from 'lucide-react';

interface YogaSessionProps {
  isOpen: boolean;
  onClose: () => void;
  session: YogaSessionType | null;
  existingLog: HabitLog | undefined;
  onLog: (log: HabitLog) => void;
}

export function YogaSession({ isOpen, onClose, session, existingLog, onLog }: YogaSessionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const poses = session?.poses || [];
  const currentPose = poses[currentPoseIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeRemaining === 0 && currentPoseIndex < poses.length - 1) {
      setCurrentPoseIndex((prev) => prev + 1);
      setTimeRemaining(poses[currentPoseIndex + 1].duration * 60);
      playChime();
    } else if (isPlaying && timeRemaining === 0 && currentPoseIndex === poses.length - 1) {
      setIsPlaying(false);
      setIsComplete(true);
      playChime();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, currentPoseIndex, poses]);

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
    if (!isPlaying && timeRemaining === 0 && currentPose) {
      setTimeRemaining(currentPose.duration * 60);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleSkip = () => {
    if (currentPoseIndex < poses.length - 1) {
      setCurrentPoseIndex((prev) => prev + 1);
      setTimeRemaining(poses[currentPoseIndex + 1].duration * 60);
      playChime();
    }
  };

  const handleMarkDone = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    onLog({
      status: 'done',
      time: now,
      session: session?.name,
    });
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{session.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isComplete || existingLog?.status === 'done' ? (
            <div className="text-center py-6">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Session Complete</p>
              <p className="text-sm text-muted-foreground">{existingLog?.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Pose {currentPoseIndex + 1} of {poses.length}
                </p>
                <h3 className="text-xl font-semibold mb-2">{currentPose?.name}</h3>
                <div className="text-3xl font-mono font-bold text-primary">
                  {formatTime(timeRemaining)}
                </div>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1">
                {poses.map((pose, index) => (
                  <div
                    key={index}
                    className={`flex justify-between p-2 rounded text-sm ${
                      index === currentPoseIndex ? 'bg-primary/20 font-medium' : ''
                    } ${index < currentPoseIndex ? 'opacity-50' : ''}`}
                  >
                    <span>{pose.name}</span>
                    <span className="text-muted-foreground">{pose.duration}m</span>
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
                  <Button onClick={handleStart} className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    {timeRemaining > 0 ? 'Resume' : 'Start Session'}
                  </Button>
                )}
                
                <Button onClick={handleSkip} variant="outline" size="icon" disabled={currentPoseIndex >= poses.length - 1}>
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
