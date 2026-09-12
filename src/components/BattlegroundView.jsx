/**
 * @file BattlegroundView.jsx
 * @description The Battleground: dynamic duel arena where the player's avatar faces off against category nemeses.
 * Each nemesis is directly empowered by uncompleted quests in its category.
 * Subduing the enemy requires completing the real-world quests that fuel its dark aura.
 */

import React, { useState } from 'react';
import { 
  Swords, 
  Flame, 
  Skull, 
  Shield, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { CATEGORIES, DIFFICULTY_CONFIG } from '../constants/gameConfig';

export default function BattlegroundView({
  stats,
  tasks,
  profile,
  equippedTitle,
  equippedFrame,
  onCompleteTask,
  onOpenCreateTask
}) {
  // Selected category nemesis to confront
  const [selectedCategory, setSelectedCategory] = useState('Academics');

  const currentCat = CATEGORIES[selectedCategory] || CATEGORIES.Academics;
  const boss = currentCat.arenaBoss;
  const playerStatVal = stats?.[currentCat.stat] || 10;

  // Uncompleted tasks fueling this specific enemy
  const fuelingTasks = tasks.filter(
    (t) => t.category === selectedCategory && !t.is_completed
  );
  const completedTasks = tasks.filter(
    (t) => t.category === selectedCategory && t.is_completed
  );

  const incompleteCount = fuelingTasks.length;
  
  // Calculate dynamic boss threat level powered by incomplete tasks
  // Each incomplete task adds +30% threat; caps at 100%
  const bossThreatPercent = Math.min(100, incompleteCount * 30);
  const isBossRaging = bossThreatPercent >= 60;
  const isBossSubdued = incompleteCount === 0;

  // Boss Dark Power calculation: Base 15 + (incomplete tasks * 18)
  const bossPowerScore = 15 + (incompleteCount * 18);

  // Frame aesthetic for player avatar
  let frameBorderClass = 'border-indigo-500 shadow-glow-intellect';
  if (equippedFrame === 'frame_ember') {
    frameBorderClass = 'border-rose-500 shadow-glow-strength animate-pulse-glow';
  } else if (equippedFrame === 'frame_astral') {
    frameBorderClass = 'border-purple-500 shadow-glow-willpower animate-pulse-glow';
  }

  return (
    <section 
      aria-label="The Battleground" 
      className="rpg-panel p-5 sm:p-7 border-rose-500/30 shadow-2xl space-y-6 bg-gradient-to-b from-rpg-panel via-[#120d18] to-rpg-dark relative overflow-hidden"
    >
      {/* Header & Arena Stance Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-rpg-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-glow-strength">
              <Swords className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-fantasy text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                <span>The Battleground</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-700/50 font-mono font-normal uppercase tracking-wider">
                  Live Clash
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Nemeses draw dark kinetic power directly from your <strong className="text-rose-300">uncompleted quests</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Category Nemesis Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(CATEGORIES).map(([catKey, cat]) => {
            const activeInCat = tasks.filter((t) => t.category === catKey && !t.is_completed).length;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey)}
                className={`rpg-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? `${cat.badgeClass} ring-2 ring-rose-500/60 font-bold shadow-lg scale-105`
                    : 'bg-rpg-card/60 text-slate-400 border border-rpg-border hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{cat.arenaBoss.emoji}</span>
                <span>{cat.name}</span>
                {activeInCat > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-mono font-bold animate-pulse">
                    +{activeInCat} Threat
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-mono">
                    ✓ Clear
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duel Arena Arena Stage (Hero vs Nemesis) */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#090b14] via-[#160e20] to-[#140b0f] border border-rose-900/30 p-6 sm:p-8 shadow-inner overflow-hidden">
        {/* Arena Grid Background Effect */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
          {/* Left: Player Avatar Combatant */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <div className="flex items-center gap-3.5">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-950 border-2 ${frameBorderClass} flex items-center justify-center relative shadow-2xl`}>
                <span className="text-4xl select-none" role="img" aria-label="Hero Avatar">🧙‍♂️</span>
                <div className="absolute -bottom-2 -left-1 px-2 py-0.5 rounded-md bg-indigo-600 border border-indigo-400 text-[10px] font-bold text-white tracking-wider shadow">
                  LVL {profile.current_level || 1}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                  Player Champion
                </span>
                <h3 className="font-fantasy text-lg font-bold text-white mt-1">
                  {profile.email ? profile.email.split('@')[0] : 'Hero Candidate'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {equippedTitle}
                </p>
              </div>
            </div>

            {/* Player Attribute Power Bar */}
            <div className="w-full space-y-1 bg-black/40 p-2.5 rounded-xl border border-indigo-900/40">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{currentCat.statLabel} Mastery:</span>
                </span>
                <strong className="text-indigo-300 font-bold">{playerStatVal} PWR</strong>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (playerStatVal / 60) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Center: Clash Vortex & Status Banner */}
          <div className="md:col-span-3 flex flex-col items-center justify-center text-center space-y-2 py-2">
            <div className="w-12 h-12 rounded-full bg-black/60 border border-rose-500/40 flex items-center justify-center shadow-glow-pressure">
              <Swords className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>

            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              CLASH OF DISCIPLINE
            </div>

            {/* Dynamic Status Message */}
            {isBossSubdued ? (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 shadow-glow-discipline">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Realm Liberated! Boss Subdued!</span>
              </div>
            ) : isBossRaging ? (
              <div className="px-3 py-1.5 rounded-lg bg-rose-950/90 border border-rose-600 text-rose-200 text-xs font-semibold flex items-center gap-1.5 shadow-glow-pressure animate-shake">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Chaos Surge! Enemy Empowered!</span>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs font-semibold">
                <span>{incompleteCount} Quests Fueling Nemesis</span>
              </div>
            )}
          </div>

          {/* Right: Nemesis Combatant (Powered by Incomplete Tasks) */}
          <div className="md:col-span-4 flex flex-col items-center md:items-end text-center md:text-right space-y-3">
            <div className="flex items-center gap-3.5 flex-row-reverse md:flex-row">
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${currentCat.badgeClass}`}>
                  {currentCat.name} Nemesis
                </span>
                <h3 className="font-fantasy text-lg font-bold text-white mt-1">
                  {boss.name}
                </h3>
                <p className="text-xs text-rose-400/90 italic">
                  "{boss.title}"
                </p>
              </div>

              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-950 to-black border-2 ${
                isBossRaging 
                  ? 'border-rose-500 shadow-glow-pressure animate-pulse-glow' 
                  : isBossSubdued 
                    ? 'border-emerald-600/40 opacity-50' 
                    : 'border-amber-500/50'
              } flex items-center justify-center relative shadow-2xl transition-all duration-300`}>
                <span className={`text-4xl select-none transition-transform duration-300 ${isBossRaging ? 'scale-115' : isBossSubdued ? 'scale-90 grayscale' : ''}`} role="img" aria-label={boss.name}>
                  {boss.emoji}
                </span>
                <div className={`absolute -bottom-2 -right-1 px-2 py-0.5 rounded-md border text-[10px] font-bold text-white tracking-wider shadow ${
                  isBossSubdued ? 'bg-emerald-700 border-emerald-500' : 'bg-rose-700 border-rose-500'
                }`}>
                  PWR {bossPowerScore}
                </div>
              </div>
            </div>

            {/* Boss Threat Meter */}
            <div className="w-full space-y-1 bg-black/40 p-2.5 rounded-xl border border-rose-900/40">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Chaos Threat Gauge:</span>
                </span>
                <strong className={isBossRaging ? 'text-rose-400 font-extrabold' : 'text-amber-300 font-bold'}>
                  {bossThreatPercent}% THREAT
                </strong>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isBossRaging 
                      ? 'bg-gradient-to-r from-amber-500 to-rose-600 shadow-glow-pressure' 
                      : isBossSubdued 
                        ? 'bg-emerald-500' 
                        : 'bg-gradient-to-r from-indigo-500 to-amber-500'
                  }`}
                  style={{ width: `${bossThreatPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fueling Tasks Direct Combat Panel */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="font-fantasy text-sm font-bold text-slate-200 tracking-wide">
              Quests Currently Fueling {boss.name}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {incompleteCount === 0 
              ? '✨ Zero uncompleted quests — enemy is fully pacified!' 
              : `⚔️ Complete these quests to strike down ${boss.name}'s dark power:`}
          </span>
        </div>

        {incompleteCount === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-700/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-emerald-300">
                  {currentCat.name} Realm Tranquility Achieved
                </p>
                <p className="text-[11px] text-slate-400">
                  No unfinished quests are feeding this nemesis. Your {currentCat.statLabel} reigns supreme!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCreateTask}
              className="rpg-btn px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shrink-0"
            >
              Inscribe New Quest
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {fuelingTasks.map((task) => {
              const diff = DIFFICULTY_CONFIG[task.difficulty] || DIFFICULTY_CONFIG.Medium;

              return (
                <div
                  key={task.id}
                  className="rpg-card p-3.5 border-rose-900/40 hover:border-rose-500/50 bg-black/50 flex flex-col justify-between gap-2.5 transition-all shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${diff.badgeClass}`}>
                        {diff.label} Tier
                      </span>
                      <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>+30% Threat</span>
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-100 line-clamp-2">
                      {task.title}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-rpg-border/60 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-indigo-300">
                      +{diff.xp} XP • +{diff.stat} {currentCat.statLabel}
                    </span>

                    <button
                      type="button"
                      onClick={() => onCompleteTask(task.id)}
                      aria-label={`Strike nemesis by completing quest: ${task.title}`}
                      className="rpg-btn flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-glow-strength transition-all"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>Strike (Complete)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
