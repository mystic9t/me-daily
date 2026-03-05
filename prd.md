# 📋 PRD: DayStack Health Tracker PWA (v2)

***

## 1. Overview

**Product Name:** DayStack
**Type:** Progressive Web App (PWA)
**Platform:** Mobile-first, installable on Android/iOS home screen
**Stack Suggestion:** Next.js + Tailwind CSS + localStorage/IndexedDB
**Deployment:** Vercel (free tier)

***

## 2. Core Concept

DayStack ships with a **fully pre-configured default setup** based on a real health protocol (the Sarthak config). On first launch, the app is immediately usable — no setup required. A separate **Setup Editor** allows full customisation for anyone who wants to adapt it to their own schedule.

***

## 3. First Launch Experience

```
First open → Show "Your schedule is ready" splash
           → Display default config summary (3 screens, swipeable)
           → "Looks good, let's go" → straight to Today Dashboard
           → Small "Edit Setup" link at bottom for those who want to customise
```

No forced onboarding. No questions. Open and use.

***

## 4. Default Configuration (Sarthak Config)

### 4.1 Week Modes

| Mode | Wake | Sleep | Food Cutoff | Yoga Time |
|------|------|-------|------------|-----------|
| **Regular** | 8:00am | 1:00am | 9:00pm | 12:00am |
| **Travel** | 6:00am | 11:00pm | 9:00pm | 10:30pm |

Mode is set once per week. Persists until manually changed.

***

### 4.2 Day Types (Regular Week)

| Day | Type | Gym Window | Gym Duration |
|-----|------|-----------|-------------|
| Monday | WFH | 4:00–6:45pm start | 1hr 15min |
| Tuesday | WFH | 4:00–6:45pm start | 1hr 15min |
| Wednesday | Office | 7:00–8:15pm | 1hr 15min |
| Thursday | Office | 7:00–8:15pm | 1hr 15min |
| Friday | WFH | 4:00–6:45pm start | 1hr 15min |
| Saturday | Weekend | 12:00–1:30pm | 1hr 15min |
| Sunday | Weekend | 12:00–1:30pm | 1hr 15min |

***

### 4.3 Default Daily Habits

#### Regular Week — WFH Day

| # | Habit | Default Time | Logic |
|---|-------|-------------|-------|
| 1 | Wake up | 8:00am | Fixed |
| 2 | Morning routine | 8:15am | Fixed, 15 min |
| 3 | Brunch + 2 eggs | 11:30am | Fixed |
| 4 | Gym | Flex 4:00–8:00pm | Log start + end |
| 5 | Dinner | Gym end + 45min | Dynamic |
| 6 | Post-dinner walk | Dinner + 45min | Dynamic, 30 min |
| 7 | 9pm food cutoff | 9:00pm | Hard wall |
| 8 | Nightly yoga | 12:00am | Fixed, 25 min |
| 9 | Sleep | 1:00am | Fixed |

#### Regular Week — Office Day

| # | Habit | Default Time | Logic |
|---|-------|-------------|-------|
| 1 | Wake up | 8:00am | Fixed |
| 2 | Morning routine | 8:15am | Fixed |
| 3 | Brunch + 2 eggs | 11:30am | Fixed |
| 4 | Gym (optional) | 7:00–8:15pm | Log start + end |
| 5 | Dinner | 7:30pm (no gym) / gym end + 30min | Dynamic |
| 6 | Post-dinner walk | Dinner + 45min | Dynamic, 30 min |
| 7 | 9pm food cutoff | 9:00pm | Hard wall |
| 8 | Nightly yoga | 12:00am | Fixed |
| 9 | Sleep | 1:00am | Fixed |

#### Regular Week — Weekend

| # | Habit | Default Time | Logic |
|---|-------|-------------|-------|
| 1 | Wake up | 8:00am | Fixed |
| 2 | Morning routine | 8:15am | Fixed |
| 3 | Brunch + 2 eggs | 11:30am | Fixed |
| 4 | Gym | 12:00–1:30pm | Fixed window |
| 5 | Dinner | 7:00–7:30pm | Fixed |
| 6 | Post-dinner walk | 8:00pm | Fixed, 30 min |
| 7 | 9pm food cutoff | 9:00pm | Hard wall |
| 8 | Nightly yoga | 12:00am | Fixed |
| 9 | Sleep | 1:00am | Fixed |

#### Travel Week — All Days

