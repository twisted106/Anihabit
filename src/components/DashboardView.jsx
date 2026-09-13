import React from 'react';
import { Shield, Award, Coins, Flame, Zap, Trophy, BookOpen, Dumbbell, Sparkles } from 'lucide-react';
import { calculateXpToNextLevel, calculatePowerScore } from '../constants/gameConfig';

/**
 * SCREEN 5 — Dashboard (Player-Only Character Sheet Detail View)
 * Restricted entirely to the player's personal progression:
 * - Character portrait / avatar
 * - Level & non-linear XP progress bar ('Level Progress' or 'Experience' — NEVER 'Discipline')
 * - Coin balance
 * - All 4 category stats with exact values & labels (Strength, Intellect, Discipline, Willpower)
 * - Current streak count
 * - Reincarnation meter repeated here for reference
 */
export default function DashboardView({
  profile,
  stats,
  habits = [],
  equippedTitle = 'Guild Champion'
}) {
  const level = profile?.current_level || 1;
  const currentXp = Number(profile?.current_xp || 0);
  const xpNeeded = calculateXpToNextLevel(level);
  const xpPercent = Math.min(100, Math.round((currentXp / xpNeeded) * 100));
  const powerScore = calculatePowerScore(stats);
  const coinBalance = profile?.coin_balance ?? 0;
  const reincarnationMeter = Math.round(profile?.reincarnation_meter ?? 0);

  // Highest active streak across habits
  const highestCurrentStreak = habits.reduce((max, h) => Math.max(max, h.current_streak || 0), 0);
  const highestEverStreak = habits.reduce((max, h) => Math.max(max, h.longest_streak || 0), 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6" data-purpose="screen-player-dashboard">
      
      {/* Ornate Plaque Header */}
      <div className="carved-plaque px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border-2 border-amber-700/80 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-cinzel font-black text-sm sm:text-base md:text-lg text-amber-200 tracking-wider uppercase drop-shadow">
            Hero Character Sheet & Progression
          </h2>
          <p className="text-xs font-newsreader text-stone-300 italic">
            The full anatomical record of your real-world discipline and attributes
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-amber-950/70 border border-amber-600/60 px-3 py-1.5 rounded-lg text-amber-300 shrink-0">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="font-cinzel text-xs font-bold">Power Score: {powerScore}</span>
        </div>
      </div>

      {/* Main Character Sheet Card (Tavern Hearth Tabletop Plaque) */}
      <div className="guardian-card-frame p-4 sm:p-8 bg-wood-planks/95 border-4 border-[#201308] shadow-[0_15px_50px_rgba(0,0,0,0.9)] relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left: Character Portrait & Title (Span 4) */}
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-4 border-amber-500/80 shadow-2xl bg-stone-950 p-1">
              <img 
                src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80" 
                alt="Character Avatar"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute -bottom-2 -right-2 px-3 py-0.5 rounded-full bg-amber-600 border border-yellow-200 text-stone-950 font-cinzel font-black text-xs shadow">
                LVL {level}
              </div>
            </div>

            <h3 className="font-cinzel font-bold text-lg text-parchment-200 tracking-wide mt-3">
              {profile?.email ? profile.email.split('@')[0] : 'Hero'}
            </h3>
            <span className="px-3 py-0.5 rounded bg-amber-950 border border-amber-600/60 text-xs font-cinzel text-amber-300 uppercase tracking-widest mt-1">
              {equippedTitle}
            </span>
          </div>

          {/* Right: Level Progress & Key Metrics (Span 8) */}
          <div className="md:col-span-8 space-y-4">
            
            {/* Level Progress (XP) Bar — NEVER labeled Discipline */}
            <div className="carved-plaque p-4 rounded-xl border border-amber-800/80 space-y-2">
              <div className="flex justify-between items-baseline text-xs font-cinzel">
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Level Progress (Experience)</span>
                </span>
                <span className="text-amber-200 font-bold">
                  {currentXp} / {xpNeeded} XP ({xpPercent}%)
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-3 bg-stone-950 rounded-full border border-amber-900/80 overflow-hidden p-0.5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <p className="text-[10px] font-cinzel text-stone-400 text-right">
                Non-Linear Threshold: 100 × (Level ^ 1.5)
              </p>
            </div>

            {/* Quick Stat Pill Strips (Coins, Streak, Reincarnation) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Coin Balance */}
              <div className="bg-wood-900/90 border border-amber-700/60 p-3 rounded-lg flex items-center gap-3 shadow">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <div className="text-[10px] font-cinzel uppercase text-amber-400/80">Coin Balance</div>
                  <div className="text-base font-cinzel font-bold text-amber-300">{coinBalance} GP</div>
                </div>
              </div>

              {/* Current Active Streak */}
              <div className="bg-wood-900/90 border border-emerald-700/60 p-3 rounded-lg flex items-center gap-3 shadow">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <div className="text-[10px] font-cinzel uppercase text-emerald-400/80">Active Streak</div>
                  <div className="text-base font-cinzel font-bold text-emerald-300">{highestCurrentStreak} Days</div>
                </div>
              </div>

              {/* Reincarnation Pressure Ref */}
              <div className="bg-wood-900/90 border border-red-700/60 p-3 rounded-lg flex items-center gap-3 shadow">
                <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-red-300" />
                </div>
                <div>
                  <div className="text-[10px] font-cinzel uppercase text-red-400/80">Pressure Meter</div>
                  <div className="text-base font-cinzel font-bold text-red-300">{reincarnationMeter}%</div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Section: All 4 Category Stats with Exact Numbers & Short Labels */}
        <div className="mt-8 pt-6 border-t border-amber-900/60">
          <h4 className="font-cinzel font-bold text-xs sm:text-sm text-amber-300 uppercase tracking-widest mb-3">
            Core Attribute Breakdown
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Strength (Fitness) */}
            <div className="parchment-surface p-4 rounded-xl border border-amber-950 shadow flex items-center justify-between">
              <div>
                <div className="text-xs font-cinzel font-bold text-amber-950 uppercase">Strength</div>
                <div className="text-[11px] font-newsreader text-amber-900/80">Fitness & Physical Energy</div>
              </div>
              <div className="text-2xl sm:text-3xl font-garamond font-black text-amber-950">
                {stats?.strength ?? 10}
              </div>
            </div>

            {/* 2. Intellect (Academics) */}
            <div className="parchment-surface p-4 rounded-xl border border-amber-950 shadow flex items-center justify-between">
              <div>
                <div className="text-xs font-cinzel font-bold text-amber-950 uppercase">Intellect</div>
                <div className="text-[11px] font-newsreader text-amber-900/80">Academics & Arcane Study</div>
              </div>
              <div className="text-2xl sm:text-3xl font-garamond font-black text-amber-950">
                {stats?.intellect ?? 10}
              </div>
            </div>

            {/* 3. Discipline (Lifestyle) */}
            <div className="parchment-surface p-4 rounded-xl border border-amber-950 shadow flex items-center justify-between">
              <div>
                <div className="text-xs font-cinzel font-bold text-amber-950 uppercase">Discipline</div>
                <div className="text-[11px] font-newsreader text-amber-900/80">Lifestyle & Rituals</div>
              </div>
              <div className="text-2xl sm:text-3xl font-garamond font-black text-amber-950">
                {stats?.discipline ?? 10}
              </div>
            </div>

            {/* 4. Willpower (Other) */}
            <div className="parchment-surface p-4 rounded-xl border border-amber-950 shadow flex items-center justify-between">
              <div>
                <div className="text-xs font-cinzel font-bold text-amber-950 uppercase">Willpower</div>
                <div className="text-[11px] font-newsreader text-amber-900/80">Focus & Heavy Chores</div>
              </div>
              <div className="text-2xl sm:text-3xl font-garamond font-black text-amber-950">
                {stats?.willpower ?? 10}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
