import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Award, 
  AlertCircle, 
  BookOpen, 
  Dumbbell, 
  Sparkles, 
  Flame, 
  Shield, 
  Check 
} from 'lucide-react';
import { DIFFICULTY_CONFIG, getMostRecentMidnightIST } from '../constants/gameConfig';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const CATEGORY_ICONS = {
  Academics: BookOpen,
  Fitness: Dumbbell,
  Lifestyle: Sparkles,
  Other: Flame
};

const CATEGORY_THEMES = {
  Academics: {
    bg: 'bg-indigo-950/80',
    border: 'border-indigo-600/50',
    text: 'text-indigo-300'
  },
  Fitness: {
    bg: 'bg-rose-950/80',
    border: 'border-rose-600/50',
    text: 'text-rose-300'
  },
  Lifestyle: {
    bg: 'bg-emerald-950/80',
    border: 'border-emerald-600/50',
    text: 'text-emerald-300'
  },
  Other: {
    bg: 'bg-purple-950/80',
    border: 'border-purple-600/50',
    text: 'text-purple-300'
  }
};

const formatTimeIST = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  try {
    return d.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' IST';
  } catch {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
};

/**
 * SCREEN 3 — Card Expanded / Detail Modal (Tap any card)
 * - Enlarged Card View
 * - If Enemy Card:
 *   - Fetches tasks filtered to is_completed = false only upon opening.
 *   - During this open session, completed tasks remain visible with crossed-out styling for immediate visual feedback.
 *   - When closed and reopened, local session state is discarded and only active tasks are fetched.
 * - If Player Card:
 *   - "Task History" section: lists completed tasks (not habits) completed since the most recent midnight IST, newest first.
 *   - Natural midnight-IST filter ensures previous day's completions expire automatically.
 */