| # | Habit | Default Time | Logic |
|---|-------|-------------|-------|
| 1 | Wake up | 6:00am | Fixed |
| 2 | Morning routine + hotel circuit | 6:00am | Fixed, 25 min |
| 3 | Breakfast | 7:00am | Fixed |
| 4 | Dinner | 7:30pm | Hard cutoff |
| 5 | Post-dinner walk | 8:15pm | Fixed, 30 min |
| 6 | 9pm food cutoff | 9:00pm | Hard wall |
| 7 | Nightly yoga | 10:30pm | Fixed, 25 min |
| 8 | Sleep | 11:00pm | Fixed |

***

### 4.4 Default Morning Routine (15 min)

Pre-loaded, shown expandable on the morning routine card:

1. 2 glasses water + sunlight (2 min)
2. Kapalbhati pranayama — 3 min, 60 pumps/min (3 min)
3. Neck rolls — 5 circles each direction (1 min)
4. Torso twists — 20 reps (1 min)
5. Hip circles — 10 each direction (1 min)
6. Bodyweight squats — 15 slow reps (1 min)
7. Arm swings + jog in place — 30 sec each (1 min)
8. Stillness — no phone (5 min)

***

### 4.5 Default Hotel Circuit (Travel Week, 4 min, 2 rounds)

Pre-loaded on travel morning routine card:

- 10 bodyweight squats
- 8 push-ups
- 10 glute bridges
- 15 sec plank hold
- 10 calf raises

***

### 4.6 Default Nightly Yoga Rotation

| Day | Session | Duration |
|-----|---------|---------|
| Monday | BP Reset | 25 min |
| Tuesday | Liver Flow | 25 min |
| Wednesday | Nervous System Reset | 25 min |
| Thursday | Metabolic Flow | 25 min |
| Friday | Stress Release | 25 min |
| Saturday | Full Yin Recovery | 25 min |
| Sunday | Full Yoga Nidra | 25 min |

Full pose list + per-pose duration pre-loaded for each session (see Section 8).

***

### 4.7 Default Weekly Scorecard Targets

| Habit | Target | Minimum |
|-------|--------|---------|
| Wake on time | 7/7 | 6/7 |
| Morning routine | 7/7 | 6/7 |
| 2 eggs at brunch | 7/7 | 7/7 |
| Gym sessions (regular) | 5 | 3 |
| Hotel circuit (travel) | 7/7 | 6/7 |
| Post-dinner walk | 7/7 | 5/7 |
| 9pm food cutoff | 7/7 | 6/7 |
| Nightly yoga | 7/7 | 6/7 |

***

### 4.8 Default Notifications

| Notification | Time | Message |
|-------------|------|---------|
| Morning routine | 8:10am (6:00am travel) | "Time for your morning routine 💧" |
| Gym window open | 4:00pm WFH / 7:00pm office | "Gym window open 🏋️" |
| Gym window closing | 6:30pm WFH | "15 min left to start gym ⏳" |
| Dinner reminder | Gym end + 40min | "Time for dinner — eat before 9pm 🍽️" |
| Walk reminder | Dinner logged + 40min | "Post-dinner walk time 🚶" |
| Food cutoff warning | 8:30pm | "30 min to food cutoff 🔔" |
| Food cutoff hard | 8:50pm | "Kitchen closes in 10 min 🔒" |
| Yoga reminder | 11:50pm (10:20pm travel) | "Tonight: [session name] 🧘" |
| Sleep reminder | 12:50am (10:50pm travel) | "Time to sleep 🌙" |

***

## 5. Setup Editor

Accessible via **Settings → Edit My Setup**. Allows full customisation without touching code.

### 5.1 Editor Structure

The editor is organised into 5 sections, each independently editable:

***

#### Section 1: Week Modes

- **Regular Mode:** Edit wake time, sleep time, food cutoff time, yoga time
- **Travel Mode:** Same fields
- Toggle which days are WFH / Office / Weekend (default Mon/Tue/Fri = WFH, Wed/Thu = Office, Sat/Sun = Weekend)
- Option to add a 3rd mode (e.g. "Holiday Week") with its own config

***

#### Section 2: Habits

- Full list of all habits with toggle to **enable / disable** each
- Per-habit editable fields:
  - Label (rename e.g. "Brunch + 2 eggs" → "Lunch")
  - Scheduled time (fixed) or trigger (dynamic — pick what it follows + offset in minutes)
  - Duration (optional — used for timer)
  - Applies to: which day types + which modes
