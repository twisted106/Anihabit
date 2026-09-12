// =====================================================================
// LIFE RPG GAME CONFIGURATION & TUNABLE PARAMETERS
// =====================================================================

// Reincarnation Meter Dynamics
// Explicit constraint enforced: RECEIVE_ON_FAIL > REDUCE_ON_COMPLETE (x > y)
// A single failure adds more to the meter than a single completion removes.
export const RECEIVE_ON_FAIL = 15;      // x: added on task expiration/failure
export const REDUCE_ON_COMPLETE = 8;     // y: subtracted on task completion
export const REINCARNATION_MAX = 100;    // Meter capacity

if (RECEIVE_ON_FAIL <= REDUCE_ON_COMPLETE) {
  console.warn("CRITICAL CONFIG WARNING: RECEIVE_ON_FAIL (x) must be strictly greater than REDUCE_ON_COMPLETE (y)!");
}

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

// Task Difficulty Scaling
export const DIFFICULTY_CONFIG = {
  Easy: {
    label: 'Easy',
    multiplier: 1.0,
    xp: 15,
    stat: 3,
    penalty: 2,
    badgeClass: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/30'
  },
  Medium: {
    label: 'Medium',
    multiplier: 1.8,
    xp: 27,
    stat: 6,
    penalty: 4,
    badgeClass: 'bg-amber-900/40 text-amber-300 border-amber-700/30'
  },
  Hard: {
    label: 'Hard',
    multiplier: 3.0,
    xp: 45,
    stat: 10,
    penalty: 7,
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

