export type WeekMode = 'regular' | 'travel';
export type DayType = 'wfh' | 'office' | 'weekend';
export type HabitStatus = 'pending' | 'done' | 'skipped';

export interface ModeConfig {
  wakeTime: string;
  sleepTime: string;
  foodCutoffTime: string;
  yogaTime: string;
}

export interface WeekModes {
  regular: ModeConfig;
  travel: ModeConfig;
}

export interface DayTypeConfig {
  gymWindowStart: string;
  gymWindowEnd: string;
  gymDuration: number;
}

export interface DayTypes {
  wfh: DayTypeConfig;
  office: DayTypeConfig;
  weekend: DayTypeConfig;
}

export interface HabitTrigger {
  type: 'fixed' | 'dynamic';
  time?: string;
  afterHabitId?: string;
  offsetMinutes?: number;
}

export interface HabitConfig {
  id: string;
  label: string;
  icon: string;
  trigger: HabitTrigger;
  duration?: number;
  appliesTo: {
    modes: WeekMode[];
    dayTypes: DayType[];
  };
  enabled: boolean;
}

export interface MorningRoutineStep {
  id: string;
  label: string;
  duration: number;
}

export interface MorningRoutine {
  regular: MorningRoutineStep[];
  travel: MorningRoutineStep[];
}

export interface YogaPose {
  name: string;
  duration: number;
}

export interface YogaSession {
  name: string;
  poses: YogaPose[];
  enabled: boolean;
}

export type YogaRotation = Record<string, YogaSession>;

export interface ScorecardTarget {
  habitId: string;
  target: number;
  minimum: number;
}

export interface NotificationConfig {
  morningRoutine: boolean;
  gymWindowOpen: boolean;
  gymWindowClosing: boolean;
  dinnerReminder: boolean;
  walkReminder: boolean;
  foodCutoffWarning: boolean;
  foodCutoffHard: boolean;
  yogaReminder: boolean;
  sleepReminder: boolean;
}

export interface AppConfig {
  meta: {
    configVersion: string;
    configType: 'default' | 'custom';
    createdAt: string;
  };
  settings: {
    weekMode: WeekMode;
    dayTypeOverrides: Record<string, DayType>;
    notifications: NotificationConfig;
  };
  modes: WeekModes;
  dayTypes: DayTypes;
  habits: HabitConfig[];
  morningRoutine: MorningRoutine;
  yogaRotation: YogaRotation;
  scorecard: ScorecardTarget[];
}

export interface HabitLog {
  status: HabitStatus;
  time?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  session?: string;
  note?: string;
}

export interface DayLog {
  mode: WeekMode;
  dayType: DayType;
  habits: Record<string, HabitLog>;
}

export interface AppData {
  config: AppConfig;
  days: Record<string, DayLog>;
}
