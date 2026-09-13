/**
 * @file CharacterPanel.jsx
 * @description Top HUD region displaying player hero level, non-linear XP bar, gold coins, 
 * stat breakdown cards, and the global Reincarnation Pressure Gauge.
 */

import React from 'react';
import { 
  Award, 
  Coins, 
  Flame, 
  BookOpen, 
  Dumbbell, 
  Sparkles, 
  HeartHandshake, 
  AlertCircle,
  TrendingUp,
  Shield
} from 'lucide-react';
import { CATEGORIES, REINCARNATION_MAX } from '../constants/gameConfig';

export default function CharacterPanel({
  profile,
  stats,
  powerScore,
  xpNeeded,
  equippedTitle,
  equippedFrame
}) {
  const currentLevel = profile.current_level || 1;
  const currentXp = profile.current_xp || 0;
  const coinBalance = profile.coin_balance || 0;
  const reincarnationMeter = Math.min(REINCARNATION_MAX, Math.max(0, profile.reincarnation_meter || 0));
  const xpPercentage = Math.min(100, Math.round((currentXp / (xpNeeded || 100)) * 100));

  // Determine reincarnation meter visual urgency
  const isHighPressure = reincarnationMeter >= 75;
  const isMediumPressure = reincarnationMeter >= 50;

  // Frame aesthetic
  let frameBorderClass = 'border-rpg-border';
  if (equippedFrame === 'frame_ember') {
    frameBorderClass = 'border-rose-500 shadow-glow-strength animate-pulse-glow';
  } else if (equippedFrame === 'frame_astral') {
    frameBorderClass = 'border-purple-500 shadow-glow-willpower animate-pulse-glow';
  }

  return (
    <section 
      aria-label="Character Profile & Status" 
      className="rpg-panel p-5 sm:p-6 border-indigo-500/20 shadow-xl space-y-6"
    >
      {/* Top Bar: Hero Identity, Level & Coin Economy */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-rpg-border">
        {/* Hero Avatar & Identity */}
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-950 to-rpg-dark border-2 ${frameBorderClass} flex items-center justify-center relative shadow-lg`}>
            <span className="text-3xl select-none" role="img" aria-label="Hero Avatar">🧙‍♂️</span>
            <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-md bg-indigo-600 border border-indigo-400 text-[10px] font-bold text-white tracking-wider shadow">
              LVL {currentLevel}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-fantasy text-xl sm:text-2xl font-bold text-white tracking-wide">
                {profile.email ? profile.email.split('@')[0] : 'Hero Candidate'}
              </h2>
            </div>
            <p className="text-xs text-indigo-300 font-mono flex items-center gap-1.5 mt-0.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{equippedTitle}</span>
            </p>
          </div>
        </div>

        {/* Level XP Bar & Coin Pouch */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 flex-1 max-w-xl">
          {/* Non-Linear XP Progress */}
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>Level Progress</span>
              </span>
              <span className="font-mono text-slate-400">
                <span className="text-indigo-300 font-bold">{currentXp}</span> / {xpNeeded} XP ({xpPercentage}%)
              </span>
            </div>
            <div className="w-full h-3 bg-rpg-dark rounded-full overflow-hidden border border-rpg-border p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-400 rounded-full transition-all duration-300 shadow-glow-intellect"
                style={{ width: `${xpPercentage}%` }}
                role="progressbar"
                aria-valuenow={xpPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Level Progress: ${xpPercentage}%`}
              />
            </div>
          </div>

          {/* Coin Pouch Counter (Habits Sole Source) */}
          <div className="flex items-center gap-3 bg-rpg-dark/70 border border-amber-500/30 rounded-xl px-4 py-2.5 shrink-0 shadow-glow-gold/30">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow">
              <Coins className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Coin Pouch
              </span>
              <span className="font-mono text-lg font-extrabold text-amber-200">
                {coinBalance} <span className="text-xs font-normal text-amber-400">Coins</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Global Reincarnation Danger Pressure Bar */}
      <div className="space-y-2 bg-rpg-dark/50 border border-rpg-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <AlertCircle className={`w-4 h-4 ${isHighPressure ? 'text-rose-500 animate-pulse' : isMediumPressure ? 'text-amber-500' : 'text-slate-400'}`} />
            <h3 className="font-fantasy text-sm font-bold tracking-wider text-slate-200">
              GLOBAL REINCARNATION PRESSURE METER
            </h3>
          </div>
          <span className="text-xs font-mono">
            Pressure: <strong className={isHighPressure ? 'text-rose-400 font-extrabold' : isMediumPressure ? 'text-amber-400' : 'text-slate-300'}>
              {reincarnationMeter}%
            </strong> / 100%
          </span>
        </div>

        <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-rpg-border p-0.5">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              isHighPressure 
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 shadow-glow-pressure animate-pulse' 
                : isMediumPressure 
                  ? 'bg-gradient-to-r from-indigo-500 to-amber-500' 
                  : 'bg-gradient-to-r from-emerald-500 to-indigo-500'
            }`}
            style={{ width: `${reincarnationMeter}%` }}
            role="progressbar"
            aria-valuenow={reincarnationMeter}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Reincarnation Pressure Meter: ${reincarnationMeter}%`}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
          <span>Failed/Expired Task (+15%)</span>
          <span className="italic text-slate-400">x &gt; y constraint enforced</span>
          <span>Completed Task (-8%)</span>
        </div>
      </div>

      {/* Bottom: 4 Category Stats & Average Power Score */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Category Attributes & Power Ranking</span>
          </h3>
          <div className="text-xs font-mono text-slate-300 bg-rpg-card px-2.5 py-1 rounded-md border border-rpg-border">
            Overall Power Score: <strong className="text-indigo-400 text-sm font-bold">{powerScore}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. Academics -> Intellect */}
          <div className="rpg-card p-3 border-indigo-500/30 bg-indigo-950/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-indigo-400 text-xs font-bold">Academics</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-lg font-mono font-bold text-white">
              {stats?.intellect || 10}
            </div>
            <div className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">
              Intellect
            </div>
          </div>

          {/* 2. Fitness -> Strength */}
          <div className="rpg-card p-3 border-rose-500/30 bg-rose-950/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-rose-400 text-xs font-bold">Fitness</span>
              <Dumbbell className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-lg font-mono font-bold text-white">
              {stats?.strength || 10}
            </div>
            <div className="text-[10px] text-rose-300 font-semibold uppercase tracking-wider">
              Strength
            </div>
          </div>

          {/* 3. Lifestyle -> Discipline */}
          <div className="rpg-card p-3 border-emerald-500/30 bg-emerald-950/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-emerald-400 text-xs font-bold">Lifestyle</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-mono font-bold text-white">
              {stats?.discipline || 10}
            </div>
            <div className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider">
              Discipline
            </div>
          </div>

          {/* 4. Other -> Willpower */}
          <div className="rpg-card p-3 border-purple-500/30 bg-purple-950/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-purple-400 text-xs font-bold">Other</span>
              <HeartHandshake className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-lg font-mono font-bold text-white">
              {stats?.willpower || 10}
            </div>
            <div className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
              Willpower
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
