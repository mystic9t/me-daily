'use client';

import { useState } from 'react';
import { AppData, AppConfig, WeekMode, DayType } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { SetupEditor } from './SetupEditor';
import { Bell, Moon, Sun, Download, Upload, RotateCcw, ChevronRight, Settings2, Smartphone, Check } from 'lucide-react';

interface SettingsViewProps {
  data: AppData;
  onUpdateConfig: (config: AppConfig) => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (json: string) => boolean;
}

export function SettingsView({ data, onUpdateConfig, onReset, onExport, onImport }: SettingsViewProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [setupEditorOpen, setSetupEditorOpen] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState('');

  const handleModeChange = (mode: WeekMode) => {
    onUpdateConfig({
      ...data.config,
      settings: {
        ...data.config.settings,
        weekMode: mode,
      },
    });
  };

  const handleNotificationToggle = (key: keyof typeof data.config.settings.notifications) => {
    onUpdateConfig({
      ...data.config,
      settings: {
        ...data.config.settings,
        notifications: {
          ...data.config.settings.notifications,
          [key]: !data.config.settings.notifications[key],
        },
      },
    });
  };

  const handleImport = () => {
    if (!importJson.trim()) {
      setImportError('Please paste a valid JSON config');
      return;
    }
    
    const success = onImport(importJson);
    if (success) {
      setImportDialogOpen(false);
      setImportJson('');
      setImportError('');
    } else {
      setImportError('Invalid config JSON');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card className="p-4 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Sun className="w-4 h-4" />
          Week Mode
        </h2>
        
        <div className="flex gap-2">
          <Button
            variant={data.config.settings.weekMode === 'regular' ? 'default' : 'outline'}
            onClick={() => handleModeChange('regular')}
            className="flex-1"
          >
            Regular
          </Button>
          <Button
            variant={data.config.settings.weekMode === 'travel' ? 'default' : 'outline'}
            onClick={() => handleModeChange('travel')}
            className="flex-1"
          >
            Travel
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {data.config.settings.weekMode === 'regular' ? (
            <p>Wake {data.config.modes.regular.wakeTime} • Sleep {data.config.modes.regular.sleepTime}</p>
          ) : (
            <p>Wake {data.config.modes.travel.wakeTime} • Sleep {data.config.modes.travel.sleepTime}</p>
          )}
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Notifications
        </h2>
        
        {Object.entries(data.config.settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key} className="text-sm capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Label>
            <Switch
              id={key}
              checked={value}
              onCheckedChange={() => handleNotificationToggle(key as keyof typeof data.config.settings.notifications)}
            />
          </div>
        ))}
      </Card>

      <Card className="p-4 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          Setup
        </h2>
        
        <div className="space-y-2">
          <Button 
            onClick={() => setSetupEditorOpen(true)} 
            variant="outline" 
            className="w-full justify-between"
          >
            <span>Edit My Setup</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Customize your habits, schedules, morning routine, and yoga sessions.
        </p>
      </Card>

      <Card className="p-4 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Download className="w-4 h-4" />
          Config
        </h2>
        
        <div className="space-y-2">
          <Button onClick={onExport} variant="outline" className="w-full justify-between">
            <span>Export Config</span>
            <Download className="w-4 h-4" />
          </Button>
          
          <Button onClick={() => setImportDialogOpen(true)} variant="outline" className="w-full justify-between">
            <span>Import Config</span>
            <Upload className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Export your config to sync across devices or share with others.
        </p>
      </Card>

      <Card className="p-4 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          Install App
        </h2>
        
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Install DayStack on your home screen for quick access:
          </p>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
              <div>
                <p className="font-medium">iPhone / iPad</p>
                <p className="text-muted-foreground">Tap the share button in Safari, then &quot;Add to Home Screen&quot;</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
              <div>
                <p className="font-medium">Android</p>
                <p className="text-muted-foreground">Tap the menu (⋮), then &quot;Add to Home screen&quot; or &quot;Install app&quot;</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h2 className="font-semibold flex items-center gap-2 text-destructive">
          <RotateCcw className="w-4 h-4" />
          Reset
        </h2>
        
        <Button
          onClick={() => setShowResetConfirm(true)}
          variant="destructive"
          className="w-full"
        >
          Reset to DASH-MetS Config
        </Button>
        
        <p className="text-xs text-muted-foreground">
          This will replace all your customizations with the default DASH-MetS setup. Your logged history will not be affected.
        </p>
      </Card>

      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset to Default?</DialogTitle>
            <DialogDescription>
              This will replace all your customizations with the default DASH-MetS setup.
              Your logged history will not be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onReset();
                setShowResetConfirm(false);
              }}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Config</DialogTitle>
            <DialogDescription>
              Paste your config JSON below to restore or import a setup.
            </DialogDescription>
          </DialogHeader>
          
          <textarea
            value={importJson}
            onChange={(e) => {
              setImportJson(e.target.value);
              setImportError('');
            }}
            placeholder="Paste config JSON here..."
            className="w-full h-32 p-3 text-sm border rounded-md bg-background resize-none"
          />
          
          {importError && (
            <p className="text-sm text-destructive">{importError}</p>
          )}
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SetupEditor
        isOpen={setupEditorOpen}
        onClose={() => setSetupEditorOpen(false)}
        config={data.config}
        onSave={onUpdateConfig}
      />
    </div>
  );
}
