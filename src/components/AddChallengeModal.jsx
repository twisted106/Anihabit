import React, { useState } from 'react';
import { X, BookOpen, Dumbbell, Sparkles, Flame, ArrowLeft, Scroll, Coins, Shield } from 'lucide-react';
import { DIFFICULTY_CONFIG, CATEGORIES } from '../constants/gameConfig';

/**
 * SCREEN 4 — Add Challenge Flow (3 Steps)
 * Step 1: Challenge Type (Task / 24h Rolling Quest vs. Habit / Daily Recurring Discipline)
 * Step 2: 2x2 grid of category cards (Academics, Fitness, Lifestyle, Other)
 * Step 3:
 *   - If Task: Title input + 3 difficulty chips (Easy/Medium/Hard) + wax-seal submit button
 *   - If Habit: Title input + skips difficulty chips entirely + streak/coin reward preview + wax-seal submit button
 */

const CATEGORY_ITEMS = [
  {
    key: 'Academics',
    name: 'Academics',
    stat: 'Intellect',
    icon: BookOpen,
    desc: 'Reading, coding, studying, mental trials',
    color: 'text-indigo-400',
    border: 'border-indigo-700/60'
  },
  {
    key: 'Fitness',
    name: 'Fitness',
    stat: 'Strength',
    icon: Dumbbell,
    desc: 'Workouts, runs, hydration, conditioning',
    color: 'text-rose-400',
    border: 'border-rose-700/60'
  },
  {
    key: 'Lifestyle',
    name: 'Lifestyle',
    stat: 'Discipline',
    icon: Sparkles,
    desc: 'Sleep hygiene, tidying, daily routines',
    color: 'text-emerald-400',
    border: 'border-emerald-700/60'
  },
  {
    key: 'Other',
    name: 'Other',
    stat: 'Willpower',
    icon: Flame,
    desc: 'Difficult chores, deep focus, budget review',
    color: 'text-purple-400',
    border: 'border-purple-700/60'
  }
];

