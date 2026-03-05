'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStorage } from '@/hooks/useStorage';
import { TodayView } from '@/components/TodayView';
import { StatsView } from '@/components/StatsView';
import { SettingsView } from '@/components/SettingsView';
import { FirstLaunchSplash } from '@/components/FirstLaunchSplash';
import { ClientNotifications } from '@/components/ClientNotifications';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';
import { Activity, MoreHorizontal, ChevronLeft, ChevronRight, Calendar, Home as HomeIcon, BarChart3 } from 'lucide-react';
import { WeekMode } from '@/types';
import { getDayKey } from '@/lib/utils-helpers';

type View = 'today' | 'stats' | 'settings';

const SPLASH_SHOWN_KEY = 'daystack-splash-shown';

const getLocalDateString = (d: Date = new Date()) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('today');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data, isLoaded, logHabit, updateConfig, resetToDefault, resetHistory, resetAll, exportConfig } = useStorage();
  const [showSplash, setShowSplash] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const views: View[] = ['today', 'stats', 'settings'];
  const currentViewIndex = views.indexOf(currentView);

  const navigateView = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentViewIndex + 1) % views.length 
      : (currentViewIndex - 1 + views.length) % views.length;
    setCurrentView(views[newIndex]);
  };

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem(SPLASH_SHOWN_KEY);
    if (!hasSeenSplash) {
      setShowSplash(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSplashComplete = () => {
    localStorage.setItem(SPLASH_SHOWN_KEY, 'true');
    setShowSplash(false);
  };

  const handleModeChange = (mode: WeekMode) => {
    if (!data) return;
    updateConfig({
      ...data.config,
      settings: {
        ...data.config.settings,
        weekMode: mode,
      },
    });
  };

  const isToday = getDayKey(selectedDate) === getLocalDateString();

  const getViewTitle = () => {
    if (currentView === 'today') {
      return isToday ? 'Today' : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    if (currentView === 'stats') return 'Progress';
    return 'Settings';
  };

  if (!isLoaded || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">Loading DayStack...</span>
        </motion.div>
      </div>
    );
  }

  if (showSplash) {
    return (
      <FirstLaunchSplash config={data.config} onComplete={handleSplashComplete} />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientNotifications config={data.config} />
      <PwaInstallPrompt />
      
      <main className="max-w-md mx-auto px-4 py-4 safe-area-top">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateView('prev')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h1 className="text-2xl font-bold min-w-[100px] text-center">{getViewTitle()}</h1>
            
            <button
              onClick={() => navigateView('next')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (currentView === 'today' || currentView === 'stats') {
                  setShowDatePicker(true);
                } else {
                  setCurrentView('today');
                  setSelectedDate(new Date());
                }
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Select date"
            >
              {currentView === 'settings' ? <HomeIcon className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                if (currentView === 'stats') {
                  setCurrentView('today');
                  setSelectedDate(new Date());
                } else if (currentView === 'settings') {
                  setCurrentView('stats');
                } else {
                  setCurrentView('stats');
                }
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Next view"
            >
              {currentView === 'stats' ? <HomeIcon className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
            </button>
            
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {showSettingsMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <button
                        onClick={() => { setCurrentView('settings'); setShowSettingsMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors font-medium"
                      >
                        ⚙️ Settings
                      </button>
                      <button
                        onClick={() => { setShowSettingsMenu(false); setShowSettingsMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        📅 Start Date: {data.config.meta.startDate}
                      </button>
                      <div className="my-1 border-t border-border" />
                      <button
                        onClick={() => { exportConfig(); setShowSettingsMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        Export Config
                      </button>
                      <button
                        onClick={() => { resetHistory(); setShowSettingsMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-amber-500"
                      >
                        Reset History
                      </button>
                      <button
                        onClick={() => { resetToDefault(); setShowSettingsMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        Reset Config
                      </button>
                      <button
                        onClick={() => { resetAll(); setShowSettingsMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-red-500"
                      >
                        Reset Everything
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {currentView === 'today' && (
          <div className="mb-4 p-3 glass rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Mode:</span>
              <select
                value={data.config.settings.weekMode}
                onChange={(e) => handleModeChange(e.target.value as WeekMode)}
                className="text-sm font-semibold bg-primary/10 border border-primary/30 rounded-lg px-3 py-1.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="regular">Regular</option>
                <option value="travel">Travel</option>
              </select>
            </div>
            <span className="text-xs text-muted-foreground">
              {data.config.settings.weekMode === 'regular' 
                ? `${data.config.modes.regular.wakeTime} - ${data.config.modes.regular.sleepTime}`
                : `${data.config.modes.travel.wakeTime} - ${data.config.modes.travel.sleepTime}`
              }
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === 'today' && (
              <TodayView 
                data={data} 
                onLogHabit={logHabit}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            )}
            {currentView === 'stats' && <StatsView data={data} />}
            {currentView === 'settings' && (
              <SettingsView
                data={data}
                onUpdateConfig={updateConfig}
                onReset={resetToDefault}
                onResetHistory={resetHistory}
                onResetAll={resetAll}
                onExport={exportConfig}
                onImport={() => true}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showDatePicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
              onClick={() => setShowDatePicker(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-background rounded-xl p-4 shadow-xl max-w-xs w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Select Date</h3>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    ×
                  </button>
                </div>
                <input
                  type="date"
                  value={getLocalDateString(selectedDate)}
                  min={data.config.meta.startDate}
                  max={getLocalDateString()}
                  onChange={(e) => {
                    setSelectedDate(new Date(e.target.value));
                    setShowDatePicker(false);
                  }}
                  className="w-full p-2 rounded-lg border border-border bg-background"
                />
                <button
                  onClick={() => {
                    setSelectedDate(new Date());
                    setShowDatePicker(false);
                  }}
                  className="w-full mt-3 p-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Today
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showStartDatePicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
              onClick={() => setShowStartDatePicker(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-background rounded-xl p-4 shadow-xl max-w-xs w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Start Date</h3>
                  <button
                    onClick={() => setShowStartDatePicker(false)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Tracking since: {data.config.meta.startDate}</p>
                <input
                  type="date"
                  value={data.config.meta.startDate || ''}
                  max={getLocalDateString()}
                  onChange={(e) => {
                    updateConfig({
                      ...data.config,
                      meta: {
                        ...data.config.meta,
                        startDate: e.target.value,
                      },
                    });
                    setShowStartDatePicker(false);
                  }}
                  className="w-full p-2 rounded-lg border border-border bg-background"
                />
                <button
                  onClick={() => {
                    resetHistory();
                    setShowStartDatePicker(false);
                  }}
                  className="w-full mt-3 p-2 text-sm text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                >
                  Reset to Today
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
