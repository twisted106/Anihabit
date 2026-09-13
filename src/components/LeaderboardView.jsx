import React from 'react';
import { Trophy, Shield, Award, User } from 'lucide-react';

/**
 * SCREEN 7 — Leaderboard (Simple Ranked List)
 * - Vertical scrollable list
 * - Each row shows: rank number, player name/avatar, and power score (average of 4 stats)
 * - No podium, no tabs — one clean ranked list in Tavern Hearth Tabletop theme
 * - Coins have zero influence on rank
 */
export default function LeaderboardView({
  leaderboard = [],
  currentUserId,
  powerScore,
  equippedLeaderboardEffect
}) {
  const getBorderEffectClass = (effectId) => {
    if (effectId === 'border_iron_band') return 'leaderboard-border-iron';
    if (effectId === 'border_bronze_sigil') return 'leaderboard-border-bronze';
    if (effectId === 'border_ember_rune') return 'leaderboard-border-ember';
    return '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4" data-purpose="screen-leaderboard">
      
      {/* Header Banner */}
      <div className="carved-plaque px-6 py-3 rounded-xl border-2 border-amber-700/80 shadow-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-0.5 border border-amber-800 shadow">
            <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h2 className="font-cinzel font-black text-base sm:text-lg text-amber-200 tracking-wider uppercase drop-shadow">
              Guild Grand Leaderboard
            </h2>
            <p className="text-xs font-newsreader text-stone-300 italic">
              Ranked purely by Average Stat Power (Strength + Intellect + Discipline + Willpower) / 4
            </p>
          </div>
        </div>

        <div className="text-[11px] font-cinzel text-amber-300/80 px-3 py-1 rounded bg-amber-950/80 border border-amber-700/60">
          Your Score: <strong className="text-amber-200 font-bold">{powerScore}</strong>
        </div>
      </div>

      {/* Clean Vertical Scrollable Ranked List */}
      <div className="guardian-card-frame p-4 sm:p-6 bg-wood-planks border-3 border-[#201308]">
        <div className="space-y-2.5">
          {leaderboard.length === 0 ? (
            <div className="parchment-surface p-6 rounded-lg text-center text-amber-950 font-cinzel font-bold text-sm">
              Gathering guild records from the realm archives...
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = entry.rank || index + 1;
              const isCurrentUser = entry.user_id === currentUserId;
              const isTopThree = rank <= 3;

              const effectId = isCurrentUser 
                ? (equippedLeaderboardEffect || entry.equipped_leaderboard_effect)
                : entry.equipped_leaderboard_effect;
              const borderEffectClass = getBorderEffectClass(effectId);

              return (
                <div
                  key={entry.user_id || index}
                  tabIndex={0}
                  className={`p-3 transition-all flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-offset-2 ${
                    borderEffectClass 
                      ? `${borderEffectClass} ${isCurrentUser ? 'bg-amber-950/90' : 'bg-wood-900/90'}`
                      : `rounded-xl border ${
                          isCurrentUser 
                            ? 'bg-amber-950/90 border-amber-400/80 ring-2 ring-amber-400/40 shadow-lg' 
                            : 'bg-wood-900/80 border-amber-900/60 hover:border-amber-700'
                        }`
                  }`}
                  aria-label={`Rank ${rank}: ${entry.display_name || 'Adventurer'}, Level ${entry.current_level || 1}, Power Score ${entry.average_stat ?? entry.power_score ?? 10}${effectId ? ' (Equipped ' + effectId.replace('border_', '').replace('_', ' ') + ')' : ''}`}
                >
                  {/* Left: Rank Badge & Player Avatar/Name */}
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                    {/* Rank Medallion */}
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-cinzel font-black text-xs sm:text-sm border shadow-md flex-shrink-0 ${
                      rank === 1 
                        ? 'bg-gradient-to-tr from-yellow-500 to-amber-300 text-stone-950 border-yellow-200 shadow-[0_0_10px_rgba(245,180,40,0.5)]'
                        : rank === 2
                        ? 'bg-gradient-to-tr from-slate-300 to-stone-400 text-stone-950 border-slate-200'
                        : rank === 3
                        ? 'bg-gradient-to-tr from-amber-700 to-yellow-600 text-amber-100 border-amber-500'
                        : 'bg-stone-900 text-stone-400 border-stone-800'
                    }`}>
                      #{rank}
                    </div>

                    {/* Avatar / Name */}
                    <div className="min-w-0">
                      <div className="font-garamond font-bold text-sm sm:text-base text-parchment-100 truncate flex items-center gap-2">
                        <span>{entry.display_name || 'Adventurer'}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-cinzel px-1.5 py-0.2 rounded bg-amber-900 text-amber-200 border border-amber-500/50">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-cinzel text-stone-400 flex items-center gap-2 mt-0.5">
                        <span>Level {entry.current_level || 1}</span>
                        <span>·</span>
                        <span className="text-amber-400/80">
                          STR: {entry.strength ?? 10} · INT: {entry.intellect ?? 10} · DIS: {entry.discipline ?? 10} · WIL: {entry.willpower ?? 10}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Average Power Score Badge */}
                  <div className="flex items-center space-x-2 flex-shrink-0 bg-black/60 border border-amber-500/50 px-3 py-1.5 rounded-lg shadow-inner">
                    <span className="text-xs font-cinzel text-amber-400/80 font-semibold uppercase hidden sm:inline">
                      Power Score
                    </span>
                    <span className="font-cinzel font-black text-sm sm:text-base text-amber-300">
                      {entry.average_stat ?? entry.power_score ?? 10}
                    </span>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
