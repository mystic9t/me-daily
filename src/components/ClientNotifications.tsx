'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { AppConfig } from '@/types';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
}

interface ClientNotificationsProps {
  config: AppConfig;
}

export function ClientNotifications({ config }: ClientNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const newNotifications: Notification[] = [];
      
      const mode = config.settings.weekMode;
      const isTravel = mode === 'travel';

      if (config.settings.notifications.morningRoutine && currentTime === (isTravel ? '06:00' : '08:10')) {
        newNotifications.push({
          id: 'morning-routine',
          title: 'Morning Routine',
          message: 'Time for your morning routine 💧',
          time: currentTime,
        });
      }

      if (config.settings.notifications.foodCutoffWarning && currentTime === '20:30') {
        newNotifications.push({
          id: 'food-cutoff-warning',
          title: 'Food Cutoff Warning',
          message: '30 min to food cutoff 🔔',
          time: currentTime,
        });
      }

      if (config.settings.notifications.foodCutoffHard && currentTime === '20:50') {
        newNotifications.push({
          id: 'food-cutoff-hard',
          title: 'Kitchen Closing',
          message: 'Kitchen closes in 10 min 🔒',
          time: currentTime,
        });
      }

      if (config.settings.notifications.yogaReminder && currentTime === (isTravel ? '22:20' : '23:50')) {
        // Show tonight's yoga based on calendar day
        newNotifications.push({
          id: 'yoga-reminder',
          title: 'Yoga Time',
          message: `Tonight: ${config.yogaRotation[now.getDay().toString()]?.name || 'Yoga'} 🧘`,
          time: currentTime,
        });
      }

      if (config.settings.notifications.sleepReminder && currentTime === (isTravel ? '22:50' : '00:50')) {
        newNotifications.push({
          id: 'sleep-reminder',
          title: 'Time to Sleep',
          message: 'Time to sleep 🌙',
          time: currentTime,
        });
      }

      if (newNotifications.length > 0) {
        setNotifications((prev) => [...prev, ...newNotifications]);
      }
    };

    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [config]);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-card border border-border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2"
        >
          <Bell className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium">{notification.title}</p>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
          </div>
          <button
            onClick={() => dismissNotification(notification.id)}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
