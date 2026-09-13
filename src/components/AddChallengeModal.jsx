import React, { useState, useEffect } from 'react';
import { X, BookOpen, Dumbbell, Sparkles, Flame, ArrowLeft, Coins } from 'lucide-react';
import { DIFFICULTY_CONFIG } from '../constants/gameConfig';

/**
 * SCREEN 4 — Add Challenge Flow (Scoped by Active View Tab)
 * Tab-scoped 2-step flow:
 * Step 1: Choose Domain (Academics, Fitness, Lifestyle, Other)
 * Step 2:
 *   - If Task: Title input + 3 difficulty chips (Easy/Medium/Hard) + Reward/Penalty Preview + wax-seal submit button
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
  targetType = 'task', // 'task' | 'habit'
  onCreateTask,
  onCreateHabit
}) {
  const [step, setStep] = useState(1);
  const [challengeType, setChallengeType] = useState(targetType);
  const [selectedCategory, setSelectedCategory] = useState('Fitness');
  const [title, setTitle] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [errorMsg, setErrorMsg] = useState('');

  // Reset and synchronize when modal opens or targetType changes
  useEffect(() => {
    if (isOpen) {
      setChallengeType(targetType || 'task');
      setStep(1);
      setTitle('');
      setSelectedDifficulty('Medium');
      setErrorMsg('');
    }
  }, [isOpen, targetType]);

  if (!isOpen) return null;

  const handleCategorySelect = (catKey) => {
    setSelectedCategory(catKey);
    setStep(2);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-challenge-title"
      onClick={handleClose}
    >
      <div 
        className="guardian-card-frame w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-[#211107] via-[#160b05] to-[#0c0502] border-2 border-amber-600/70 shadow-[0_10px_40px_rgba(0,0,0,0.95),0_0_30px_rgba(245,180,40,0.15)] relative rounded-2xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 flex items-center justify-center rounded-full bg-stone-900/90 border border-amber-600/60 text-amber-300 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#170c05] via-[#221208] to-[#170c05] rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-center mb-3 sm:mb-4 border border-amber-700/50 shadow-inner">
          <h2 id="add-challenge-title" className="font-cinzel font-black text-sm sm:text-base md:text-lg text-[#faecd1] uppercase tracking-wider drop-shadow pr-6 sm:pr-0">
            {step === 1 && `Step 1: Choose ${challengeType === 'task' ? 'Quest' : 'Habit'} Domain`}
            {step === 2 && (challengeType === 'task' ? `Step 2: Forge ${selectedCategory} Quest` : `Step 2: Inscribe ${selectedCategory} Daily Discipline`)}
          </h2>
          <p className="text-[10px] sm:text-[11px] font-newsreader text-amber-400/80 italic mt-0.5">
            {step === 1 && 'Select which core attribute realm this endeavor will fortify'}
            {step === 2 && (challengeType === 'task' ? 'Balance challenge difficulty against potential glory and peril' : 'Habits yield escalating gold coin tributes for consecutive streaks')}
          </p>
        </div>

        {/* STEP 1: 2x2 Grid of Category Cards */}
        {step === 1 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {CATEGORY_ITEMS.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => handleCategorySelect(cat.key)}
                    className={`p-2.5 sm:p-3.5 rounded-xl text-left border-2 transition-all group bg-gradient-to-b from-[#221308] to-[#130a04] hover:from-[#2a170a] hover:to-[#1a0c05] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer min-h-[44px] ${cat.border}`}
                  >
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <div className={`p-1.5 sm:p-2 rounded-lg bg-black/60 border border-amber-600/30 ${cat.color}`}>
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-cinzel font-bold text-amber-300/90 uppercase tracking-wider">
                        + {cat.stat}
                      </span>
                    </div>

                    <h3 className="font-garamond font-bold text-sm sm:text-base text-parchment-200 group-hover:text-amber-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] font-newsreader text-stone-400 mt-0.5 sm:mt-1 leading-snug">
                      {cat.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Form Configuration (Different for Task vs Habit) */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-[36px] text-xs font-cinzel text-amber-400/80 hover:text-amber-200 flex items-center gap-1 focus:outline-none cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Domains</span>
            </button>

            {/* Error banner */}
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/90 border border-red-600/70 text-red-200 text-xs font-cinzel">
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
                className="w-full px-3.5 py-2.5 bg-[#120803] border-2 border-amber-800/80 rounded-lg text-sm text-parchment-100 placeholder-stone-500 font-garamond focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* If TASK: Difficulty Chips (Easy / Medium / Hard) */}
            {challengeType === 'task' ? (
              <>
                <div>
                  <label className="block text-xs font-cinzel font-bold text-amber-200 uppercase tracking-wider mb-1.5">
                    Difficulty Level (Scales Reward & Penalty)
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2" role="radiogroup" aria-label="Difficulty Level">
                    {['Easy', 'Medium', 'Hard'].map((diffKey) => {
                      const cfg = DIFFICULTY_CONFIG[diffKey];
                      const isSelected = selectedDifficulty === diffKey;

                      return (
                        <button
                          key={diffKey}
                          type="button"
                          onClick={() => setSelectedDifficulty(diffKey)}
                          className={`py-2 px-1 sm:px-2 rounded-lg border-2 text-center transition-all focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer min-h-[44px] flex flex-col items-center justify-center ${
                            isSelected 
                              ? 'bg-amber-950/90 border-amber-400 text-amber-200 shadow-md font-bold' 
                              : 'bg-[#140a04] border-stone-800 text-stone-400 hover:border-amber-800'
                          }`}
                          role="radio"
                          aria-checked={isSelected}
                        >
                          <div className="font-cinzel text-xs font-bold">{diffKey}</div>
                          <div className="text-[9px] sm:text-[10px] font-newsreader mt-0.5 text-stone-300">
                            +{cfg.xp} XP / -{cfg.penalty} {selectedCategory.slice(0, 3)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reward Preview Summary for Tasks */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-[#1b0e06] to-[#120703] border border-amber-600/50 text-amber-100 text-xs space-y-2 shadow-inner">
                  <div className="font-cinzel font-bold text-[10px] sm:text-[11px] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-1">
                    <span className="text-stone-300">Reward upon completion:</span>
                    <span className="text-emerald-400 font-bold">+{activeDiff.xp} XP · +{activeDiff.stat} {selectedCategory} · -{activeDiff.pressureRelief || 1} Pressure</span>
                  </div>
                  <div className="font-cinzel text-[10px] sm:text-[11px] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-1">
                    <span className="text-stone-300">Penalty if 24h expires:</span>
                    <span className="text-rose-400 font-bold">-{activeDiff.penalty} {selectedCategory} · +{activeDiff.pressureFail || 8} Pressure</span>
                  </div>
                </div>

                {/* Wax-Seal Submit Button for Tasks */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full min-h-[44px] py-2.5 sm:py-3 px-4 rounded-xl border border-yellow-200 shadow-[0_0_20px_rgba(245,180,40,0.5)] font-cinzel font-black text-xs sm:text-sm text-stone-950 tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300 active:scale-98 transition-transform bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-500"
                  >
                    <span className="text-amber-950 font-black">✦</span>
                    <span>Inscribe Quest in Tome</span>
                    <span className="text-amber-950 font-black">✦</span>
                  </button>
                </div>
              </>
            ) : (
              /* If HABIT: Skips difficulty chips entirely */
              <>
                {/* Habit Economy Preview */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#17201a] to-[#0c1410] border border-emerald-600/50 text-emerald-100 text-xs space-y-2 shadow-inner">
                  <div className="flex items-center gap-2 border-b border-emerald-700/40 pb-1.5">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span className="font-cinzel font-bold text-xs uppercase text-emerald-300">
                      Guild Coin Tribute Rules
                    </span>
                  </div>
                  <p className="font-newsreader text-[12px] text-emerald-100/90 leading-relaxed">
                    Habits have no difficulty tiers. Each daily check-in advances your consecutive streak and deposits <span className="font-bold text-amber-300">1 to 10 Gold Coins</span> into your vault (<span className="italic">Day 1 = 1 GP, Day 2 = 2 GP ... capped at 10 GP daily</span>).
                  </p>
                  <div className="font-cinzel text-[11px] font-bold text-emerald-300 flex items-center justify-between pt-1">
                    <span>Domain Benefit:</span>
                    <span>Fortifies {selectedCategory} Resilience</span>
                  </div>
                </div>

                {/* Wax-Seal Submit Button for Habits */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full min-h-[44px] py-2.5 sm:py-3 px-4 rounded-xl border border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.5)] font-cinzel font-black text-xs sm:text-sm text-stone-950 tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300 active:scale-98 transition-transform bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:from-emerald-400 hover:via-teal-300 hover:to-emerald-500"
                  >
                    <span className="text-stone-950 font-black">✦</span>
                    <span>Forge Daily Discipline</span>
                    <span className="text-stone-950 font-black">✦</span>
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