export default function AddChallengeModal({
  isOpen,
  onClose,
  onCreateTask,
  onCreateHabit
}) {
  const [step, setStep] = useState(1);
  const [challengeType, setChallengeType] = useState('task'); // 'task' | 'habit'
  const [selectedCategory, setSelectedCategory] = useState('Fitness');
  const [title, setTitle] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTypeSelect = (type) => {
    setChallengeType(type);
    setStep(2);
  };

  const handleCategorySelect = (catKey) => {
    setSelectedCategory(catKey);
    setStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg(challengeType === 'task' ? 'Please enter a quest objective.' : 'Please enter a daily habit title.');
      return;
    }

    if (challengeType === 'task') {
      onCreateTask?.({
        title: title.trim(),
        category: selectedCategory,
        difficulty: selectedDifficulty
      });
    } else {
      onCreateHabit?.({
        title: title.trim(),
        category: selectedCategory
      });
    }

    // Reset state & close
    setTitle('');
    setSelectedDifficulty('Medium');
    setStep(1);
    setErrorMsg('');
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    setErrorMsg('');
    onClose();
  };

  const activeDiff = DIFFICULTY_CONFIG[selectedDifficulty] || DIFFICULTY_CONFIG.Medium;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-challenge-title"
    >
      <div className="guardian-card-frame w-full max-w-lg p-4 sm:p-6 bg-wood-planks border-4 border-[#201308] relative">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-900 border border-amber-600/60 text-amber-300 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="guardian-dark-inset rounded-lg py-2 px-3 text-center mb-4">
          <h2 id="add-challenge-title" className="font-cinzel font-black text-base sm:text-lg text-[#faecd1] uppercase tracking-wider drop-shadow">
            {step === 1 && 'Step 1: Select Challenge Archetype'}
            {step === 2 && `Step 2: Choose ${challengeType === 'task' ? 'Quest' : 'Habit'} Domain`}
            {step === 3 && (challengeType === 'task' ? `Step 3: Forge ${selectedCategory} Quest` : `Step 3: Inscribe ${selectedCategory} Daily Discipline`)}
          </h2>
          <p className="text-[11px] font-newsreader text-amber-400/80 italic">
            {step === 1 && 'Decide between a one-off quest or an ongoing daily ritual'}
            {step === 2 && 'Select which core attribute realm this endeavor will fortify'}
            {step === 3 && (challengeType === 'task' ? 'Balance challenge difficulty against potential glory and peril' : 'Habits yield escalating gold coin tributes for consecutive streaks')}
          </p>
        </div>

        {/* STEP 1: Choose Challenge Type (Task vs Habit) */}
        {step === 1 && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Option A: One-off Quest (Task) */}
              <button
                type="button"
                onClick={() => handleTypeSelect('task')}
                className="p-4 rounded-xl text-left border-2 border-amber-600/70 bg-wood-900/90 hover:bg-wood-850 hover:border-amber-400 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="p-2 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-600/40">
                      <Scroll className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-cinzel font-bold text-amber-300 uppercase px-2 py-0.5 rounded bg-amber-950 border border-amber-700/50">
                      24h Deadline
                    </span>
                  </div>

                  <h3 className="font-cinzel font-bold text-base text-parchment-100 group-hover:text-amber-300 transition-colors">
                    One-off Quest (Task)
                  </h3>
                  <p className="text-xs font-newsreader text-stone-300 mt-1.5 leading-relaxed">
                    A singular objective with a 24-hour rolling timer. Conquering it earns direct XP and Attribute stats; letting it expire imposes stat loss and +15% Reincarnation Pressure.
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-amber-900/50 flex items-center justify-between text-[11px] font-cinzel text-amber-400/90">
                  <span>Earns XP & Stats</span>
                  <span>Select →</span>
                </div>
              </button>

              {/* Option B: Daily Recurring Discipline (Habit) */}
              <button
                type="button"
                onClick={() => handleTypeSelect('habit')}
                className="p-4 rounded-xl text-left border-2 border-emerald-600/70 bg-wood-900/90 hover:bg-wood-850 hover:border-emerald-400 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-600/40">
                      <Flame className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-cinzel font-bold text-emerald-300 uppercase px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/50">
                      Daily Streak
                    </span>
                  </div>

                  <h3 className="font-cinzel font-bold text-base text-parchment-100 group-hover:text-emerald-300 transition-colors">
                    Daily Discipline (Habit)
                  </h3>
                  <p className="text-xs font-newsreader text-stone-300 mt-1.5 leading-relaxed">
                    A recurring daily ritual. Serves as the <span className="text-amber-300 font-semibold">sole source of Gold Coins</span> in the realm (Day 1 = 1 GP ... up to 10 GP max). Safe from expiration pressure.
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] font-cinzel text-emerald-400/90">
                  <span>Sole Source of Coins</span>
                  <span>Select →</span>
                </div>
              </button>

            </div>
          </div>
        )}

        {/* STEP 2: 2x2 Grid of Category Cards */}
        {step === 2 && (
          <div className="space-y-3">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-cinzel text-amber-400/80 hover:text-amber-200 flex items-center gap-1 focus:outline-none cursor-pointer mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Archetype</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              {CATEGORY_ITEMS.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => handleCategorySelect(cat.key)}
                    className={`p-3.5 rounded-xl text-left border-2 transition-all group bg-wood-900/90 hover:bg-wood-850 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer ${cat.border}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-black/50 ${cat.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-cinzel font-bold text-amber-300/80 uppercase">
                        + {cat.stat}
                      </span>
                    </div>

                    <h3 className="font-garamond font-bold text-base text-parchment-200 group-hover:text-amber-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] font-newsreader text-stone-400 mt-1 leading-snug">
                      {cat.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Form Configuration (Different for Task vs Habit) */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs font-cinzel text-amber-400/80 hover:text-amber-200 flex items-center gap-1 focus:outline-none cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Domains</span>
            </button>

            {/* Error banner */}
            {errorMsg && (
              <div className="p-2 rounded bg-red-950/80 border border-red-600/60 text-red-200 text-xs font-cinzel">
                {errorMsg}
              </div>
            )}

            {/* Title Input */}
            <div>
              <label 
                htmlFor="challenge-title-input"
                className="block text-xs font-cinzel font-bold text-amber-200 uppercase tracking-wider mb-1"
              >
                {challengeType === 'task' ? 'Quest Title / Objective' : 'Daily Habit Title / Discipline'}
              </label>
              <input 
                id="challenge-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={challengeType === 'task' ? 'e.g. Slay 50 Pushups / Study Algorithms...' : 'e.g. Read 20 pages daily, 3L Water, 8h Sleep...'}
                className="w-full px-3 py-2.5 bg-wood-950/90 border-2 border-amber-800/80 rounded-lg text-sm text-parchment-100 placeholder-stone-500 font-garamond focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* If TASK: Difficulty Chips (Easy / Medium / Hard) */}
            {challengeType === 'task' ? (
              <>
                <div>
                  <label className="block text-xs font-cinzel font-bold text-amber-200 uppercase tracking-wider mb-1.5">
                    Difficulty Level (Scales Reward & Penalty)
                  </label>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Difficulty Level">
                    {['Easy', 'Medium', 'Hard'].map((diffKey) => {
                      const cfg = DIFFICULTY_CONFIG[diffKey];
                      const isSelected = selectedDifficulty === diffKey;

                      return (
                        <button
                          key={diffKey}
                          type="button"
                          onClick={() => setSelectedDifficulty(diffKey)}
                          className={`py-2 px-2 rounded-lg border-2 text-center transition-all focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-950 border-amber-400 text-amber-200 shadow-md font-bold' 
                              : 'bg-wood-900 border-stone-800 text-stone-400 hover:border-amber-800'
                          }`}
                          role="radio"
                          aria-checked={isSelected}
                        >
                          <div className="font-cinzel text-xs font-bold">{diffKey}</div>
                          <div className="text-[10px] font-newsreader mt-0.5 text-stone-300">
                            +{cfg.xp} XP / -{cfg.penalty} {selectedCategory.slice(0, 3)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reward Preview Summary for Tasks */}
                <div className="parchment-surface p-3 rounded-lg text-amber-950 text-xs space-y-1 shadow-inner">
                  <div className="font-cinzel font-bold text-[11px] flex justify-between">
                    <span>Reward upon completion:</span>
                    <span className="text-emerald-900 font-black">+{activeDiff.xp} XP · +{activeDiff.stat} {selectedCategory}</span>
                  </div>
                  <div className="font-cinzel text-[11px] flex justify-between text-red-950">
                    <span>Penalty if 24h expires unfinished:</span>
                    <span className="font-bold">-{activeDiff.penalty} {selectedCategory} · +15% Pressure</span>
                  </div>
                </div>

                {/* Wax-Seal Submit Button for Tasks */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full wax-seal py-3 px-4 rounded-xl border-2 border-amber-400 shadow-2xl font-cinzel font-bold text-sm text-[#faecd1] tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300 active:scale-98 transition-transform"
                  >
                    <span className="text-amber-300 font-black">✦</span>
                    <span>Inscribe Quest in Tome</span>
                    <span className="text-amber-300 font-black">✦</span>
                  </button>
                </div>
              </>
            ) : (
              /* If HABIT: Skips difficulty chips entirely */
              <>
                {/* Habit Economy Preview */}
                <div className="parchment-surface p-3.5 rounded-lg text-amber-950 text-xs space-y-2 shadow-inner border border-amber-900/40">
                  <div className="flex items-center gap-2 border-b border-amber-900/30 pb-1.5">
                    <Coins className="w-4 h-4 text-amber-800" />
                    <span className="font-cinzel font-bold text-xs uppercase text-amber-950">
                      Guild Coin Tribute Rules
                    </span>
                  </div>
                  <p className="font-newsreader text-[12px] text-amber-950/90 leading-relaxed">
                    Habits have no difficulty tiers. Each daily check-in advances your consecutive streak and deposits <span className="font-bold text-amber-900">1 to 10 Gold Coins</span> into your vault (<span className="italic">Day 1 = 1 GP, Day 2 = 2 GP ... capped at 10 GP daily</span>).
                  </p>
                  <div className="font-cinzel text-[11px] font-bold text-emerald-950 flex items-center justify-between pt-1">
                    <span>Domain Benefit:</span>
                    <span>Fortifies {selectedCategory} Resilience</span>
                  </div>
                </div>

                {/* Wax-Seal Submit Button for Habits */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full wax-seal py-3 px-4 rounded-xl border-2 border-emerald-400 shadow-2xl font-cinzel font-bold text-sm text-[#faecd1] tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300 active:scale-98 transition-transform"
                  >
                    <span className="text-amber-300 font-black">✦</span>
                    <span>Forge Daily Discipline</span>
                    <span className="text-amber-300 font-black">✦</span>
                  </button>
                </div>
              </>
            )}

          </form>
        )}

      </div>
    </div>
  );
}
