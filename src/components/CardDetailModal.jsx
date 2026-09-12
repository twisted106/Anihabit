import React from 'react';
import { X, CheckCircle2, Circle, Clock, Award, AlertCircle } from 'lucide-react';
import { DIFFICULTY_CONFIG } from '../constants/gameConfig';

/**
 * SCREEN 3 — Card Expanded / Detail Modal (Tap any card)
 * - Enlarged Card View
 * - If Enemy Card: Scrollable task list below.
 *   - Checkbox toggle on left (mark complete)
 *   - Task name in middle
 *   - Two stacked badges on right: Reward (XP / stat) & Penalty (Stat lost if expired in 24h)
 * - Returns to Screen 2 on close
 */
export default function CardDetailModal({
  card,
  tasks = [],
  onClose,
  onCompleteTask
}) {
  if (!card) return null;

  const isEnemy = card.type === 'enemy';
  const categoryTasks = isEnemy ? tasks.filter(t => t.category === card.category) : [];
  const activeTasks = categoryTasks.filter(t => !t.is_completed);
  const completedTasks = categoryTasks.filter(t => t.is_completed);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-modal-title"
    >
      <div className="guardian-card-frame w-full max-w-2xl max-h-[90vh] flex flex-col p-3 sm:p-5 relative overflow-hidden bg-wood-planks border-4 border-[#201308]">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-40 p-1.5 rounded-full bg-stone-900/90 border border-amber-500/60 text-amber-200 hover:text-white hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Close Card Inspection"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Entity Name & Category Badge */}
        <div className="guardian-dark-inset rounded-lg py-2 px-4 text-center mb-3">
          <div className="flex items-center justify-center gap-2">
            <h2 id="card-modal-title" className="font-garamond font-bold text-xl sm:text-2xl text-[#faecd1] tracking-wide drop-shadow">
              {card.name}
            </h2>
            {card.category && (
              <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/60 text-[10px] font-cinzel text-amber-300 uppercase tracking-wider">
                {card.category}
              </span>
            )}
          </div>
          <p className="text-[11px] font-newsreader text-amber-400/80 italic mt-0.5">
            {isEnemy ? `Guardian of the ${card.category} Domain` : 'Champion of the Tabletop Realm'}
          </p>
        </div>

        {/* Art Panel */}
        <div className="relative w-full h-48 sm:h-64 rounded-md overflow-hidden border-2 border-[#523712] bg-stone-950 flex-shrink-0 mb-3 shadow-inner">
          <img 
            src={card.imageSrc || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'} 
            alt={card.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100b06]/90 via-transparent to-transparent pointer-events-none" />
          
          {/* Active Challenges Count */}
          {isEnemy && (
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/80 border border-amber-500/60 text-xs font-cinzel text-amber-300">
              {activeTasks.length} Active Challenges Pending
            </div>
          )}
        </div>

        {/* If Enemy Card: Scrollable Task List Below */}
        {isEnemy ? (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-1.5 mb-2 text-xs font-cinzel text-amber-300">
              <span>Domain Tasks ({activeTasks.length} Pending)</span>
              <span className="text-[10px] text-stone-400">24-Hour Rolling Deadlines</span>
            </div>

            {categoryTasks.length === 0 ? (
              <div className="parchment-surface p-4 rounded text-center my-4">
                <p className="font-cinzel text-xs font-bold text-amber-950">
                  No active challenges registered for {card.category}!
                </p>
                <p className="text-[11px] font-newsreader text-amber-900/80 mt-1">
                  Use the "+ Add Challenge" button to summon a new task for this domain.
                </p>
              </div>
            ) : (
              categoryTasks.map((task) => {
                const diff = DIFFICULTY_CONFIG[task.difficulty] || DIFFICULTY_CONFIG.Medium;
                const isCompleted = task.is_completed;

                return (
                  <div 
                    key={task.id}
                    className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                      isCompleted 
                        ? 'bg-stone-950/60 border-stone-800 opacity-60'
                        : 'bg-wood-900/90 border-amber-900/60 hover:border-amber-500/60 shadow'
                    }`}
                  >
                    {/* Left: Checkbox Toggle */}
                    <button
                      type="button"
                      onClick={() => !isCompleted && onCompleteTask(task.id)}
                      disabled={isCompleted}
                      className="p-1 rounded text-amber-400 hover:text-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                      title={isCompleted ? 'Task completed' : 'Mark task completed'}
                      aria-label={`Mark task ${task.title} as completed`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-amber-400/80 hover:text-amber-200" />
                      )}
                    </button>

                    {/* Middle: Task Name & Category Tag */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs sm:text-sm font-garamond font-bold truncate ${
                        isCompleted ? 'line-through text-stone-400' : 'text-parchment-200'
                      }`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-400 font-cinzel">
                        <span className="text-amber-300/90 font-semibold">{task.difficulty}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 text-stone-400">
                          <Clock className="w-3 h-3 text-stone-500 inline" />
                          24h rolling timer
                        </span>
                      </div>
                    </div>

                    {/* Right: Two Stacked Badges (Reward & Penalty) */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {/* Reward Badge */}
                      <span className="px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/50 text-[10px] font-cinzel font-bold text-emerald-300">
                        +{diff.xp} XP · +{diff.stat} {card.category.slice(0, 3)}
                      </span>
                      {/* Penalty Badge */}
                      <span className="px-2 py-0.5 rounded bg-red-950/90 border border-red-600/50 text-[10px] font-cinzel font-bold text-red-300">
                        -{diff.penalty} {card.category.slice(0, 3)} if expired
                      </span>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* If Player Card: Full Stat & Trait Summary */
          <div className="flex-1 overflow-y-auto space-y-3">
            <div className="parchment-surface p-3 rounded text-amber-950 text-xs font-newsreader">
              <strong>Tabletop Champion:</strong> Your level, core stats, and habit streaks protect the tavern from the growing Reincarnation pressure. Completing tasks empowers your stats, while missed deadlines push the realm closer to crisis.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
