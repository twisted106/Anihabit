import React from 'react';
import TabletopCard from './TabletopCard';
import ReincarnationBar from './ReincarnationBar';
import { calculateXpToNextLevel } from '../constants/gameConfig';

/**
 * SCREEN 2 — Desktop & Mobile Tabletop Game View
 * Faithfully matches Stitch MCP screen f3cd7ea23d3049e5be5c965313716058
 * 
 * Elements:
 * 1. Global Reincarnation Pressure Meter (0-100%, warns +15% per miss, -8% per complete)
 * 2. Ornate Scroll Banner: "Habit / Task"
 * 3. Dark Carved Plaque: "Game View"
 * 4. Desktop Tabletop Grid:
 *    - Left (Span 4): Champion Card (Knight Protector) + Level Progress (XP) Bar + Character Sheet link
 *    - Right (Span 8): Active Category Adversaries header + "+ Summon Challenge" button
 *      Followed by 4 Flat Category Enemy Cards:
 *        1. Red Drake (Fitness / Strength)
 *        2. Crypt Warden (Academics / Intellect)
 *        3. Goblin Scout (Lifestyle / Discipline)
 *        4. Wood Wisp (Other / Willpower)
 *    - Bottom Plaque: Daily Quest Completion summary & Habit Streak
 * 5. Floating Wax-Seal Action Button
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

export default function GameView({
  profile,
  stats,
  tasks,
  habits,
  onInspectCard,
  onOpenAddChallenge,
  onOpenTradeoffModal
}) {
  const level = profile?.current_level || 1;
  const currentXp = Number(profile?.current_xp || 0);
  const xpNeeded = calculateXpToNextLevel(level);
  const xpPercent = Math.min(100, Math.round((currentXp / xpNeeded) * 100));

  // Active tasks count per category
  const getCategoryActiveCount = (category) => {
    return tasks.filter(t => t.category === category && !t.is_completed).length;
  };

  // Completed today summary
  const completedTasksCount = tasks.filter(t => t.is_completed).length;
  const totalTasksCount = tasks.length;
  const currentStreak = profile?.current_streak || 0;

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

      {/* 2. Dark Carved Plaque: "Game View" */}
      <div className="carved-plaque px-8 py-1.5 rounded-md flex items-center justify-center -mt-2">
        <span className="text-amber-300 font-cinzel text-sm sm:text-base font-bold tracking-widest uppercase flex items-center gap-2 drop-shadow">
          <span className="text-amber-500 text-xs">✦</span>
          Game View
          <span className="text-amber-500 text-xs">✦</span>
        </span>
      </div>

      {/* 3. Global Reincarnation Pressure Meter */}
      <ReincarnationBar 
        meterValue={profile?.reincarnation_meter || 0}
        onOpenTradeoffModal={onOpenTradeoffModal}
      />

      {/* 4. Desktop Tabletop Standoff Layout:
          Player Card on Left [Span 4] vs 4 Category Adversaries on Right [Span 8] */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
        
        {/* FAR LEFT: Champion Card (Knight Protector) [lg:col-span-4] */}
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
                className="text-xs font-cinzel text-amber-400/80 hover:text-amber-200 underline decoration-amber-600 inline-flex items-center gap-1 focus:outline-none cursor-pointer"
              >
                <span>View Character Sheet</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Active Category Adversaries [lg:col-span-8] */}
        <div className="lg:col-span-8 flex flex-col" data-purpose="enemy-cards-tabletop">
          
          {/* Section Header with Quick Summon Button */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center space-x-2">
              <span className="text-amber-400 text-sm font-cinzel font-bold uppercase tracking-wider">
                Active Category Adversaries
              </span>
              <span className="bg-amber-950/80 px-2 py-0.5 rounded text-[11px] text-amber-300 font-cinzel border border-amber-700/50">
                4 Categories Active
              </span>
            </div>

            <button 
              type="button"
              onClick={onOpenAddChallenge}
              className="carved-plaque hover:border-amber-400 px-3 py-1 rounded text-xs font-cinzel font-bold text-amber-300 flex items-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
            >
              <span className="text-amber-400 text-sm font-bold">+</span>
              <span>Summon Challenge</span>
            </button>
          </div>

          {/* 4 Cards Grid in a Single Row on Desktop */}
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

          {/* Bottom Tabletop Relic Bar: Daily Quest Completion & Streak */}
          <div className="mt-6 carved-plaque p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 shadow">
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

      </div>

      {/* 5. Floating '+ Add Challenge' Wax-Seal Button (Fixed Bottom-Right) */}
      <div className="fixed bottom-20 sm:bottom-8 right-6 sm:right-10 z-30">
        <button
          type="button"
          onClick={onOpenAddChallenge}
          className="wax-seal rounded-full px-5 py-3 border-2 border-amber-400 shadow-2xl flex items-center space-x-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300 active:scale-95 transition-transform"
          aria-label="Add a new challenge or habit"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-700 border border-yellow-100 flex items-center justify-center font-bold text-amber-950 text-base shadow-inner">
            +
          </div>
          <span className="font-cinzel text-xs sm:text-sm font-bold text-[#faecd1] tracking-wider drop-shadow">
            Add Challenge
          </span>
        </button>
      </div>

    </div>
  );
}
