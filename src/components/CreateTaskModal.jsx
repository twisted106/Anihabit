/**
 * @file CreateTaskModal.jsx
 * @description Modal form for creating one-off tasks with category and difficulty scaling.
 */

import React, { useState } from 'react';
import { X, PlusCircle, Sparkles, BookOpen, Dumbbell, Zap, HeartHandshake } from 'lucide-react';
import { CATEGORIES, DIFFICULTY_CONFIG } from '../constants/gameConfig';

export default function CreateTaskModal({ isOpen, onClose, onCreateTask }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academics');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const success = await onCreateTask({ title, category, difficulty });
    setIsSubmitting(false);

    if (success) {
      setTitle('');
      setCategory('Academics');
      setDifficulty('Medium');
      onClose();
    }
  };

  const selectedDiff = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.Medium;
  const selectedCat = CATEGORIES[category] || CATEGORIES.Academics;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-title"
    >
      <div className="rpg-panel max-w-lg w-full p-6 sm:p-7 relative border-indigo-500/40 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close task creation form"
          className="rpg-btn absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-glow-intellect">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="create-task-title" className="font-fantasy text-xl font-bold text-white tracking-wide">
              Register New Quest
            </h2>
            <p className="text-xs text-slate-400">
              One-off real-world challenge with a rolling 24-hour deadline
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <label htmlFor="task-title-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Quest Objective / Title *
            </label>
            <input
              id="task-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Solve 3 LeetCode problems, 30 min deadlifts..."
              required
              autoFocus
              className="w-full px-3.5 py-2.5 text-sm bg-rpg-dark border border-rpg-border rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Category &amp; Associated Stat *
              <span className="text-[10px] text-slate-400 font-normal ml-1">(Immutable after creation)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CATEGORIES).map(([catKey, cat]) => (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setCategory(catKey)}
                  className={`rpg-btn p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    category === catKey
                      ? `${cat.badgeClass} ring-1 ring-offset-1 ring-offset-rpg-dark ring-indigo-500 font-bold shadow-md`
                      : 'border-rpg-border bg-rpg-card/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-white">{cat.name}</span>
                    <span className="text-[10px] text-slate-400">+{cat.statLabel}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Difficulty Tier *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(DIFFICULTY_CONFIG).map(([diffKey, diff]) => (
                <button
                  key={diffKey}
                  type="button"
                  onClick={() => setDifficulty(diffKey)}
                  className={`rpg-btn p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                    difficulty === diffKey
                      ? `${diff.badgeClass} ring-1 ring-offset-1 ring-offset-rpg-dark ring-indigo-500 font-bold shadow-md`
                      : 'border-rpg-border bg-rpg-card/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-semibold">{diff.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono">+{diff.xp} XP</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reward & Risk Preview */}
          <div className="p-3 rounded-lg bg-rpg-dark/70 border border-rpg-border text-xs space-y-1 font-mono">
            <div className="flex justify-between text-slate-300">
              <span>On Success:</span>
              <span className="text-emerald-400 font-bold">
                +{selectedDiff.xp} XP, +{selectedDiff.stat} {selectedCat.statLabel}, -{selectedDiff.pressureRelief || 1} Pressure
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>On 24h Expiry:</span>
              <span className="text-rose-400">
                -{selectedDiff.penalty} {selectedCat.statLabel}, +{selectedDiff.pressureFail || 8} Pressure
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rpg-btn px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="rpg-btn px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow-intellect transition-all"
            >
              {isSubmitting ? 'Inscribing...' : 'Inscribe Quest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
