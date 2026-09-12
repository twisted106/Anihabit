/**
 * @file ArenaView.jsx
 * @description The Arena: atmospheric category boss showcase.
 * In strict compliance with Master Advisory 2, all enemies are 100% cosmetic and visual-only.
 */

import React from 'react';
import { Swords, Eye, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { CATEGORIES } from '../constants/gameConfig';

export default function ArenaView({ stats }) {
  return (
    <section aria-label="The Arena" className="rpg-panel p-5 sm:p-6 border-purple-500/20 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-purple-400" />
          <h2 className="font-fantasy text-lg sm:text-xl font-bold text-white tracking-wide">
            The Arena (Category Bosses)
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-rpg-dark px-2.5 py-1 rounded-md border border-rpg-border self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Cosmetic immersion only — enemies reflect real-world friction</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {Object.entries(CATEGORIES).map(([catKey, cat]) => {
          const boss = cat.arenaBoss;
          const statVal = stats?.[cat.stat] || 10;
          
          // Visual suppressed rating based on player's category stat
          const suppressionPercent = Math.min(95, Math.round((statVal / 50) * 100));

          return (
            <div
              key={catKey}
              className={`rpg-card p-4 border ${boss.aura} bg-gradient-to-b from-rpg-card/90 to-black/60 flex flex-col justify-between gap-3 relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${cat.badgeClass}`}>
                    {cat.name}
                  </span>
                  <span className="text-2xl filter drop-shadow-md select-none" role="img" aria-label={boss.name}>
                    {boss.emoji}
                  </span>
                </div>

                <h3 className="font-fantasy text-base font-bold text-white tracking-wide">
                  {boss.name}
                </h3>
                <p className="text-xs text-slate-400 italic">
                  "{boss.title}"
                </p>
              </div>

              {/* Reactive Boss Aura / Suppression Gauge (Cosmetic) */}
              <div className="space-y-1.5 pt-3 border-t border-rpg-border/60">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Hero Aura Dominance:</span>
                  <span className="text-purple-300 font-bold">{suppressionPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-rpg-border">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${suppressionPercent}%` }}
                    role="progressbar"
                    aria-valuenow={suppressionPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Boss Aura Dominance: ${suppressionPercent}%`}
                  />
                </div>
                <p className="text-[10px] text-slate-500 text-right">
                  Powered by {cat.statLabel}: {statVal}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
