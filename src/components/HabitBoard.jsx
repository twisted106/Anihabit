/**
 * @file HabitBoard.jsx
 * @description The Habit Forge: recurring daily habits that serve as the SOLE source of gold coins in the game.
 * Features streak tracking, escalating coin multipliers (1-10 max), and daily check-ins.
 */

import React, { useState } from 'react';
import { 
  Flame, 
  Coins, 
  Plus, 
  Check, 
  Clock, 
  Trophy, 
  Sparkles,
  Zap
} from 'lucide-react';
import { CATEGORIES, MAX_HABIT_DAILY_COINS } from '../constants/gameConfig';

export default function HabitBoard({
  habits,
  onCheckInHabit,
  onCreateHabit
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academics');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const success = await onCreateHabit({ title, category });
    if (success) {
      setTitle('');
      setIsCreating(false);
    }
  };

  const isCheckedInToday = (lastCompletedAt) => {
    if (!lastCompletedAt) return false;
    const last = new Date(lastCompletedAt);
    const now = new Date();
    return last.toDateString() === now.toDateString();
  };

  return (
    <section aria-label="Habit Forge Board" className="rpg-panel p-5 sm:p-6 border-amber-500/20 shadow-xl space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="font-fantasy text-lg sm:text-xl font-bold text-white tracking-wide">
              Habit Forge (Daily Streaks)
            </h2>
          </div>
          <p className="text-xs text-amber-300/80 mt-0.5 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Sole source of gold coins: Day 1 = 1 coin, Day 2 = 2 coins... up to 10 max</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          className="rpg-btn flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold self-start sm:self-auto shadow-glow-gold/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Forge Habit</span>
        </button>
      </div>

      {/* Inline Creation Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-4 rounded-xl bg-rpg-dark/80 border border-amber-500/30 space-y-3 animate-fadeIn">
          <div>
            <label htmlFor="habit-title-input" className="block text-xs font-semibold text-slate-300 mb-1">
              Habit Name / Daily Discipline *
            </label>
            <input
              id="habit-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read 20 pages, 100 pushups, 8 hours sleep..."
              required
              autoFocus
              className="w-full px-3 py-2 text-sm bg-black/50 border border-rpg-border rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-2.5 py-1 text-xs bg-black/50 border border-rpg-border rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {Object.keys(CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 self-end">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="rpg-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="rpg-btn px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-glow-gold"
              >
                Forge
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Habit Cards */}
      {habits.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-rpg-border bg-rpg-dark/40">
          <Flame className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No habits forged yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Habits generate escalating daily coins that can be spent in the cosmetic shop or used to avert reincarnation crises.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {habits.map((habit) => {
            const cat = CATEGORIES[habit.category] || CATEGORIES.Academics;
            const streak = habit.current_streak || 0;
            const completedToday = isCheckedInToday(habit.last_completed_at);
            const nextReward = Math.min(streak + 1, MAX_HABIT_DAILY_COINS);

            return (
              <div
                key={habit.id}
                className="rpg-card p-4 flex flex-col justify-between gap-3 border-amber-900/30 hover:border-amber-500/40 transition-all bg-gradient-to-b from-rpg-card/90 to-amber-950/10"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border ${cat.badgeClass}`}>
                      {cat.name}
                    </span>

                    <div className="flex items-center gap-1 text-amber-400 font-mono text-xs font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                      <span>{streak} Days</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white">
                    {habit.title}
                  </h3>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>Best: {habit.longest_streak || 0}d</span>
                    </span>
                    <span className="text-slate-500">•</span>
                    <span>Next: +{nextReward} coins</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-rpg-border/60">
                  <button
                    type="button"
                    onClick={() => onCheckInHabit(habit.id)}
                    disabled={completedToday}
                    aria-label={`Check in daily habit: ${habit.title}`}
                    className={`rpg-btn w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      completedToday
                        ? 'bg-emerald-950/40 border border-emerald-700/40 text-emerald-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-glow-gold'
                    }`}
                  >
                    {completedToday ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Fortified Today</span>
                      </>
                    ) : (
                      <>
                        <Coins className="w-4 h-4 text-slate-950" />
                        <span>Check In (+{nextReward} Coins)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
