'use client';

import { useState } from 'react';
import { AppConfig, ModeConfig, HabitConfig, YogaSession, MorningRoutineStep } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface SetupEditorProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}

export function SetupEditor({ isOpen, onClose, config, onSave }: SetupEditorProps) {
  const [editedConfig, setEditedConfig] = useState<AppConfig>(config);

  const handleSave = () => {
    onSave({
      ...editedConfig,
      meta: { ...editedConfig.meta, configType: 'custom' },
    });
    onClose();
  };

  const updateMode = (mode: 'regular' | 'travel', field: keyof ModeConfig, value: string) => {
    setEditedConfig((prev) => ({
      ...prev,
      modes: {
        ...prev.modes,
        [mode]: { ...prev.modes[mode], [field]: value },
      },
    }));
  };

  const updateHabitEnabled = (habitId: string, enabled: boolean) => {
    setEditedConfig((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === habitId ? { ...h, enabled } : h)),
    }));
  };

  const updateYogaEnabled = (day: string, enabled: boolean) => {
    setEditedConfig((prev) => ({
      ...prev,
      yogaRotation: {
        ...prev.yogaRotation,
        [day]: { ...prev.yogaRotation[day], enabled },
      },
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit My Setup</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="modes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modes">Modes</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="yoga">Yoga</TabsTrigger>
            <TabsTrigger value="morning">Morning</TabsTrigger>
          </TabsList>

          <TabsContent value="modes" className="space-y-4">
            <Card className="p-4 space-y-4">
              <h3 className="font-semibold">Regular Mode</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Wake Time</Label>
                  <Input
                    type="time"
                    value={editedConfig.modes.regular.wakeTime}
                    onChange={(e) => updateMode('regular', 'wakeTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sleep Time</Label>
                  <Input
                    type="time"
                    value={editedConfig.modes.regular.sleepTime}
                    onChange={(e) => updateMode('regular', 'sleepTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Food Cutoff</Label>
                  <Input
                    type="time"
                    value={editedConfig.modes.regular.foodCutoffTime}
                    onChange={(e) => updateMode('regular', 'foodCutoffTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Yoga Time</Label>
                  <Input
                    type="time"
                    value={editedConfig.modes.regular.yogaTime}
                    onChange={(e) => updateMode('regular', 'yogaTime', e.target.value)}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="font-semibold">Travel Mode</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Wake Time</Label>
                  <Input
                    type="time"
                    value={editedConfig.modes.travel.wakeTime}
                    onChange={(e) => updateMode('travel', 'wakeTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sleep Time</Label>
                  <Input
                    type="time"
                    value={editedConfig.modes.travel.sleepTime}
                    onChange={(e) => updateMode('travel', 'sleepTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Food Cutoff</Label>
                  <Input
                    type="time"
                    value={editedConfig.modes.travel.foodCutoffTime}
                    onChange={(e) => updateMode('travel', 'foodCutoffTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Yoga Time</Label>
                  <Input
                    type="time"
                    value={editedConfig.modes.travel.yogaTime}
                    onChange={(e) => updateMode('travel', 'yogaTime', e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="habits" className="space-y-2">
            {editedConfig.habits.map((habit) => (
              <Card key={habit.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{habit.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {habit.trigger.type === 'fixed' ? `At ${habit.trigger.time}` : 'Dynamic'}
                  </p>
                </div>
                <Switch
                  checked={habit.enabled}
                  onCheckedChange={(checked) => updateHabitEnabled(habit.id, checked)}
                />
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="yoga" className="space-y-2">
            {Object.entries(editedConfig.yogaRotation).map(([day, session]) => (
              <Card key={day} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={session.enabled}
                      onCheckedChange={(checked) => updateYogaEnabled(day, checked)}
                    />
                    <span className="font-medium">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parseInt(day)]}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{session.name}</span>
                </div>
                {session.enabled && (
                  <div className="pl-12 space-y-1 text-sm text-muted-foreground">
                    {session.poses.map((pose, i) => (
                      <p key={i}>{pose.name} ({pose.duration}m)</p>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="morning" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Regular Morning Routine</h3>
              <div className="space-y-2">
                {editedConfig.morningRoutine.regular.map((step, i) => (
                  <div key={step.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{step.label}</span>
                    <span className="text-xs text-muted-foreground">{step.duration}m</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Travel Morning Routine</h3>
              <div className="space-y-2">
                {editedConfig.morningRoutine.travel.map((step, i) => (
                  <div key={step.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{step.label}</span>
                    <span className="text-xs text-muted-foreground">{step.duration}m</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
