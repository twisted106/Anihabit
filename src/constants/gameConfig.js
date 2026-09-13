// =====================================================================
// LIFE RPG GAME CONFIGURATION & TUNABLE PARAMETERS
// =====================================================================

// Reincarnation Meter Dynamics (Flat Points 0-100, supersedes legacy percentages)
// Tasks: Easy (-1/+8), Medium (-2/+9), Hard (-3/+10)
// Habits: Complete (-2), Streak Break (+10)
export const RECEIVE_ON_FAIL = 10;      // Default/Hard task fail: +10 pts
export const REDUCE_ON_COMPLETE = 2;    // Default/Habit complete: -2 pts
export const REINCARNATION_MAX = 100;   // Meter capacity

// Habit Reincarnation & Streak Dynamics
export const HABIT_PRESSURE_RELIEF = 2;        // -2 on habit complete
export const HABIT_STREAK_BREAK_PRESSURE = 10; // +10 on streak break

// Habit Streak Break Coin Retention Formula:
// remaining_coins = original_coins * (1 - 0.10 * number_of_habits_broken_that_day)
export const calculateStreakBreakCoinRetention = (brokenCount = 1) => {
  return Math.max(0, 1 - 0.10 * brokenCount);
};

// Habit Escalation Cap
export const MAX_HABIT_DAILY_COINS = 10;

// Reincarnation Crisis Trade-Off Rates (Tunable)
export const REINCARNATION_STAT_SACRIFICE_PERCENT = 0.25; // Lose 25% stats
export const REINCARNATION_COIN_SACRIFICE_PERCENT = 0.50; // Lose 50% coins

// Non-Linear Leveling Formula: xp_to_next = base * (level ^ 1.5)
export const LEVEL_BASE_XP = 100;
export const calculateXpToNextLevel = (level) => {
  return Math.round(LEVEL_BASE_XP * Math.pow(level, 1.5));
};

// Core RPG Categories -> Stats (Fixed, immutable)
export const CATEGORIES = {
  Academics: {
    name: 'Academics',
    stat: 'intellect',
    statLabel: 'Intellect',
    color: 'intellect',
    badgeClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50',
    glowClass: 'shadow-glow-intellect',
    accentColor: '#6366f1',
    description: 'Study sessions, coding, reading, arcane knowledge',
    arenaBoss: {
      name: 'Chronos of Procrastination',
      title: 'Distortion of Thought',
      emoji: '🦉',
      aura: 'border-indigo-500/40 text-indigo-400'
    }
  },
  Fitness: {
    name: 'Fitness',
    stat: 'strength',
    statLabel: 'Strength',
    color: 'strength',
    badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-700/50',
    glowClass: 'shadow-glow-strength',
    accentColor: '#f43f5e',
    description: 'Workouts, runs, hydration, physical conditioning',
    arenaBoss: {
      name: 'The Sloth Behemoth',
      title: 'Weight of Lethargy',
      emoji: '🦏',
      aura: 'border-rose-500/40 text-rose-400'
    }
  },
  Lifestyle: {
    name: 'Lifestyle',
    stat: 'discipline',
    statLabel: 'Discipline',
    color: 'discipline',
    badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50',
    glowClass: 'shadow-glow-discipline',
    accentColor: '#10b981',
    description: 'Sleep hygiene, tidy spaces, nutrition, routine',
    arenaBoss: {
      name: 'Chaos Chimera',
      title: 'Disorder of Habit',
      emoji: '🐍',
      aura: 'border-emerald-500/40 text-emerald-400'
    }
  },
  Other: {
    name: 'Other',
    stat: 'willpower',
    statLabel: 'Willpower',
    color: 'willpower',
    badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-700/50',
    glowClass: 'shadow-glow-willpower',
    accentColor: '#a855f7',
    description: 'Finances, deep focus, overcoming mental friction',
    arenaBoss: {
      name: 'Phantom of Hesitation',
      title: 'Shadow of Doubt',
      emoji: '👁️',
      aura: 'border-purple-500/40 text-purple-400'
    }
  }
};

// Task Difficulty Scaling (Flat rewards, reverse stat penalty, reverse pressure penalty)
// Complete: Hard (-3), Medium (-2), Easy (-1)
// Not Complete: Hard (+8), Medium (+9), Easy (+10)
export const DIFFICULTY_CONFIG = {
  Easy: {
    label: 'Easy',
    multiplier: 1.0,
    xp: 1,
    stat: 1,
    penalty: 3,        // Reverse-scaled: -3 stat on expiry
    pressureFail: 10,  // +10 pressure if not completed
    pressureRelief: 1, // -1 pressure on completion
    badgeClass: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/30'
  },
  Medium: {
    label: 'Medium',
    multiplier: 1.0,
    xp: 2,
    stat: 2,
    penalty: 2,        // Reverse-scaled: -2 stat on expiry
    pressureFail: 9,   // +9 pressure if not completed
    pressureRelief: 2, // -2 pressure on completion
    badgeClass: 'bg-amber-900/40 text-amber-300 border-amber-700/30'
  },
  Hard: {
    label: 'Hard',
    multiplier: 1.0,
    xp: 3,
    stat: 3,
    penalty: 1,        // Reverse-scaled: -1 stat on expiry
    pressureFail: 8,   // +8 pressure if not completed
    pressureRelief: 3, // -3 pressure on completion
    badgeClass: 'bg-rose-900/40 text-rose-300 border-rose-700/30'
  }
};

// Calculate Power Score (Average of the four stats)
export const calculatePowerScore = (stats) => {
  if (!stats) return 0;
  const { intellect = 10, strength = 10, discipline = 10, willpower = 10 } = stats;
  return Number(((Number(intellect) + Number(strength) + Number(discipline) + Number(willpower)) / 4).toFixed(1));
};

// =====================================================================
// MIDNIGHT IST BOUNDARY CALCULATION
// Indian Standard Time (UTC+5:30) is the canonical tavern daily cycle
// =====================================================================
export const getMostRecentMidnightIST = () => {
  const now = new Date();
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  // Wall time in IST represented as UTC millis
  const istTime = new Date(now.getTime() + IST_OFFSET_MS);
  // Roll back to 00:00:00.000 in IST
  istTime.setUTCHours(0, 0, 0, 0);
  // Convert back to UTC Date boundary
  return new Date(istTime.getTime() - IST_OFFSET_MS);
};