export default function CardDetailModal({
  card,
  tasks = [],
  sessionUser = null,
  isDemoMode = true,
  profile = null,
  claimedBossesThisCycle = [],
  currentCycleId,
  onClose,
  onCompleteTask,
  onFailTask,
  onOpenCustomizeProfile
}) {
  const isEnemy = card?.type === 'enemy';
  const isPlayer = card?.type === 'player';

  // Primary source of truth for claimed state in current cycle
  const isBossClaimed = Boolean(
    (claimedBossesThisCycle && card?.category && claimedBossesThisCycle.includes(card.category)) || 
    card?.isBossClaimed
  );

  // Local state for Enemy domain tasks & session-only completed items
  const [domainTasks, setDomainTasks] = useState([]);
  const [sessionCompletedIds, setSessionCompletedIds] = useState(() => new Set());
  
  // Local state for Player Task History
  const [taskHistory, setTaskHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFail = async (taskId) => {
    if (sessionCompletedIds.has(taskId)) return;
    if (onFailTask) {
      await onFailTask(taskId);
      setDomainTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  // Snapshot active tasks or task history on each card modal open
  useEffect(() => {
    if (!card) {
      setDomainTasks([]);
      setSessionCompletedIds(new Set());
      setTaskHistory([]);
      return;
    }

    // Always reset session-completed IDs on fresh modal open
    setSessionCompletedIds(new Set());

    if (card.type === 'enemy') {
      setIsLoading(true);

      const fetchActiveTasks = async () => {
        try {
          if (isSupabaseConfigured && !isDemoMode && sessionUser) {
            const { data, error } = await supabase
              .from('tasks')
              .select('*')
              .eq('user_id', sessionUser.id)
              .eq('category', card.category)
              .eq('is_completed', false)
              .order('created_at', { ascending: false });

            if (!error && data) {
              setDomainTasks(data);
              setIsLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Error fetching active tasks from Supabase:', err);
        }

        // Fallback or demo mode: filter to is_completed = false
        const activeOnly = tasks.filter(t => t.category === card.category && !t.is_completed);
        setDomainTasks(activeOnly);
        setIsLoading(false);
      };

      fetchActiveTasks();

    } else if (card.type === 'player') {
      setIsLoading(true);

      const fetchHistory = async () => {
        const midnightIST = getMostRecentMidnightIST();
        try {
          if (isSupabaseConfigured && !isDemoMode && sessionUser) {
            const { data, error } = await supabase
              .from('tasks')
              .select('*')
              .eq('user_id', sessionUser.id)
              .eq('is_completed', true)
              .gte('completed_at', midnightIST.toISOString())
              .order('completed_at', { ascending: false });

            if (!error && data) {
              setTaskHistory(data);
              setIsLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Error fetching task history from Supabase:', err);
        }

        // Fallback or demo mode: filter tasks completed since midnight IST
        const completedSinceMidnight = tasks
          .filter(t => t.is_completed && t.completed_at && new Date(t.completed_at) >= midnightIST)
          .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));

        setTaskHistory(completedSinceMidnight);
        setIsLoading(false);
      };

      fetchHistory();
    }
  }, [card?.type, card?.category, card?.name, isDemoMode, sessionUser]);

  if (!card) return null;

  // Pending count in domain
  const activePendingCount = domainTasks.filter(t => !t.is_completed && !sessionCompletedIds.has(t.id)).length;

  const handleMarkComplete = async (taskId) => {
    if (sessionCompletedIds.has(taskId)) return;

    // Layer session completed state on top of local fetch so it stays visible while modal remains open
    setSessionCompletedIds(prev => new Set(prev).add(taskId));

    // Fire actual server RPC / state updater
    if (onCompleteTask) {
      await onCompleteTask(taskId);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-modal-title"
      onClick={onClose}
    >
      <div 
        className="guardian-card-frame w-full max-w-2xl max-h-[90vh] flex flex-col p-3 sm:p-5 relative overflow-hidden bg-gradient-to-b from-[#211107] via-[#160b05] to-[#0c0502] border-2 border-amber-600/70 shadow-[0_10px_40px_rgba(0,0,0,0.95),0_0_30px_rgba(245,180,40,0.15)] rounded-2xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-40 p-1.5 rounded-full bg-stone-900/90 border border-amber-500/60 text-amber-200 hover:text-white hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
          aria-label="Close Card Inspection"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Entity Name & Category Badge */}
        <div className="bg-gradient-to-r from-[#170c05] via-[#221208] to-[#170c05] rounded-xl py-2 px-4 text-center mb-3 border border-amber-700/50 shadow-inner">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h2 id="card-modal-title" className="font-garamond font-bold text-xl sm:text-2xl text-[#faecd1] tracking-wide drop-shadow">
              {card.name}
            </h2>
            {card.category && (
              <span className="px-2 py-0.5 rounded-full bg-black/60 border border-amber-500/60 text-[10px] font-cinzel text-amber-300 uppercase tracking-wider">
                {card.category}
              </span>
            )}
            {profile && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-[11px] font-cinzel text-amber-300 font-bold shadow-sm">
                <span>💰</span> {profile.coin_balance ?? 0} GP
              </span>
            )}
            {isPlayer && onOpenCustomizeProfile && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCustomizeProfile();
                }}
                className="px-2.5 py-0.5 rounded-full bg-amber-900/80 hover:bg-amber-800 border border-amber-500/70 text-[10px] font-cinzel text-amber-200 hover:text-white font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1"
                title="Customize champion moniker and portrait"
              >
                <span>✦</span> Edit Profile
              </button>
            )}
          </div>
          <p className="text-[11px] font-newsreader text-amber-400/80 italic mt-0.5">
            {isEnemy ? `Guardian of the ${card.category} Domain` : 'Champion of the Tabletop Realm · Deed Ledger'}
          </p>
        </div>

        {/* Art Panel */}
        <div className="relative w-full h-44 sm:h-56 rounded-xl overflow-hidden border-2 border-[#523712] bg-stone-950 flex-shrink-0 mb-3 shadow-inner">
          <img 
            src={card.imageSrc || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'} 
            alt={card.name}
            className={`w-full h-full object-cover object-center transition-all duration-300 ${
              isEnemy && activePendingCount === 0 ? 'grayscale contrast-90 brightness-90' : ''
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100b06]/95 via-[#100b06]/30 to-transparent pointer-events-none" />
          
          {/* Active Challenges Count Badge */}
          {isEnemy && (
            <div className={`absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/85 border text-xs font-cinzel shadow transition-colors ${
              activePendingCount === 0 
                ? 'border-amber-600/70 text-amber-300 font-bold' 
                : 'border-amber-500/60 text-amber-300'
            }`}>
              {activePendingCount === 0 ? '✦ DEFEATED (0 Active Challenges)' : `${activePendingCount} Active Challenges Pending`}
            </div>
          )}

          {/* Player Card Level/Stats Overlay */}
          {isPlayer && profile && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/85 border border-amber-500/60 text-xs font-cinzel shadow">
              <div className="text-amber-300 font-bold">
                Level {profile.current_level} Champion
              </div>
              <div className="text-amber-400/80 text-[11px]">
                {profile.current_xp} XP Available
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CASE A: ENEMY CARD (Domain Active Tasks with Session Strikethrough) */}
        {/* ========================================================================= */}
        {isEnemy && (
          <div className={`p-2.5 rounded-xl border text-xs font-cinzel mb-2.5 flex items-center justify-between shadow-inner transition-colors ${
            isBossClaimed
              ? 'bg-emerald-950/70 border-emerald-600/50 text-emerald-200'
              : 'bg-amber-950/70 border-amber-600/50 text-amber-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-base">{isBossClaimed ? '✅' : '👑'}</span>
              <div>
                <span className="font-bold uppercase tracking-wider block text-[11px]">
                  Cycle Defeat Bounty ({currentCycleId || card?.currentCycleId || 'Weekly'})
                </span>
                <span className="text-[10px] font-newsreader text-stone-300">
                  {isBossClaimed
                    ? '50 Gold Coins claimed for this leaderboard cycle. Subsequent defeats grant 0 GP.'
                    : '50 Gold Coins awarded automatically upon defeating this adversary (clearing all domain quests). Once per cycle.'}
                </span>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded text-[10px] font-bold border whitespace-nowrap ${
              isBossClaimed
                ? 'bg-emerald-900/80 border-emerald-500 text-emerald-300'
                : 'bg-amber-900/80 border-amber-500 text-amber-300'
            }`}>
              {isBossClaimed ? '50 GP Claimed' : '50 GP Available'}
            </span>
          </div>
        )}

        {isEnemy ? (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-1.5 mb-2 text-xs font-cinzel text-amber-300">
              <span className="font-bold">Domain Tasks ({activePendingCount} Pending)</span>
              <span className="text-[10px] text-stone-400">24-Hour Rolling Deadlines</span>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-xs font-cinzel text-amber-400/70 animate-pulse">
                Consulting Tavern Scrolls...
              </div>
            ) : domainTasks.length === 0 ? (
              <div className="parchment-surface p-5 rounded-xl text-center my-3 border border-amber-950 shadow-inner space-y-1">
                <p className="font-cinzel text-xs font-bold text-amber-950 uppercase tracking-wider">
                  {isBossClaimed 
                    ? `✦ All Quests Cleared for ${card.category}!` 
                    : `✦ Adversary Subdued in ${card.category}!`}
                </p>
                <p className="text-[11px] font-newsreader text-amber-900 mt-1">
                  {isBossClaimed
                    ? 'Adversary has been defeated and bounty claimed for this cycle. Summon new quests to continue training.'
                    : 'All quests in this domain are resolved! Adversary subdued and victory bounty secured.'}
                </p>
              </div>
            ) : (
              domainTasks.map((task) => {
                const diff = DIFFICULTY_CONFIG[task.difficulty] || DIFFICULTY_CONFIG.Medium;
                const isCompleted = task.is_completed || sessionCompletedIds.has(task.id);

                return (
                  <div 
                    key={task.id}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isCompleted 
                        ? 'bg-[#140c06]/80 border-stone-800 opacity-60'
                        : 'bg-gradient-to-r from-[#201208]/90 via-[#180d05]/90 to-[#120703]/90 border-amber-700/60 hover:border-amber-400 hover:shadow-md'
                    }`}
                  >
                    {/* Left: Checkbox Toggle */}
                    <button
                      type="button"
                      onClick={() => !isCompleted && handleMarkComplete(task.id)}
                      disabled={isCompleted}
                      className="p-1 rounded text-amber-400 hover:text-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
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
                        {isCompleted && (
                          <span className="text-emerald-400 font-bold ml-1">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Two Stacked Badges (Reward & Penalty) */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {/* Reward Badge */}
                      <span className="px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/50 text-[10px] font-cinzel font-bold text-emerald-300 shadow">
                        +{diff.xp} XP · +{diff.stat} {card.category.slice(0, 3)} · -{diff.pressureRelief} Bar
                      </span>
                      {/* Penalty Badge & Fail Action */}
                      {!isCompleted && (
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded bg-red-950/90 border border-red-600/50 text-[10px] font-cinzel font-bold text-red-300 shadow">
                            -{diff.penalty} {card.category.slice(0, 3)} · +{diff.pressureFail} Bar
                          </span>
                          {onFailTask && (
                            <button
                              type="button"
                              onClick={() => handleFail(task.id)}
                              className="px-1.5 py-0.5 rounded bg-stone-900 hover:bg-red-950 text-stone-400 hover:text-red-300 border border-stone-700 hover:border-red-700 text-[9px] font-cinzel font-bold transition-all cursor-pointer"
                              title={`Concede quest: -${diff.penalty} Stat, +${diff.pressureFail} Reincarnation Pressure`}
                            >
                              Fail
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* CASE B: PLAYER CARD (Task History since Midnight IST) */
          /* ========================================================================= */
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-1.5 text-xs font-cinzel text-amber-300">
              <div className="flex items-center gap-2">
                <span className="text-sm">📜</span>
                <span className="font-bold tracking-wide">Task History (Deeds Since Midnight IST)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-black/60 border border-amber-600/40 text-[10px] text-amber-300 font-bold">
                {taskHistory.length} Recorded
              </span>
            </div>

            {/* Explanatory Banner */}
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#170c05] via-[#201007] to-[#170c05] border border-amber-700/50 text-xs font-newsreader text-amber-200/90 italic flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Chronicles of quests fulfilled since today's midnight IST boundary (00:00 IST).</span>
              </div>
              <span className="text-[10px] font-cinzel uppercase text-amber-400/70 shrink-0 ml-2">
                Daily Ledger
              </span>
            </div>

            {/* Task History Items */}
            {isLoading ? (
              <div className="py-8 text-center text-xs font-cinzel text-amber-400/70 animate-pulse">
                Unrolling Tabletop Chronicles...
              </div>
            ) : taskHistory.length === 0 ? (
              <div className="parchment-surface p-5 rounded-xl text-center space-y-1.5 my-3 border border-amber-950 shadow-inner">
                <p className="font-cinzel text-xs font-bold text-amber-950 uppercase tracking-wider">
                  No Deeds Inscribed Today
                </p>
                <p className="text-[11px] font-newsreader text-amber-900 max-w-sm mx-auto">
                  No domain quests have been conquered since midnight IST. Slay adversary tasks on the tabletop to inscribe your legacy in this ledger.
                </p>
              </div>
            ) : (
              <div className="space-y-2" role="feed" aria-label="Player Task History">
                {taskHistory.map((task) => {
                  const diff = DIFFICULTY_CONFIG[task.difficulty] || DIFFICULTY_CONFIG.Medium;
                  const IconComponent = CATEGORY_ICONS[task.category] || BookOpen;
                  const catTheme = CATEGORY_THEMES[task.category] || CATEGORY_THEMES.Academics;
                  const timeStr = formatTimeIST(task.completed_at);

                  return (
                    <div 
                      key={task.id}
                      className="p-3 rounded-xl border border-amber-700/60 bg-gradient-to-r from-[#201208]/90 via-[#180d05]/90 to-[#120703]/90 shadow-md flex items-center justify-between gap-3"
                    >
                      {/* Left: Category Icon & Details */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${catTheme.bg} ${catTheme.border} ${catTheme.text} shadow-sm`}>
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-garamond font-bold text-sm sm:text-base text-parchment-100 truncate">
                              {task.title}
                            </h4>
                            <span className="text-[10px] font-cinzel uppercase px-2 py-0.5 rounded-full bg-black/60 border border-amber-600/40 text-amber-300/90 tracking-wider shrink-0">
                              {task.category}
                            </span>
                          </div>
                          <div className="text-[11px] font-newsreader text-stone-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-stone-500 inline" />
                            <span>Completed at {timeStr}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Honor Badge */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/60 text-[10px] font-cinzel font-bold text-emerald-300 shadow">
                          +{diff.xp} XP · +{diff.stat} {task.category.slice(0, 3)}
                        </span>
                        <span className="text-[9px] font-cinzel text-amber-400/80 uppercase tracking-wider">
                          {task.difficulty} Trial
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
