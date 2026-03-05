'use client';

import { useState } from 'react';
import { AppData, AppConfig, WeekMode, DayType } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { SetupEditor } from './SetupEditor';
import { Bell, Sun, Download, Upload, RotateCcw, ChevronRight, Settings2, Smartphone, Trash2, Calendar } from 'lucide-react';

interface SettingsViewProps {
  data: AppData;
  onUpdateConfig: (config: AppConfig) => void;
  onReset: () => void;
  onResetHistory: () => void;
  onResetAll: () => void;
  onExport: () => void;
  onImport: (json: string) => boolean;
}

export function SettingsView({ data, onUpdateConfig, onReset, onResetHistory, onResetAll, onExport, onImport }: SettingsViewProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetHistoryConfirm, setShowResetHistoryConfirm] = useState(false);
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [setupEditorOpen, setSetupEditorOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    weekMode: true,
    weeklySchedule: false,
    notifications: false,
    setup: false,
    config: false,
    install: false,
    reset: false,
  });
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState('');

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDayTypeChange = (dayIndex: number, dayType: DayType) => {
    const dayKey = dayIndex.toString();
    onUpdateConfig({
      ...data.config,
      settings: {
        ...data.config.settings,
        dayTypeOverrides: {
          ...data.config.settings.dayTypeOverrides,
          [dayKey]: dayType,
        },
      },
    });
  };

  const getDayType = (dayIndex: number): DayType => {
    const dayKey = dayIndex.toString();
    return data.config.settings.dayTypeOverrides[dayKey] || 
           (dayIndex === 0 || dayIndex === 6 ? 'weekend' : 
            dayIndex === 3 || dayIndex === 4 ? 'office' : 'wfh');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderCollapsibleCard = (
    sectionKey: string,
    title: string,
    icon: React.ReactNode,
    children: React.ReactNode
  ) => (
    <Card className="overflow-hidden">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <h2 className="font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <ChevronRight 
          className={`w-4 h-4 transition-transform ${expandedSections[sectionKey] ? 'rotate-90' : ''}`} 
        />
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-4 pb-4 space-y-4">
          {children}
        </div>
      )}
    </Card>
  );

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
    <div className="space-y-3">
      {renderCollapsibleCard('weekMode', 'Week Mode', <Sun className="w-4 h-4" />, (
        <>
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
        </>
      ))}

      {renderCollapsibleCard('weeklySchedule', 'Weekly Schedule', <Calendar className="w-4 h-4" />, (
        <>
          <p className="text-xs text-muted-foreground">
            Set which days are work from home, office, or weekend
          </p>
          
          <div className="space-y-2">
            {dayNames.map((name, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium w-12">{name}</span>
                <select
                  value={getDayType(index)}
                  onChange={(e) => handleDayTypeChange(index, e.target.value as DayType)}
                  className={`flex-1 text-sm p-2 rounded border text-center ${
                    getDayType(index) === 'office' 
                      ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                      : getDayType(index) === 'wfh'
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                      : 'bg-green-500/20 border-green-500/50 text-green-400'
                  }`}
                >
                  <option value="wfh">WFH</option>
                  <option value="office">Office</option>
                  <option value="weekend">Weekend</option>
                </select>
              </div>
            ))}
          </div>
        </>
      ))}

      {renderCollapsibleCard('notifications', 'Notifications', <Bell className="w-4 h-4" />, 
        Object.entries(data.config.settings.notifications).map(([key, value]) => (
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
        ))
      )}

      {renderCollapsibleCard('setup', 'Setup', <Settings2 className="w-4 h-4" />, (
        <>
          <Button 
            onClick={() => setSetupEditorOpen(true)} 
            variant="outline" 
            className="w-full justify-between"
          >
            <span>Edit My Setup</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Customize your habits, schedules, morning routine, and yoga sessions.
          </p>
        </>
      ))}

      {renderCollapsibleCard('config', 'Config', <Download className="w-4 h-4" />, (
        <>
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
        </>
      ))}

      {renderCollapsibleCard('install', 'Install App', <Smartphone className="w-4 h-4" />, (
        <>
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
        </>
      ))}

      {renderCollapsibleCard('reset', 'Reset', <RotateCcw className="w-4 h-4 text-destructive" />, (
        <div className="space-y-3">
          <div className="p-3 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Start Date</p>
                <p className="text-xs text-primary font-semibold">{data.config.meta.startDate}</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Reset History</p>
                <p className="text-xs text-muted-foreground">Clear all tracked days, keep config</p>
              </div>
              <Button onClick={() => setShowResetHistoryConfirm(true)} variant="outline" size="sm">
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Reset Config</p>
                <p className="text-xs text-muted-foreground">Restore default habits & settings</p>
              </div>
              <Button onClick={() => setShowResetConfirm(true)} variant="outline" size="sm">
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-destructive/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-destructive">Reset Everything</p>
                <p className="text-xs text-muted-foreground">Start completely fresh</p>
              </div>
              <Button onClick={() => setShowResetAllConfirm(true)} variant="destructive" size="sm">
                <Trash2 className="w-3 h-3 mr-1" />
                Reset All
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Dialog open={showResetHistoryConfirm} onOpenChange={setShowResetHistoryConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear History?</DialogTitle>
            <DialogDescription>
              This will clear all your tracked day data. Your config settings will be preserved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowResetHistoryConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onResetHistory(); setShowResetHistoryConfirm(false); }}>
              Clear History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResetAllConfirm} onOpenChange={setShowResetAllConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Everything?</DialogTitle>
            <DialogDescription>
              This will clear ALL data including your config and history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowResetAllConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onResetAll(); setShowResetAllConfirm(false); }}>
              Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button variant="outline" onClick={() => setShowResetConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onReset(); setShowResetConfirm(false); }}>
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Config</DialogTitle>
            <DialogDescription>Paste your config JSON below to restore or import a setup.</DialogDescription>
          </DialogHeader>
          
          <textarea
            value={importJson}
            onChange={(e) => { setImportJson(e.target.value); setImportError(''); }}
            placeholder="Paste config JSON here..."
            className="w-full h-32 p-3 text-sm border rounded-md bg-background resize-none"
          />
          
          {importError && <p className="text-sm text-destructive">{importError}</p>}
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleImport}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SetupEditor isOpen={setupEditorOpen} onClose={() => setSetupEditorOpen(false)} config={data.config} onSave={onUpdateConfig} />
    </div>
  );
}
