'use client';

import { useState } from 'react';
import { useStorage } from '@/hooks/useStorage';
import { TodayView } from '@/components/TodayView';
import { HistoryView } from '@/components/HistoryView';
import { ScorecardView } from '@/components/ScorecardView';
import { SettingsView } from '@/components/SettingsView';
import { BottomNav } from '@/components/BottomNav';
import { FirstLaunchSplash } from '@/components/FirstLaunchSplash';
import { ClientNotifications } from '@/components/ClientNotifications';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';

type View = 'today' | 'history' | 'scorecard' | 'settings';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('today');
  const { data, isLoaded, logHabit, updateConfig, resetToDefault, exportConfig, importConfig } = useStorage();
  const [showSplash, setShowSplash] = useState(true);

  if (!isLoaded || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (showSplash && data.config.meta.configType === 'default') {
    return (
      <FirstLaunchSplash 
        config={data.config} 
        onComplete={() => setShowSplash(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <ClientNotifications config={data.config} />
      <PwaInstallPrompt />
      <main className="max-w-md mx-auto px-4 py-6 safe-area-top">
        {currentView === 'today' && (
          <TodayView 
            data={data} 
            onLogHabit={logHabit} 
          />
        )}
        {currentView === 'history' && (
          <HistoryView data={data} />
        )}
        {currentView === 'scorecard' && (
          <ScorecardView data={data} />
        )}
        {currentView === 'settings' && (
          <SettingsView 
            data={data}
            onUpdateConfig={updateConfig}
            onReset={resetToDefault}
            onExport={exportConfig}
            onImport={importConfig}
          />
        )}
      </main>
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}
