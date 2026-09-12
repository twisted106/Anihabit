/**
 * @file TradeoffModal.jsx
 * @description Crisis resolution modal triggered when the global Reincarnation Meter reaches 100% capacity.
 * Enforces the two-way trade-off dilemma defined in the Life RPG specification.
 */

import React from 'react';
import { Skull, AlertTriangle, TrendingDown, Coins, ShieldAlert } from 'lucide-react';
import { 
  REINCARNATION_STAT_SACRIFICE_PERCENT, 
  REINCARNATION_COIN_SACRIFICE_PERCENT 
} from '../constants/gameConfig';

export default function TradeoffModal({
  isOpen,
  stats,
  coinBalance,
  onResolveTradeoff
}) {
  if (!isOpen) return null;

  const statDeduction = {
    intellect: Math.round((stats?.intellect || 10) * REINCARNATION_STAT_SACRIFICE_PERCENT),
    strength: Math.round((stats?.strength || 10) * REINCARNATION_STAT_SACRIFICE_PERCENT),
    discipline: Math.round((stats?.discipline || 10) * REINCARNATION_STAT_SACRIFICE_PERCENT),
    willpower: Math.round((stats?.willpower || 10) * REINCARNATION_STAT_SACRIFICE_PERCENT)
  };

  const coinDeduction = Math.round(coinBalance * REINCARNATION_COIN_SACRIFICE_PERCENT);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="tradeoff-title"
      aria-describedby="tradeoff-desc"
    >
      <div className="rpg-panel max-w-xl w-full p-6 sm:p-8 relative border-rose-600/70 shadow-glow-pressure bg-gradient-to-b from-[#180d12] to-rpg-panel">
        {/* Urgent Warning Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-600/60 mx-auto flex items-center justify-center mb-3 text-rose-500 shadow-glow-pressure animate-pulse-glow">
            <Skull className="w-9 h-9" />
          </div>
          <h2 id="tradeoff-title" className="font-fantasy text-2xl sm:text-3xl font-bold text-rose-300 tracking-wider">
            REINCARNATION CRISIS
          </h2>
          <p id="tradeoff-desc" className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
            Neglect has overwhelmed your hero. The cosmic reincarnation pressure gauge has reached <span className="text-rose-400 font-bold">100%</span> capacity. A severe tribute is demanded to stave off total spiritual erasure.
          </p>
        </div>

        {/* The Two Choices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Choice A: Sacrifice Stats */}
          <div className="rpg-card p-5 border-rose-500/40 bg-rose-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-rose-400">
                <TrendingDown className="w-5 h-5" />
                <h3 className="font-fantasy text-base font-bold">Sacrifice Stats</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Surrender <span className="text-rose-300 font-semibold">{REINCARNATION_STAT_SACRIFICE_PERCENT * 100}%</span> of your hard-earned category attributes. Your coin balance is preserved, but your leaderboard standing will fall.
              </p>
              <div className="text-[11px] font-mono space-y-1 bg-black/40 p-2.5 rounded-lg border border-rose-900/40 text-slate-300">
                <div className="flex justify-between">
                  <span>Intellect:</span>
                  <span className="text-rose-400">-{statDeduction.intellect}</span>
                </div>
                <div className="flex justify-between">
                  <span>Strength:</span>
                  <span className="text-rose-400">-{statDeduction.strength}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discipline:</span>
                  <span className="text-rose-400">-{statDeduction.discipline}</span>
                </div>
                <div className="flex justify-between">
                  <span>Willpower:</span>
                  <span className="text-rose-400">-{statDeduction.willpower}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onResolveTradeoff('stats')}
              className="rpg-btn mt-5 w-full py-2.5 px-3 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-glow-strength"
            >
              Surrender Attributes
            </button>
          </div>

          {/* Choice B: Sacrifice Coins */}
          <div className="rpg-card p-5 border-amber-500/40 bg-amber-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-amber-400">
                <Coins className="w-5 h-5" />
                <h3 className="font-fantasy text-base font-bold">Sacrifice Coins</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Surrender <span className="text-amber-300 font-semibold">{REINCARNATION_COIN_SACRIFICE_PERCENT * 100}%</span> of your gold coin pouch. Your stats and leaderboard score remain pristine.
              </p>
              <div className="text-[11px] font-mono bg-black/40 p-2.5 rounded-lg border border-amber-900/40 text-slate-300">
                <div className="flex justify-between items-center">
                  <span>Current Gold:</span>
                  <span className="text-amber-400 font-bold">{coinBalance} Coins</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span>Tribute Cost:</span>
                  <span className="text-rose-400 font-bold">-{coinDeduction} Coins</span>
                </div>
                <div className="flex justify-between items-center mt-1 pt-1 border-t border-amber-900/30">
                  <span>Remaining:</span>
                  <span className="text-slate-300">{coinBalance - coinDeduction} Coins</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onResolveTradeoff('coins')}
              className="rpg-btn mt-5 w-full py-2.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-glow-gold"
            >
              Tribute Gold Pouch
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[11px] text-slate-500">
            * Resolving this crisis resets the Reincarnation Pressure Gauge back to 0%.
          </p>
        </div>
      </div>
    </div>
  );
}