- **Add custom habit** button — creates a new habit card with same fields
- **Delete habit** button
- Reorder habits via drag handle

***

#### Section 3: Morning Routine

- List of steps, each editable: label + duration
- Add / remove / reorder steps
- Separate config for Regular vs Travel morning routine

***

#### Section 4: Nightly Yoga

- 7 slots (one per day of week)
- Each slot: session name + list of poses with per-pose duration
- Add / remove / reorder poses
- Toggle yoga timer on/off per session
- Option to turn off yoga entirely and replace with a custom habit

***

#### Section 5: Scorecard

- List of scored habits — toggle which ones count
- Edit target and minimum per habit
- Edit score thresholds (green/yellow/red bands)

***

### 5.2 Reset to Default

A prominent **"Reset to Sarthak Config"** button at the bottom of the Setup Editor with a confirmation dialog:

```
⚠️ This will replace all your customisations with the default setup.
Your logged history will not be affected.
[Cancel]  [Reset to Default]
```

***

### 5.3 Export / Import Config

- **Export Setup** → downloads a `daystackconfig.json` file
- **Import Setup** → upload a config JSON to restore or share setups between devices
- Useful for: switching phones, sharing config with a friend, backing up customisations

***

## 6. Screens & Navigation

**Bottom nav (4 items):**

- 🏠 Today
- 📅 History
- 📊 Scorecard
- ⚙️ Settings

***

### 6.1 Today Dashboard

- Header: date, day name, mode badge (tappable), day type badge
- Vertical timeline of today's habits
- Each card: icon, label, scheduled time, status (Pending / Done / Skipped)
- Tap → mark done with timestamp
- Long press → mark skipped + optional note
- Past-due unlogged habits show a subtle amber dot (not alarming)

### 6.2 Gym Logger Modal

- Start / End buttons with auto-timestamp
- Shows relevant window reminder for the day type
- Warning if end time > 8:30pm: `⚠️ Finish dinner before 9pm — keep it light`
- Skip toggle

### 6.3 Yoga Session Detail

- Session name + total duration
- Full pose list with individual timers
- `Start Guided Session` → runs through each pose automatically with soft chime at transitions
- `Mark Done` without guided timer

### 6.4 Weekly Scorecard

- Score grid with this week's progress
- Score band indicator (🟢🟡🔴)
- 4-week rolling bar chart
- Current streak counter

### 6.5 History

- Monthly calendar view
- Colour-coded days (green / yellow / red / grey)
- Tap day → full log with timestamps

### 6.6 Settings

- Week mode toggle (Regular / Travel)
- Day type override per day
- Notification toggles per notification type
- **Edit My Setup** → opens Setup Editor
- Export data as CSV

***

## 7. Dynamic Time Calculation Logic

```
IF gym logged:
   dinner_suggestion = gym_end + 45min
   IF dinner_suggestion > 20:15 (8:15pm):
      dinner_suggestion = "Eat now — must finish by 9pm"

IF dinner logged:
   walk_suggestion = dinner_time + 45min
   IF walk_suggestion > 21:00:
      walk_suggestion = "Short 15min walk — gym covered today"

IF any food logged after 21:00:
   flag food_cutoff habit as "missed"
   show gentle note: "Late eating logged — happens sometimes"
```

***

## 8. Nightly Yoga — Default Pose Data

### Monday — BP Reset (25 min)

| Pose | Duration |
|------|---------|
| Legs up the wall (Viparita Karani) | 5 min |
| Supta Baddha Konasana | 3 min |
| Supine spinal twist — left | 3 min |
| Supine spinal twist — right | 3 min |
| 4-7-8 breathing — 8 rounds | 5 min |
| Shavasana | 5 min |

### Tuesday — Liver Flow (25 min)

| Pose | Duration |
|------|---------|
| Apanasana (knees to chest) | 4 min |
| Paschimottanasana | 3 min |
| Supine spinal twist both sides | 3 min |
| Passive bridge pose | 3 min |
| Nadi Shodhana — 8 rounds | 4 min |
| Shavasana | 5 min |

### Wednesday — Nervous System Reset (25 min)

