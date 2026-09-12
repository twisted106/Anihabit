/**
 * @file TaskBoard.jsx
 * @description Renders categorized one-off task lists with rolling 24h countdowns and all-clear bonuses.
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Clock, 
  Plus, 
  CheckCheck, 
  Sparkles,
  AlertTriangle,
  FolderKanban
} from 'lucide-react';
import { CATEGORIES, DIFFICULTY_CONFIG } from '../constants/gameConfig';

function TaskTimer({ deadlineAt }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const end = new Date(deadlineAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        setIsOverdue(true);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${mins}m left`);
        setIsOverdue(false);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [deadlineAt]);

  return (
    <span className={`text-[11px] font-mono flex items-center gap-1 ${isOverdue ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
      <Clock className="w-3 h-3 shrink-0" />
      <span>{timeLeft}</span>
    </span>
  );
}

export default function TaskBoard({
  tasks,
  onCompleteTask,
  onDeleteTask,
  onOpenCreateModal
}) {
  const [activeTab, setActiveTab] = useState('All'); // 'All' or specific category

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'All') return true;
    return t.category === activeTab;
  });

  const activeCount = tasks.filter((t) => !t.is_completed).length;

  return (
    <section aria-label="Quest Matrix Board" className="rpg-panel p-5 sm:p-6 border-indigo-500/20 shadow-xl space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-400" />
            <h2 className="font-fantasy text-lg sm:text-xl font-bold text-white tracking-wide">
              Quest Matrix (One-Off Tasks)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Clear all tasks in a category to earn difficulty-scaled completion bonuses
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="rpg-btn flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow-intellect transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Quest</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-rpg-border text-xs scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('All')}
          className={`rpg-btn px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'All'
              ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          All Realms ({tasks.length})
        </button>
        {Object.entries(CATEGORIES).map(([catKey, cat]) => {
          const count = tasks.filter((t) => t.category === catKey && !t.is_completed).length;
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => setActiveTab(catKey)}
              className={`rpg-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === catKey
                  ? `${cat.badgeClass} font-bold ring-1 ring-indigo-500/50 shadow`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{cat.arenaBoss.emoji}</span>
              <span>{cat.name}</span>
              {count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-rpg-border bg-rpg-dark/40">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No active quests in this realm</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tasks only penalize your attributes if inscribed and expired. Having zero registered tasks carries no penalty!
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="rpg-btn mt-4 px-4 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold"
          >
            Inscribe First Quest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTasks.map((task) => {
            const cat = CATEGORIES[task.category] || CATEGORIES.Academics;
            const diff = DIFFICULTY_CONFIG[task.difficulty] || DIFFICULTY_CONFIG.Medium;

            return (
              <div
                key={task.id}
                className={`rpg-card p-4 flex flex-col justify-between gap-3 transition-all ${
                  task.is_completed 
                    ? 'opacity-60 bg-rpg-dark/80 border-emerald-900/30' 
                    : 'hover:border-indigo-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${cat.badgeClass}`}>
                      {cat.name} • {cat.statLabel}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${diff.badgeClass}`}>
                      {diff.label} (+{diff.xp} XP)
                    </span>
                  </div>

                  <h3 className={`text-sm font-semibold text-slate-100 ${task.is_completed ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-rpg-border/60">
                  {task.is_completed ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCheck className="w-4 h-4" />
                      <span>Conquered</span>
                    </span>
                  ) : (
                    <TaskTimer deadlineAt={task.deadline_at} />
                  )}

                  <div className="flex items-center gap-1.5">
                    {!task.is_completed && (
                      <button
                        type="button"
                        onClick={() => onCompleteTask(task.id)}
                        aria-label={`Complete quest: ${task.title}`}
                        className="rpg-btn flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold shadow-glow-discipline/40"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Complete</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      aria-label={`Delete quest: ${task.title}`}
                      className="rpg-btn p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
