/**
 * @file LeaderboardModal.jsx
 * @description Accessible modal dialog for displaying the global player leaderboard.
 * Ranked strictly by the average of the four category stats. Coins have zero weight.
 */

import React, { useEffect } from 'react';
import { X, Trophy, Medal, Crown, Shield } from 'lucide-react';

export default function LeaderboardModal({
  isOpen,
  onClose,
  leaderboard,
  onRefresh,
  currentUserId
}) {
  useEffect(() => {
    if (isOpen && onRefresh) {
      onRefresh();
    }
  }, [isOpen, onRefresh]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-title"
    >
      <div className="rpg-panel max-w-3xl w-full p-6 sm:p-7 relative border-indigo-500/40 shadow-glow-intellect/30 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close leaderboard"
          className="rpg-btn absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-rpg-border">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-glow-intellect/40">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 id="leaderboard-title" className="font-fantasy text-xl font-bold text-white tracking-wide">
              Hall of Heroes (Global Leaderboard)
            </h2>
            <p className="text-xs text-slate-400">
              Ranked strictly by the average of all 4 category attributes • Coins have zero weight
            </p>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-rpg-border text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Hero</th>
                <th className="py-2.5 px-3 text-center">Level</th>
                <th className="py-2.5 px-3 text-right">Power Score (Avg)</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">Attributes (I / S / D / W)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rpg-border/40 text-xs">
              {leaderboard.map((player) => {
                const isCurrentUser = player.user_id === currentUserId || player.display_name.includes('(You)');

                let rankBadge = <span className="font-mono text-slate-400 font-bold">#{player.rank}</span>;
                if (player.rank === 1) {
                  rankBadge = <Crown className="w-4 h-4 text-amber-400 inline" />;
                } else if (player.rank === 2) {
                  rankBadge = <Medal className="w-4 h-4 text-slate-300 inline" />;
                } else if (player.rank === 3) {
                  rankBadge = <Medal className="w-4 h-4 text-amber-600 inline" />;
                }

                const borderClass = player.equipped_leaderboard_effect === 'border_iron_band' ? 'leaderboard-border-iron' :
                  player.equipped_leaderboard_effect === 'border_bronze_sigil' ? 'leaderboard-border-bronze' :
                  player.equipped_leaderboard_effect === 'border_ember_rune' ? 'leaderboard-border-ember' : '';

                return (
                  <tr
                    key={player.rank}
                    className={`transition-colors ${borderClass} ${
                      isCurrentUser 
                        ? 'bg-indigo-950/40 font-bold text-indigo-200' 
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        {rankBadge}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {player.display_name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600/60 text-white font-mono">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-rpg-border text-indigo-300 font-semibold">
                        Lvl {player.current_level}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-300 text-sm">
                      {player.average_stat}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[11px] text-slate-400 hidden sm:table-cell">
                      <span className="text-indigo-400">{player.intellect}</span> /{' '}
                      <span className="text-rose-400">{player.strength}</span> /{' '}
                      <span className="text-emerald-400">{player.discipline}</span> /{' '}
                      <span className="text-purple-400">{player.willpower}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