| Pose | Duration |
|------|---------|
| Balasana (child's pose) | 5 min |
| Legs up the wall | 5 min |
| Box breathing 4-4-4-4 — 8 rounds | 5 min |
| Yoga Nidra body scan | 10 min |

### Thursday — Metabolic Flow (25 min)

| Pose | Duration |
|------|---------|
| Supine figure-4 stretch both sides | 4 min |
| Reclined pigeon both sides | 3 min |
| Supine hamstring stretch with towel | 3 min |
| Bridge pose — 3 x 30 sec holds | 3 min |
| Belly breathing — diaphragm focus | 4 min |
| Shavasana | 5 min |

### Friday — Stress Release (25 min)

| Pose | Duration |
|------|---------|
| Legs up the wall | 5 min |
| Supported fish pose | 5 min |
| 4-7-8 breathing — 8 rounds | 5 min |
| Shavasana | 5 min |
| Gratitude body scan — 3 things | 5 min |

### Saturday — Full Yin Recovery (25 min)

| Pose | Duration |
|------|---------|
| Butterfly pose forward fold | 4 min |
| Dragon pose — left | 4 min |
| Dragon pose — right | 4 min |
| Sleeping swan (yin pigeon) | 3 min |
| Legs up the wall | 5 min |
| Shavasana | 5 min |

### Sunday — Full Yoga Nidra (25 min)

| Pose | Duration |
|------|---------|
| Nadi Shodhana | 5 min |
| Progressive muscle relaxation | 5 min |
| Full Yoga Nidra | 15 min |

***

## 9. Data Model

```json
{
  "meta": {
    "configVersion": "1.0",
    "configType": "default | custom",
    "createdAt": "2026-03-05"
  },
  "settings": {
    "weekMode": "regular | travel",
    "dayTypeOverrides": {
      "2026-03-05": "office"
    },
    "notifications": {
      "morningRoutine": true,
      "gymWindowOpen": true,
      "gymWindowClosing": true,
      "dinnerReminder": true,
      "walkReminder": true,
      "foodCutoffWarning": true,
      "foodCutoffHard": true,
      "yogaReminder": true,
      "sleepReminder": true
    }
  },
  "config": {
    "modes": { },
    "dayTypes": { },
    "habits": [ ],
    "morningRoutine": { },
    "yogaRotation": { },
    "scorecard": { }
  },
  "days": {
    "2026-03-05": {
      "mode": "regular",
      "dayType": "wfh",
      "habits": {
        "wake": { "status": "done", "time": "08:03" },
        "morningRoutine": { "status": "done", "time": "08:17" },
        "brunch": { "status": "done", "time": "11:45" },
        "gym": { "status": "done", "startTime": "16:20", "endTime": "17:35" },
        "dinner": { "status": "done", "time": "18:30" },
        "walk": { "status": "done", "startTime": "19:20", "duration": 30 },
        "foodCutoff": { "status": "done" },
        "yoga": { "status": "done", "time": "00:05", "session": "BP Reset" },
        "sleep": { "status": "done", "time": "01:10" }
      }
    }
  }
}
```

***

## 10. PWA Requirements

- Installable on Android + iOS (manifest.json with icons)
- Offline-first — all data in localStorage/IndexedDB
- Service worker for push notifications and offline access
- Mobile-first UI, one-handed use
- No login — single user, data on device
- Dark mode default
- Export config as JSON + import from JSON

***

## 11. UI/UX Principles

- **Zero setup to start** — default config works on first open
- **Minimal taps** — habit done = 2 taps max
- **Glanceable** — app tells you exactly where you are in your day instantly
- **No guilt UI** — skipped = grey, not red
- **Time-aware** — past-due unlogged items show subtle nudge only
- **Dark mode default** — used at midnight

***

## 12. Out of Scope (V1)

- Multi-user / accounts
- Cloud sync
- Diet / calorie tracking
- Wearable integration
- Gym workout logger (sets/reps)
- Social / sharing features

***

## 13. Suggested Build Order for OpenCode

1. Data model + localStorage layer + default config JSON
2. Config loader — reads default config, applies to all screens
3. Today Dashboard with static habit cards from config
4. Habit tap-to-complete with timestamps
5. Dynamic time calculations (dinner/walk from gym log)
6. Gym logger modal
7. Weekly scorecard screen
8. Yoga session detail + guided timer
9. Notifications via service worker
10. Setup Editor — Section 2 (Habits) first, then others
11. Export/Import config (JSON)
12. History calendar view
13. PWA manifest + install prompt
14. Reset to default config flow
