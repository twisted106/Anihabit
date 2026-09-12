import React, { useState } from 'react';
import { X, BookOpen, Dumbbell, Sparkles, Flame, ArrowLeft, Check, Shield } from 'lucide-react';
import { DIFFICULTY_CONFIG, CATEGORIES } from '../constants/gameConfig';

/**
 * SCREEN 4 — Add Challenge Flow (2 Steps)
 * Step 1: 2x2 grid of category cards (Academics, Fitness, Lifestyle, Other)
 * Step 2: Form with text input for task name + 3 difficulty chips (Easy/Medium/Hard) + wax-seal submit button
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
  onCreateTask
}) {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Fitness');
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [isHabit, setIsHabit] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCategorySelect = (catKey) => {
    setSelectedCategory(catKey);
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setErrorMsg('Please enter a challenge or habit name.');
      return;
    }

    onCreateTask({
      title: taskTitle.trim(),
      category: selectedCategory,
      difficulty: selectedDifficulty
    });

    // Reset state & close
    setTaskTitle('');
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
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-900 border border-amber-600/60 text-amber-300 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="guardian-dark-inset rounded-lg py-2 px-3 text-center mb-4">
          <h2 id="add-challenge-title" className="font-cinzel font-black text-base sm:text-lg text-[#faecd1] uppercase tracking-wider drop-shadow">
            {step === 1 ? 'Step 1: Choose Domain' : `Step 2: Forge ${selectedCategory} Challenge`}
          </h2>
          <p className="text-[11px] font-newsreader text-amber-400/80 italic">
            {step === 1 ? 'Select which attribute realm this challenge will forge' : 'Set the difficulty to balance reward against penalty'}
          </p>
        </div>

        {/* STEP 1: 2x2 Grid of Category Cards */}
        {step === 1 && (
          <div className="space-y-4">
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

        {/* STEP 2: Form with Text Input, 3 Difficulty Chips, Wax-Seal Submit */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-cinzel text-amber-400/80 hover:text-amber-200 flex items-center gap-1 focus:outline-none"
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

            {/* Challenge Name Input */}
            <div>
              <label 
                htmlFor="challenge-title-input"
                className="block text-xs font-cinzel font-bold text-amber-200 uppercase tracking-wider mb-1"
              >
                Challenge Title / Objective
              </label>
              <input 
                id="challenge-title-input"
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. 45-minute Strength Session, Finish Chapter 4..."
                className="w-full px-3 py-2.5 bg-wood-950/90 border-2 border-amber-800/80 rounded-lg text-sm text-parchment-100 placeholder-stone-500 font-garamond focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* 3 Difficulty Chips: Easy / Medium / Hard */}
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
                      className={`py-2 px-2 rounded-lg border-2 text-center transition-all focus:outline-none focus:ring-1 focus:ring-amber-400 ${
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

            {/* Reward Preview Summary */}
            <div className="parchment-surface p-3 rounded-lg text-amber-950 text-xs space-y-1 shadow-inner">
              <div className="font-cinzel font-bold text-[11px] flex justify-between">
                <span>Reward upon completion:</span>
                <span className="text-emerald-900 font-black">+{activeDiff.xp} XP · +{activeDiff.stat} {selectedCategory}</span>
              </div>
              <div className="font-cinzel text-[11px] flex justify-between text-red-950">
                <span>Penalty if 24h expires unfinished:</span>
                <span className="font-bold">-{activeDiff.penalty} {selectedCategory}</span>
              </div>
            </div>

            {/* Wax-Seal Embossed Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full wax-seal py-3 px-4 rounded-xl border-2 border-amber-400 shadow-2xl font-cinzel font-bold text-sm text-[#faecd1] tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <span className="text-amber-300 font-black">✦</span>
                <span>Inscribe Challenge in Tome</span>
                <span className="text-amber-300 font-black">✦</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
