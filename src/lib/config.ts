import { AppConfig } from '@/types';

const getLocalDateString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const defaultConfig: AppConfig = {
  meta: {
    configVersion: '1.0',
    configType: 'default',
    createdAt: getLocalDateString(),
    startDate: getLocalDateString(),
  },
  settings: {
    weekMode: 'regular',
    dayTypeOverrides: {},
    notifications: {
      morningRoutine: true,
      gymWindowOpen: true,
      gymWindowClosing: true,
      dinnerReminder: true,
      walkReminder: true,
      foodCutoffWarning: true,
      foodCutoffHard: true,
      yogaReminder: true,
      sleepReminder: true,
    },
  },
  modes: {
    regular: {
      wakeTime: '08:00',
      sleepTime: '01:00',
      foodCutoffTime: '21:00',
      yogaTime: '00:00',
    },
    travel: {
      wakeTime: '06:00',
      sleepTime: '23:00',
      foodCutoffTime: '21:00',
      yogaTime: '22:30',
    },
  },
  dayTypes: {
    wfh: {
      gymWindowStart: '16:00',
      gymWindowEnd: '20:00',
      gymDuration: 75,
    },
    office: {
      gymWindowStart: '19:00',
      gymWindowEnd: '20:15',
      gymDuration: 75,
    },
    weekend: {
      gymWindowStart: '12:00',
      gymWindowEnd: '13:30',
      gymDuration: 90,
    },
  },
  habits: [
    {
      id: 'wake',
      label: 'Wake up',
      icon: 'sun',
      trigger: { type: 'fixed', time: '08:00' },
      appliesTo: {
        modes: ['regular'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'wake-travel',
      label: 'Wake up',
      icon: 'sun',
      trigger: { type: 'fixed', time: '06:00' },
      appliesTo: {
        modes: ['travel'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'morningRoutine',
      label: 'Morning routine',
      icon: 'sparkles',
      trigger: { type: 'fixed', time: '08:15', offsetMinutes: 15 },
      duration: 15,
      appliesTo: {
        modes: ['regular'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'morningRoutine-travel',
      label: 'Morning routine + hotel circuit',
      icon: 'sparkles',
      trigger: { type: 'fixed', time: '06:00', offsetMinutes: 25 },
      duration: 25,
      appliesTo: {
        modes: ['travel'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'brunch',
      label: 'Brunch + 2 eggs',
      icon: 'egg',
      trigger: { type: 'fixed', time: '11:30' },
      appliesTo: {
        modes: ['regular'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'breakfast-travel',
      label: 'Breakfast',
      icon: 'coffee',
      trigger: { type: 'fixed', time: '07:00' },
      appliesTo: {
        modes: ['travel'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'gym',
      label: 'Gym',
      icon: 'dumbbell',
      trigger: { type: 'dynamic' },
      appliesTo: {
        modes: ['regular'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'dinner',
      label: 'Dinner',
      icon: 'utensils',
      trigger: { type: 'dynamic', afterHabitId: 'gym', offsetMinutes: 45 },
      appliesTo: {
        modes: ['regular', 'travel'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'dinner-travel-fixed',
      label: 'Dinner',
      icon: 'utensils',
      trigger: { type: 'fixed', time: '19:30' },
      appliesTo: {
        modes: ['travel'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'walk',
      label: 'Post-dinner walk',
      icon: 'footprints',
      trigger: { type: 'dynamic', afterHabitId: 'dinner', offsetMinutes: 45 },
      duration: 30,
      appliesTo: {
        modes: ['regular', 'travel'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'foodCutoff',
      label: '9pm food cutoff',
      icon: 'ban',
      trigger: { type: 'fixed', time: '21:00' },
      appliesTo: {
        modes: ['regular', 'travel'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'yoga',
      label: 'Nightly yoga',
      icon: 'moon',
      trigger: { type: 'fixed', time: '00:00' },
      duration: 25,
      appliesTo: {
        modes: ['regular'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'yoga-travel',
      label: 'Nightly yoga',
      icon: 'moon',
      trigger: { type: 'fixed', time: '22:30' },
      duration: 25,
      appliesTo: {
        modes: ['travel'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'sleep',
      label: 'Sleep',
      icon: 'bed',
      trigger: { type: 'fixed', time: '01:00' },
      appliesTo: {
        modes: ['regular'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
    {
      id: 'sleep-travel',
      label: 'Sleep',
      icon: 'bed',
      trigger: { type: 'fixed', time: '23:00' },
      appliesTo: {
        modes: ['travel'],
        dayTypes: ['wfh', 'office', 'weekend'],
      },
      enabled: true,
    },
  ],
  morningRoutine: {
    regular: [
      { id: 'water-sun', label: '2 glasses water + sunlight', duration: 2 },
      { id: 'kapalbhati', label: 'Kapalbhati pranayama (60 pumps/min)', duration: 3 },
      { id: 'neck-rolls', label: 'Neck rolls (5 circles each direction)', duration: 1 },
      { id: 'torso-twists', label: 'Torso twists (20 reps)', duration: 1 },
      { id: 'hip-circles', label: 'Hip circles (10 each direction)', duration: 1 },
      { id: 'squats', label: 'Bodyweight squats (15 slow reps)', duration: 1 },
      { id: 'arm-swings', label: 'Arm swings + jog in place', duration: 1 },
      { id: 'stillness', label: 'Stillness - no phone', duration: 5 },
    ],
    travel: [
      { id: 'water-sun-travel', label: '2 glasses water + sunlight', duration: 2 },
      { id: 'hotel-circuit-round-1', label: 'Hotel circuit - Round 1', duration: 2 },
      { id: 'hotel-circuit-round-2', label: 'Hotel circuit - Round 2', duration: 2 },
      { id: 'breathing-travel', label: 'Deep breathing', duration: 2 },
      { id: 'stillness-travel', label: 'Stillness - no phone', duration: 2 },
    ],
  },
  yogaRotation: {
    '0': {
      name: 'BP Reset',
      enabled: true,
      poses: [
        { name: 'Legs up the wall (Viparita Karani)', duration: 5 },
        { name: 'Supta Baddha Konasana', duration: 3 },
        { name: 'Supine spinal twist - left', duration: 3 },
        { name: 'Supine spinal twist - right', duration: 3 },
        { name: '4-7-8 breathing (8 rounds)', duration: 5 },
        { name: 'Shavasana', duration: 5 },
      ],
    },
    '1': {
      name: 'Liver Flow',
      enabled: true,
      poses: [
        { name: 'Apanasana (knees to chest)', duration: 4 },
        { name: 'Paschimottanasana', duration: 3 },
        { name: 'Supine spinal twist both sides', duration: 3 },
        { name: 'Passive bridge pose', duration: 3 },
        { name: 'Nadi Shodhana (8 rounds)', duration: 4 },
        { name: 'Shavasana', duration: 5 },
      ],
    },
    '2': {
      name: 'Nervous System Reset',
      enabled: true,
      poses: [
        { name: 'Balasana (child\'s pose)', duration: 5 },
        { name: 'Legs up the wall', duration: 5 },
        { name: 'Box breathing 4-4-4-4 (8 rounds)', duration: 5 },
        { name: 'Yoga Nidra body scan', duration: 10 },
      ],
    },
    '3': {
      name: 'Metabolic Flow',
      enabled: true,
      poses: [
        { name: 'Supine figure-4 stretch both sides', duration: 4 },
        { name: 'Reclined pigeon both sides', duration: 3 },
        { name: 'Supine hamstring stretch with towel', duration: 3 },
        { name: 'Bridge pose (3 x 30 sec holds)', duration: 3 },
        { name: 'Belly breathing - diaphragm focus', duration: 4 },
        { name: 'Shavasana', duration: 5 },
      ],
    },
    '4': {
      name: 'Stress Release',
      enabled: true,
      poses: [
        { name: 'Legs up the wall', duration: 5 },
        { name: 'Supported fish pose', duration: 5 },
        { name: '4-7-8 breathing (8 rounds)', duration: 5 },
        { name: 'Shavasana', duration: 5 },
        { name: 'Gratitude body scan (3 things)', duration: 5 },
      ],
    },
    '5': {
      name: 'Full Yin Recovery',
      enabled: true,
      poses: [
        { name: 'Butterfly pose forward fold', duration: 4 },
        { name: 'Dragon pose - left', duration: 4 },
        { name: 'Dragon pose - right', duration: 4 },
        { name: 'Sleeping swan (yin pigeon)', duration: 3 },
        { name: 'Legs up the wall', duration: 5 },
        { name: 'Shavasana', duration: 5 },
      ],
    },
    '6': {
      name: 'Full Yoga Nidra',
      enabled: true,
      poses: [
        { name: 'Nadi Shodhana', duration: 5 },
        { name: 'Progressive muscle relaxation', duration: 5 },
        { name: 'Full Yoga Nidra', duration: 15 },
      ],
    },
  },
  scorecard: [
    { habitId: 'wake', target: 7, minimum: 6 },
    { habitId: 'morningRoutine', target: 7, minimum: 6 },
    { habitId: 'brunch', target: 7, minimum: 7 },
    { habitId: 'gym', target: 5, minimum: 3 },
    { habitId: 'walk', target: 7, minimum: 5 },
    { habitId: 'foodCutoff', target: 7, minimum: 6 },
    { habitId: 'yoga', target: 7, minimum: 6 },
  ],
};

export const hotelCircuitSteps = [
  '10 bodyweight squats',
  '8 push-ups',
  '10 glute bridges',
  '15 sec plank hold',
  '10 calf raises',
];

export const dayTypeSchedule: Record<number, 'wfh' | 'office' | 'weekend'> = {
  0: 'weekend', // Sunday
  1: 'wfh',     // Monday
  2: 'wfh',     // Tuesday
  3: 'office',  // Wednesday
  4: 'office',  // Thursday
  5: 'wfh',     // Friday
  6: 'weekend', // Saturday
};
