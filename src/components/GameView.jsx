import React, { useState } from 'react';
import TabletopCard from './TabletopCard';
import ReincarnationBar from './ReincarnationBar';
import { calculateXpToNextLevel, MAX_HABIT_DAILY_COINS, getMostRecentMidnightIST } from '../constants/gameConfig';
import { BookOpen, Dumbbell, Sparkles, Flame, Coins, Check, Trash2, Plus, ArrowRight } from 'lucide-react';

/**
 * SCREEN 2 — Desktop & Mobile Tabletop Game View
 * Faithfully matches Stitch project 'Tavern Hearth Tabletop' design system.
 * 
 * Elements:
 * 1. Global Reincarnation Pressure Meter (0-100%, warns +15% per miss, -8% per complete)
 * 2. Ornate Scroll Banner: "Habit / Task"
 * 3. Carved Wooden/Bronze Rocker Mode Toggle Switch (Quests / Tasks vs. Habit Forge)
 * 5. Desktop Tabletop Grid:
 *    - Left (Span 4): Champion Card (Knight Protector) + Level Progress (XP) Bar + Character Sheet link
 *    - Right (Span 8):
 *        - In Task Mode: Active Category Adversaries (Red Drake, Crypt Warden, Goblin Scout, Wood Wisp)
 *        - In Habit Mode: Habit Forge Ledger with streak counters, coin bounties, and daily sealed states
 * 6. Floating Wax-Seal Action Button (+ Add Challenge)
 */

const KNIGHT_PROTECTOR_ART = '/images/knight_protector.jpg';

const CATEGORY_ADVERSARIES = [
  {
    category: 'Fitness',
    name: 'Red Drake',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACqlhbeZ8JrmUZBBqtueEC1A2ohsyATrlLDWIUsVkyFIFtXXGd4CrohMU9KWJ6FqgC7hNzsrfBlGDHAyTSsiBBQk_61I50OVE-Eetku84M-Vnk7Bj2qxJWwICI5ayMZskYIR5btKaZn6CEbKz85zrbzyN7byovh-vanvPm2w2hA8Cka3GN5lFhUbom88ikKShnSCzFW-2nxGHw7PXCgzwRF6_jps5T_NYcOJRT0qmB9nhu_VXz6MejgQ',
    imageFilterClass: 'hue-rotate-[-35deg] saturate-150 contrast-125',
    categoryBadge: 'Fitness',
    statKey: 'strength',
  },
  {
    category: 'Academics',
    name: 'Crypt Warden',
    imageSrc: '/images/crypt_warden.jpg',
    imageFilterClass: 'contrast-125 brightness-95',
    categoryBadge: 'Academics',
    statKey: 'intellect',
  },
  {
    category: 'Lifestyle',
    name: 'Goblin Scout',
    imageSrc: '/images/goblin_scout.jpg',
    imageFilterClass: 'contrast-125 brightness-95',
    categoryBadge: 'Lifestyle',
    statKey: 'discipline',
  },
  {
    category: 'Other',
    name: 'Wood Wisp',
    imageSrc: '/images/wood_wisp.jpg',
    imageFilterClass: 'contrast-110 brightness-95',
    categoryBadge: 'Other',
    statKey: 'willpower',
  }
];

const CATEGORY_ICONS = {
  Academics: BookOpen,
  Fitness: Dumbbell,
  Lifestyle: Sparkles,
  Other: Flame
};

const CATEGORY_THEMES = {
  Academics: {
    bg: 'bg-indigo-950/90',
    border: 'border-indigo-500/60',
    text: 'text-indigo-300',
    shadow: 'shadow-[0_0_12px_rgba(99,102,241,0.3)]'
  },
  Fitness: {
    bg: 'bg-rose-950/90',
    border: 'border-rose-500/60',
    text: 'text-rose-300',
    shadow: 'shadow-[0_0_12px_rgba(244,63,94,0.3)]'
  },
  Lifestyle: {
    bg: 'bg-emerald-950/90',
    border: 'border-emerald-500/60',
    text: 'text-emerald-300',
    shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]'
  },
  Other: {
    bg: 'bg-purple-950/90',
    border: 'border-purple-500/60',
    text: 'text-purple-300',
    shadow: 'shadow-[0_0_12px_rgba(168,85,247,0.3)]'
  }
};

