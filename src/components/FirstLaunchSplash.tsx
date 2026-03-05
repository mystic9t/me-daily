'use client';

import { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { AppConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FirstLaunchSplashProps {
  config: AppConfig;
  onComplete: () => void;
}

export function FirstLaunchSplash({ config, onComplete }: FirstLaunchSplashProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Your schedule is ready',
      description: 'DayStack comes pre-configured with the DASH-MetS health protocol. Everything is set up for you.',
    },
    {
      title: 'Week Modes',
      description: `Regular Mode: Wake ${config.modes.regular.wakeTime}, Sleep ${config.modes.regular.sleepTime}\nTravel Mode: Wake ${config.modes.travel.wakeTime}, Sleep ${config.modes.travel.sleepTime}`,
    },
    {
      title: 'Daily Habits',
      description: 'Morning routine, gym sessions, post-dinner walks, nightly yoga, and more. All scheduled automatically.',
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">DayStack</h1>
          <p className="text-muted-foreground">Health Tracker</p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{step + 1}</span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">{currentStep.title}</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {currentStep.description}
            </p>
          </div>

          <div className="flex justify-center gap-2 pt-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </Card>

        <div className="space-y-3">
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="w-full" size="lg">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={onComplete} className="w-full" size="lg">
              <Check className="w-4 h-4 mr-2" />
              Looks good, let&apos;s go
            </Button>
          )}
          
          <button
            onClick={onComplete}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Edit Setup
          </button>
        </div>
      </div>
    </div>
  );
}
