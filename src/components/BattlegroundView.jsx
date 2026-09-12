/**
 * @file BattlegroundView.jsx
 * @description The Frontline Battleground: The player's Hero Avatar stands in dynamic standoff
 * against ALL FOUR category nemeses simultaneously.
 * Each enemy is animated and directly powered by uncompleted real-world quests.
 * Completing a quest triggers an elemental laser strike across the battlefield.
 */

import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  Flame, 
  Skull, 
  Shield, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Crosshair,
  Target,
  TrendingUp,
  Activity
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
  // Focused nemesis for detailed inspection and tactical strike
  const [targetCategory, setTargetCategory] = useState('Academics');
  // State for attack animation triggering
  const [activeStrike, setActiveStrike] = useState(null); // { category, taskId }

  const currentCat = CATEGORIES[targetCategory] || CATEGORIES.Academics;
  const currentBoss = currentCat.arenaBoss;
  const playerStatVal = stats?.[currentCat.stat] || 10;

  // Frame aesthetic for player avatar
  let frameBorderClass = 'border-indigo-500 shadow-glow-intellect';
  if (equippedFrame === 'frame_ember') {
    frameBorderClass = 'border-rose-500 shadow-glow-strength animate-pulse-danger';
  } else if (equippedFrame === 'frame_astral') {
    frameBorderClass = 'border-purple-500 shadow-glow-willpower animate-pulse-glow';
  }

  // Handle striking an enemy via quest completion
  const handleStrike = (taskId, category) => {
    setActiveStrike({ category, taskId });

    // Trigger completion in game state
    onCompleteTask(taskId);

    // Reset strike beam after animation plays
    setTimeout(() => {
      setActiveStrike(null);
    }, 700);
  };

  return (
    <section 
      aria-label="The Frontline Battleground" 
      className="rpg-panel p-5 sm:p-7 border-rose-500/30 shadow-2xl space-y-6 bg-gradient-to-b from-rpg-panel via-[#130b19] to-rpg-dark relative overflow-hidden"
    >
      {/* Header & Battle Atmosphere */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rpg-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-purple-700 flex items-center justify-center text-white shadow-glow-strength animate-pulse">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-fantasy text-xl sm:text-2xl font-bold text-white tracking-wide">
                THE FRONTLINE BATTLEGROUND
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-700/50">
                4-NEMESIS STANDOFF
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              All 4 attribute nemeses stand before you — each empowered by your <span className="text-rose-400 font-semibold">uncompleted quests</span>!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg border border-rpg-border self-start sm:self-auto">
          <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Real-time Attribute Clash</span>
        </div>
      </div>

      {/* Main Clash Arena: Hero vs All 4 Nemeses */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#090b14] via-[#140c1e] to-[#12080d] border border-rose-900/40 p-5 sm:p-7 shadow-inner overflow-hidden">
        {/* Animated Battle Arena Grid & Ambient Glow */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        {/* Animated Strike Projectile Beam */}
        {activeStrike && (
          <div className="absolute top-1/2 left-28 right-28 h-1.5 bg-gradient-to-r from-indigo-400 via-amber-300 to-rose-500 shadow-[0_0_25px_rgba(244,63,94,1)] z-30 animate-beam-strike pointer-events-none rounded-full" />
        )}

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* ========================================================= */}
          {/* LEFT: HERO AVATAR (PLAYER CHAMPION)                       */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 flex flex-col items-center text-center p-4 rounded-xl bg-black/40 border border-indigo-900/40 backdrop-blur-sm">
            <div className="relative mb-3">
              {/* Pulsing Arcane Rings */}
              <div className="absolute -inset-2 rounded-2xl bg-indigo-500/20 blur-md animate-pulse pointer-events-none" />
              
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-black border-2 ${frameBorderClass} flex items-center justify-center relative shadow-2xl animate-float`}>
                <span className="text-5xl select-none" role="img" aria-label="Player Avatar">🧙‍♂️</span>
                
                {/* Level Badge */}
                <div className="absolute -bottom-2 -left-1 px-2.5 py-0.5 rounded-md bg-indigo-600 border border-indigo-400 text-[10px] font-extrabold text-white tracking-wider shadow">
                  LVL {profile.current_level || 1}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/40">
                Guardian of Discipline
              </span>
              <h3 className="font-fantasy text-lg font-bold text-white tracking-wide">
                {profile.email ? profile.email.split('@')[0] : 'Hero Champion'}
              </h3>
              <p className="text-xs text-amber-300/90 font-mono">
                {equippedTitle}
              </p>
            </div>

            {/* Tactical Target Indicator */}
            <div className="w-full mt-4 pt-3 border-t border-rpg-border/60 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="text-slate-400">Targeting:</span>
              <strong className="text-rose-400 flex items-center gap-1 font-bold">
                <Target className="w-3.5 h-3.5" />
                <span>{currentBoss.name}</span>
              </strong>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CENTER: CLASH DIVIDER WITH ANIMATED PARTICLES             */}
          {/* ========================================================= */}
          <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-full bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-glow-pressure animate-pulse">
              <Swords className="w-4 h-4" />
            </div>
            <div className="h-16 w-0.5 bg-gradient-to-b from-rose-500/40 via-purple-500/30 to-transparent my-2" />
            <span className="font-fantasy text-xs font-bold text-rose-400 tracking-widest">
              VS
            </span>
            <div className="h-16 w-0.5 bg-gradient-to-t from-rose-500/40 via-purple-500/30 to-transparent my-2" />
          </div>

          {/* ========================================================= */}
          {/* RIGHT: ALL 4 CATEGORY NEMESES STANDING IN FORMATION       */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold px-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                <span>Active Frontline Nemeses (Click to Target)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Uncompleted Quests = Threat Level
              </span>
            </div>

            {/* 4-Enemy Lineup Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(CATEGORIES).map(([catKey, cat], idx) => {
                const bossData = cat.arenaBoss;
                const uncompletedInCat = tasks.filter(
                  (t) => t.category === catKey && !t.is_completed
                ).length;
                
                const isTargeted = targetCategory === catKey;
                const isBeingStruck = activeStrike?.category === catKey;
                const isSubdued = uncompletedInCat === 0;
                const isRaging = uncompletedInCat >= 2;

                // Staggered float delay for natural alive motion
                const delayStyles = [
                  { animationDelay: '0s' },
                  { animationDelay: '0.4s' },
                  { animationDelay: '0.8s' },
                  { animationDelay: '1.2s' }
                ][idx % 4];

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setTargetCategory(catKey)}
                    aria-label={`Target nemesis ${bossData.name} in ${cat.name}`}
                    className={`rpg-btn p-3 rounded-xl border text-center flex flex-col items-center justify-between gap-2 transition-all relative ${
                      isTargeted
                        ? 'ring-2 ring-rose-500/80 bg-rose-950/40 border-rose-500 shadow-glow-pressure scale-[1.03]'
                        : 'bg-black/50 border-rpg-border/80 hover:bg-slate-900/60 hover:border-slate-600'
                    } ${isBeingStruck ? 'animate-hit-shake bg-rose-600/40' : ''}`}
                  >
                    {/* Active Target Reticle Indicator */}
                    {isTargeted && (
                      <div className="absolute top-1.5 right-1.5 text-rose-400">
                        <Target className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    )}

                    {/* Animated Boss Icon / Sprite */}
                    <div 
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl select-none relative transition-transform ${
                        isRaging 
                          ? 'animate-pulse-danger' 
                          : 'animate-float'
                      } ${isSubdued ? 'opacity-40 grayscale' : ''}`}
                      style={delayStyles}
                    >
                      <span>{bossData.emoji}</span>
                      
                      {/* Enraged Dark Fire Indicator */}
                      {isRaging && (
                        <span className="absolute -top-1 -right-1 text-xs animate-bounce" title="Raging Threat!">
                          🔥
                        </span>
                      )}
                    </div>

                    {/* Nemesis Details */}
                    <div className="w-full space-y-0.5">
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded border ${cat.badgeClass}`}>
                        {cat.name}
                      </span>
                      <h4 className="font-fantasy text-xs font-bold text-white truncate max-w-full">
                        {bossData.name}
                      </h4>
                    </div>

                    {/* Threat / Quests Fueling Badge */}
                    <div className="w-full pt-1.5 border-t border-rpg-border/60">
                      {isSubdued ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Pacified</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-rose-300 font-bold flex items-center justify-center gap-1 bg-rose-950/60 py-0.5 rounded border border-rose-800/40">
                          <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                          <span>+{uncompletedInCat} Fueling</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TACTICAL DIRECT COMBAT: FUELING QUESTS FOR TARGET NEMESIS   */}
      {/* ========================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="font-fantasy text-sm font-bold text-white tracking-wide">
              Quests Fueling {currentBoss.name} ({currentCat.name} Realm)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {tasks.filter((t) => t.category === targetCategory && !t.is_completed).length === 0
              ? '✨ This nemesis has been subdued! Zero quests fueling its dark aura.'
              : '⚔️ Strike with quest completion to weaken its presence:'}
          </span>
        </div>

        {tasks.filter((t) => t.category === targetCategory && !t.is_completed).length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-700/30 flex items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-emerald-300">
                  {currentCat.name} Realm Tranquility Achieved
                </p>
                <p className="text-[11px] text-slate-400">
                  {currentBoss.name} is pacified! No incomplete quests are generating dark pressure in this category.
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
            {tasks
              .filter((t) => t.category === targetCategory && !t.is_completed)
              .map((task) => {
                const diff = DIFFICULTY_CONFIG[task.difficulty] || DIFFICULTY_CONFIG.Medium;

                return (
                  <div
                    key={task.id}
                    className="rpg-card p-3.5 border-rose-900/40 hover:border-rose-500/50 bg-black/50 flex flex-col justify-between gap-3 transition-all shadow"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${diff.badgeClass}`}>
                          {diff.label} Tier
                        </span>
                        <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
                          <Flame className="w-3 h-3" />
                          <span>Empowers Boss</span>
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
                        onClick={() => handleStrike(task.id, targetCategory)}
                        aria-label={`Strike nemesis ${currentBoss.name} by completing quest: ${task.title}`}
                        className="rpg-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-glow-strength transition-all active:scale-95"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>Strike! (Complete)</span>
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