export default function GameView({
  profile,
  stats,
  tasks = [],
  habits = [],
  onInspectCard,
  onOpenAddChallenge,
  onOpenTradeoffModal,
  onAdjustPressure,
  onCompleteHabit,
  onDeleteHabit
}) {
  // Mode toggle: 'tasks' | 'habits'
  const [viewMode, setViewMode] = useState('tasks');

  const level = profile?.current_level || 1;
  const currentXp = Number(profile?.current_xp || 0);
  const xpNeeded = calculateXpToNextLevel(level);
  const xpPercent = Math.min(100, Math.round((currentXp / xpNeeded) * 100));

  // Active tasks count per category
  const getCategoryActiveCount = (category) => {
    return tasks.filter(t => t.category === category && !t.is_completed).length;
  };

  // Completed today summary (since most recent midnight IST boundary)
  const midnightIST = getMostRecentMidnightIST();
  const completedTasksCount = tasks.filter(t => t.is_completed && t.completed_at && new Date(t.completed_at) >= midnightIST).length;
  const totalTasksCount = tasks.length;
  const currentStreak = profile?.current_streak || 0;

  // Helper to determine if habit is checked in today (since most recent midnight IST boundary)
  const isHabitCompletedToday = (lastCompletedAt) => {
    if (!lastCompletedAt) return false;
    const lastDate = new Date(lastCompletedAt);
    return lastDate >= midnightIST;
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4" data-purpose="view-gameview">
      
      {/* 1. Ornate Scroll Banner: "Habit / Task" */}
      <div className="relative flex items-center justify-center w-full max-w-lg mx-auto">
        {/* Left Scroll Curl */}
        <div className="w-7 h-14 bg-gradient-to-r from-parchment-500 to-parchment-300 rounded-l-md border-y-2 border-l-2 border-amber-950 shadow-xl transform -skew-y-3" />
        {/* Center Scroll Body */}
        <div className="parchment-surface px-10 py-2.5 rounded-sm border-y-2 border-amber-950 flex items-center justify-center shadow-2xl relative -mx-1">
          <span className="text-amber-950 text-xl md:text-2xl font-cinzel font-black tracking-widest uppercase flex items-center gap-3 drop-shadow-sm">
            <span className="text-amber-800 text-sm">✦</span>
            Habit / Task
            <span className="text-amber-800 text-sm">✦</span>
          </span>
        </div>
        {/* Right Scroll Curl */}
        <div className="w-7 h-14 bg-gradient-to-l from-parchment-500 to-parchment-300 rounded-r-md border-y-2 border-r-2 border-amber-950 shadow-xl transform skew-y-3" />
      </div>

      {/* 3. Global Reincarnation Pressure Meter (Persistently visible in both modes) */}
      <ReincarnationBar 
        meterValue={profile?.reincarnation_meter || 0}
        onOpenTradeoffModal={onOpenTradeoffModal}
        onAdjustPressure={onAdjustPressure}
      />

      {/* 4. Carved Wooden/Bronze Rocker Mode Toggle Switch */}
      <div className="flex items-center justify-center w-full max-w-md mx-auto my-2">
        <div 
          className="w-full bg-gradient-to-r from-[#190d05] via-[#241308] to-[#190d05] p-1.5 rounded-xl border border-amber-600/70 shadow-[0_4px_20px_rgba(0,0,0,0.8),inset_0_1px_4px_rgba(0,0,0,0.9)] flex items-center gap-2"
          role="group"
          aria-label="Tabletop view mode selector"
        >
          {/* Quests / Tasks Mode Switch */}
          <button
            type="button"
            onClick={() => setViewMode('tasks')}
            aria-pressed={viewMode === 'tasks'}
            className={`flex-1 py-2 px-3 rounded-lg font-cinzel font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus:ring-1 focus:ring-amber-400 ${
              viewMode === 'tasks'
                ? 'bg-gradient-to-b from-amber-400 via-amber-600 to-amber-800 text-stone-950 font-black border border-amber-200 shadow-[0_0_16px_rgba(245,180,40,0.6)] scale-[1.02]'
                : 'text-amber-300/70 hover:text-amber-200 hover:bg-amber-950/40 border border-transparent'
            }`}
            aria-label="Switch to Task view"
          >
            <span className="text-sm">📜</span>
            <span>Quests (Tasks)</span>
          </button>

          {/* Habit Forge Mode Switch */}
          <button
            type="button"
            onClick={() => setViewMode('habits')}
            aria-pressed={viewMode === 'habits'}
            className={`flex-1 py-2 px-3 rounded-lg font-cinzel font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus:ring-1 focus:ring-amber-400 ${
              viewMode === 'habits'
                ? 'bg-gradient-to-b from-amber-400 via-amber-600 to-amber-800 text-stone-950 font-black border border-amber-200 shadow-[0_0_16px_rgba(245,180,40,0.6)] scale-[1.02]'
                : 'text-amber-300/70 hover:text-amber-200 hover:bg-amber-950/40 border border-transparent'
            }`}
            aria-label="Switch to Habit view"
          >
            <span className="text-sm">🔥</span>
            <span>Habit Forge</span>
          </button>
        </div>
      </div>

      {/* 5. Desktop Tabletop Standoff Layout:
          Player Card on Left [Span 4] vs Arena / Ledger on Right [Span 8] */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
        
        {/* FAR LEFT: Champion Card (Knight Protector) [lg:col-span-4] (Present in both modes) */}
        <div className="lg:col-span-4 flex flex-col items-center" data-purpose="player-knight-card">
          <div className="w-full max-w-sm">
            <TabletopCard
              name="Knight Protector"
              category="Champion"
              imageSrc={KNIGHT_PROTECTOR_ART}
              categoryBadge="Champion"
              statusBadge="READY"
              stats={stats}
              onClick={() => onInspectCard({ 
                type: 'player', 
                name: 'Knight Protector', 
                category: 'Champion',
                imageSrc: KNIGHT_PROTECTOR_ART,
                stats 
              })}
              isPlayer
            />

            {/* Level Progress (XP) Bar beneath Player Card */}
            <div className="w-full mt-3 space-y-1.5 px-2">
              <div className="flex justify-between text-[11px] font-cinzel text-amber-200">
                <span>Level Progress (XP)</span>
                <span>{currentXp} / {xpNeeded} XP</span>
              </div>
              <div className="w-full h-2.5 bg-stone-900 rounded-full border border-amber-950 overflow-hidden p-0.5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-stone-400 font-cinzel text-right pt-0.5">
                Habits yield escalating gold coins daily
              </p>
            </div>

            {/* Inspect Knight / Character Sheet Trigger */}
            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => onInspectCard({ 
                  type: 'player', 
                  name: 'Knight Protector', 
                  category: 'Champion',
                  imageSrc: KNIGHT_PROTECTOR_ART,
                  stats 
                })}
                className="text-xs font-cinzel text-amber-400/80 hover:text-amber-200 underline decoration-amber-600 inline-flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              >
                <span>View Character Sheet</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Active Area [lg:col-span-8] */}
        <div className="lg:col-span-8 flex flex-col">
          
          {/* ========================================================================= */}
          {/* MODE A: QUESTS / TASKS VIEW (4 Category Adversaries) */}
          {/* ========================================================================= */}
          {viewMode === 'tasks' && (
            <div className="flex flex-col space-y-4" data-purpose="tasks-mode-panel">
              {/* Section Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <span className="text-amber-400 text-sm font-cinzel font-bold uppercase tracking-wider">
                    Active Category Adversaries
                  </span>
                  <span className="bg-amber-950/80 px-2 py-0.5 rounded text-[11px] text-amber-300 font-cinzel border border-amber-700/50">
                    4 Domains Active
                  </span>
                </div>
              </div>

              {/* 4 Adversary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                {CATEGORY_ADVERSARIES.map((enemy) => {
                  const activeCount = getCategoryActiveCount(enemy.category);
                  return (
                    <TabletopCard
                      key={enemy.category}
                      name={enemy.name}
                      category={enemy.category}
                      imageSrc={enemy.imageSrc}
                      imageFilterClass={enemy.imageFilterClass}
                      categoryBadge={enemy.categoryBadge}
                      statusBadge={`${activeCount} Active`}
                      stats={stats}
                      isGreyedOut={activeCount === 0}
                      onClick={() => onInspectCard({ 
                        type: 'enemy', 
                        name: enemy.name, 
                        category: enemy.category, 
                        imageSrc: enemy.imageSrc,
                        stats 
                      })}
                    />
                  );
                })}
              </div>

              {/* Bottom Tabletop Relic Bar: Daily Quest Completion */}
              <div className="carved-plaque p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 shadow mt-2">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl" role="img" aria-label="Parchment Scroll">📜</span>
                  <div>
                    <div className="text-xs font-cinzel font-bold text-amber-200">
                      Daily Quest Completion
                    </div>
                    <div className="text-[11px] text-amber-400/70 font-cinzel">
                      {completedTasksCount} of {totalTasksCount} objectives accomplished today
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-cinzel text-amber-300/80">
                    Habit Streak:
                  </span>
                  <span className="bg-amber-900/60 border border-amber-600/50 px-2.5 py-0.5 rounded text-xs font-cinzel font-bold text-amber-200">
                    {currentStreak} Days
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODE B: HABIT FORGE VIEW (Daily Recurring Disciplines & Coin Economy) */}
          {/* ========================================================================= */}
          {viewMode === 'habits' && (
            <div className="flex flex-col space-y-4" data-purpose="habits-mode-panel">
              {/* Section Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <span className="text-amber-400 text-sm font-cinzel font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Habit Forge & Daily Disciplines</span>
                  </span>
                  <span className="bg-amber-950/80 px-2 py-0.5 rounded text-[11px] text-amber-300 font-cinzel border border-amber-700/50">
                    {habits.length} Inscribed
                  </span>
                </div>
              </div>

              {/* Habit Ledger Container */}
              <div className="guardian-card-frame p-4 sm:p-5 bg-gradient-to-b from-[#211107] via-[#160b05] to-[#0e0603] border-2 border-amber-600/70 space-y-3.5 shadow-2xl rounded-2xl">
                
                {/* Ledger Description Plaque */}
                <div className="bg-gradient-to-r from-[#170c05] via-[#201007] to-[#170c05] rounded-xl py-2.5 px-3.5 flex items-center justify-between border border-amber-700/50 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-newsreader text-amber-200/90 italic">
                    <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Daily check-ins award escalating guild coins: +min(streak + 1, 10) GP. Single daily fortify lock.</span>
                  </div>
                  <div className="text-[10px] font-cinzel font-bold text-amber-300 uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-950 to-black border border-amber-500/50 shrink-0 ml-2 shadow">
                    Sole Coin Source
                  </div>
                </div>

                {/* Empty State */}
                {habits.length === 0 ? (
                  <div className="parchment-surface p-6 rounded-lg text-center space-y-2 my-2 border border-amber-950">
                    <h3 className="font-cinzel font-bold text-sm text-amber-950 uppercase tracking-wider">
                      No Daily Disciplines Inscribed
                    </h3>
                    <p className="font-newsreader text-xs text-amber-900 max-w-md mx-auto">
                      Your habit ledger lies empty. Daily habits build consecutive streaks and represent the sole source of gold coins needed to acquire relics in the Bazaar.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onOpenAddChallenge('habit')}
                        className="carved-plaque px-4 py-1.5 rounded text-xs font-cinzel font-bold text-amber-200 border border-amber-500/70 hover:border-amber-300 shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                      >
                        + Inscribe First Discipline
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Habit Rows List */
                  <div className="space-y-2.5" role="feed" aria-label="Habit Forge Ledger">
                    {habits.map((habit) => {
                      const IconComponent = CATEGORY_ICONS[habit.category] || Flame;
                      const catTheme = CATEGORY_THEMES[habit.category] || CATEGORY_THEMES.Lifestyle;
                      const isCompleted = isHabitCompletedToday(habit.last_completed_at);
                      const currentStreakVal = habit.current_streak || 0;
                      const nextCoinReward = Math.min(currentStreakVal + 1, MAX_HABIT_DAILY_COINS);

                      return (
                        <div 
                          key={habit.id}
                          className={`rounded-xl border transition-all flex items-center justify-between p-3 gap-3 ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-[#140c06]/80 to-[#0c0603]/80 border-stone-800/80 opacity-75' 
                              : 'bg-gradient-to-r from-[#241409]/90 via-[#1b0d05]/90 to-[#140a04]/90 border-amber-700/60 hover:border-amber-400 hover:shadow-[0_0_18px_rgba(245,180,40,0.25)] hover:scale-[1.006]'
                          }`}
                        >
                          {/* Main Clickable Habit Row as Semantic <button> */}
                          <button
                            type="button"
                            onClick={() => !isCompleted && onCompleteHabit?.(habit.id)}
                            disabled={isCompleted}
                            aria-disabled={isCompleted}
                            className={`flex-1 text-left flex items-center justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg p-1 transition-all ${
                              isCompleted ? 'cursor-not-allowed' : 'cursor-pointer group'
                            }`}
                            aria-label={
                              isCompleted 
                                ? `${habit.title}, ${habit.category}, sealed for today with streak of ${currentStreakVal} days` 
                                : `Fortify habit ${habit.title}, ${habit.category}, earn ${nextCoinReward} gold coins`
                            }
                          >
                            {/* Left: Category Icon & Details */}
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                                isCompleted 
                                  ? 'bg-stone-900 border-stone-800 text-stone-500' 
                                  : `${catTheme.bg} ${catTheme.border} ${catTheme.text} ${catTheme.shadow} group-hover:scale-105 transition-transform`
                              }`}>
                                <IconComponent className="w-5 h-5" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className={`font-garamond font-bold text-sm sm:text-base truncate ${
                                    isCompleted ? 'text-stone-400 line-through' : 'text-parchment-100 group-hover:text-amber-200'
                                  }`}>
                                    {habit.title}
                                  </h4>
                                  <span className="text-[10px] font-cinzel uppercase px-2 py-0.5 rounded-full bg-black/60 border border-amber-600/40 text-amber-300/90 tracking-wider shrink-0">
                                    {habit.category}
                                  </span>
                                </div>
                                <div className="text-xs font-newsreader text-stone-400 flex items-center gap-1.5 mt-0.5">
                                  <span>Streak:</span>
                                  <span className="font-bold text-amber-300 font-cinzel text-[11px] flex items-center gap-0.5">
                                    🔥 {currentStreakVal} {currentStreakVal === 1 ? 'Day' : 'Days'}
                                  </span>
                                  {habit.longest_streak > currentStreakVal && (
                                    <span className="text-amber-500/70 text-[10px] font-cinzel">(Best: {habit.longest_streak})</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Center/Right: Action Seal / Status Badge */}
                            <div className="shrink-0 flex items-center space-x-2">
                              {isCompleted ? (
                                /* Sealed for Today Wax Stamp */
                                <div className="px-3.5 py-1.5 rounded-lg bg-stone-950/90 border border-emerald-700/60 flex items-center gap-1.5 text-emerald-300 text-xs font-cinzel shadow-inner">
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Sealed Today</span>
                                </div>
                              ) : (
                                /* Active Fortify Seal */
                                <div className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-500 text-stone-950 text-xs font-cinzel font-black border border-yellow-200 shadow-[0_0_15px_rgba(245,180,40,0.6)] group-hover:scale-105 transition-transform flex items-center gap-1.5">
                                  <span>🪙</span>
                                  <span>+{nextCoinReward} GP</span>
                                </div>
                              )}
                            </div>
                          </button>

                          {/* Banish Habit Action */}
                          {onDeleteHabit && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteHabit(habit.id);
                              }}
                              className="p-2 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-all focus:outline-none focus:ring-1 focus:ring-rose-400 cursor-pointer shrink-0"
                              aria-label={`Banish habit ${habit.title}`}
                              title="Banish habit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* Bottom Relic Plaque: Habits Summary */}
              <div className="carved-plaque p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 shadow mt-2">
                <div className="flex items-center space-x-2.5">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-cinzel font-bold text-amber-200">
                      Guild Discipline Standings
                    </div>
                    <div className="text-[11px] text-amber-400/70 font-cinzel">
                      {habits.filter(h => isHabitCompletedToday(h.last_completed_at)).length} of {habits.length} disciplines sealed today
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-cinzel text-amber-300/80">
                    Current Vault Wealth:
                  </span>
                  <span className="bg-amber-900/60 border border-amber-600/50 px-2.5 py-0.5 rounded text-xs font-cinzel font-bold text-amber-200 flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-400" />
                    <span>{profile?.coin_balance ?? 0} GP</span>
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* 6. Floating Action Wax-Seal Button (Fixed Bottom-Right) */}
      <div className="fixed bottom-20 sm:bottom-8 right-6 sm:right-10 z-30">
        <button
          type="button"
          onClick={() => onOpenAddChallenge(viewMode === 'tasks' ? 'task' : 'habit')}
          className="wax-seal rounded-full px-5 py-3 border-2 border-amber-400 shadow-2xl flex items-center space-x-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300 active:scale-95 transition-transform"
          aria-label={viewMode === 'tasks' ? 'Add a new quest' : 'Inscribe a new daily habit'}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-700 border border-yellow-100 flex items-center justify-center font-bold text-amber-950 text-base shadow-inner">
            +
          </div>
          <span className="font-cinzel text-xs sm:text-sm font-bold text-[#faecd1] tracking-wider drop-shadow">
            {viewMode === 'tasks' ? 'Add Quest' : 'Forge Habit'}
          </span>
        </button>
      </div>

    </div>
  );
}
