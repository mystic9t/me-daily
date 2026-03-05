'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppData, AppConfig, DayLog, HabitLog } from '@/types';
import { defaultConfig } from '@/lib/config';

const STORAGE_KEY = 'daystack-data';

export function useStorage() {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const getLocalDateString = (d: Date = new Date()) => {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Ensure startDate exists and is valid
          const today = getLocalDateString();
          const createdAt = parsed.config.meta?.createdAt || today;
          const startDate = parsed.config.meta?.startDate;
          
          // If startDate is missing or invalid, set it to today and clear days
          if (!startDate || startDate === '' || startDate === 'undefined') {
            parsed.config.meta = {
              ...parsed.config.meta,
              createdAt: createdAt,
              startDate: today,
            };
            parsed.days = {};
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          }
          setData(parsed);
        } else {
          const initialData: AppData = {
            config: defaultConfig,
            days: {},
          };
          setData(initialData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        const initialData: AppData = {
          config: defaultConfig,
          days: {},
        };
        setData(initialData);
      }
      setIsLoaded(true);
    };

    loadData();
  }, []);

  const saveData = useCallback((newData: AppData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, []);

  const updateConfig = useCallback((config: AppConfig) => {
    setData((prev) => {
      if (!prev) return null;
      const newData = { ...prev, config };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const updateDayLog = useCallback((date: string, dayLog: DayLog) => {
    setData((prev) => {
      if (!prev) return null;
      const newData = {
        ...prev,
        days: { ...prev.days, [date]: dayLog },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const logHabit = useCallback((date: string, habitId: string, log: HabitLog) => {
    setData((prev) => {
      if (!prev) return null;
      const existingDay = prev.days[date] || {
        mode: prev.config.settings.weekMode,
        dayType: 'wfh',
        habits: {},
      };
      const newDayLog: DayLog = {
        ...existingDay,
        habits: { ...existingDay.habits, [habitId]: log },
      };
      const newData = {
        ...prev,
        days: { ...prev.days, [date]: newDayLog },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const resetToDefault = useCallback(() => {
    const newData: AppData = {
      config: defaultConfig,
      days: data?.days || {},
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setData(newData);
  }, [data?.days]);

  const getLocalDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const resetHistory = useCallback(() => {
    if (!data) return;
    const newData: AppData = {
      ...data,
      days: {},
      config: {
        ...data.config,
        meta: {
          ...data.config.meta,
          startDate: getLocalDateString(),
        },
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setData(newData);
  }, [data]);

  const resetAll = useCallback(() => {
    const initialData: AppData = {
      config: defaultConfig,
      days: {},
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    setData(initialData);
  }, []);

  const exportConfig = useCallback(() => {
    if (!data) return null;
    const configJson = JSON.stringify(data.config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daystack-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  const importConfig = useCallback((jsonString: string) => {
    try {
      const importedConfig: AppConfig = JSON.parse(jsonString);
      if (data) {
        const newData: AppData = {
          ...data,
          config: { ...importedConfig, meta: { ...importedConfig.meta, configType: 'custom' } },
        };
        saveData(newData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing config:', error);
      return false;
    }
  }, [data, saveData]);

  return {
    data,
    isLoaded,
    saveData,
    updateConfig,
    updateDayLog,
    logHabit,
    resetToDefault,
    resetHistory,
    resetAll,
    exportConfig,
    importConfig,
  };
}
