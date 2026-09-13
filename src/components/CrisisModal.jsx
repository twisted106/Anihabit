import React from 'react';
import { AlertOctagon, Flame, ShieldAlert, Coins, TrendingDown } from 'lucide-react';

/**
 * SCREEN 8 — Crisis Trade-Off Modal (Triggered when Reincarnation Meter hits 100%)
 * - Full-screen modal with dramatic fiery red accents
 * - Two choices only:
 *   Option A: 'Sacrifice Stats' (Lose 25% across all 4 stats, coins unaffected)
 *   Option B: 'Sacrifice Coins' (Lose 50% coins, stats unaffected)
 * - Meter resets to 0 after choosing
 * - Strictly NO third option, NO dismiss-without-choosing
 */
export default function CrisisModal({
  isOpen,
  stats,
  coinBalance = 0,
  onResolveTradeoff
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="crisis-dialog-title"
      aria-describedby="crisis-dialog-desc"
    >
      <div className="guardian-card-frame w-full max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-[#2d0909] via-[#1a0505] to-[#0d0202] border-4 border-red-600 shadow-[0_0_50px_rgba(239,68,68,0.5)] relative text-center">
        
        {/* Pulsing Crisis Icon */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center mb-3 sm:mb-4 animate-pulse">
          <AlertOctagon className="w-8 h-8 text-red-400" />
        </div>

        {/* Title Banner */}
        <h2 id="crisis-dialog-title" className="font-cinzel font-black text-xl sm:text-2xl text-red-200 tracking-widest uppercase drop-shadow-md">
          Reincarnation Crisis Triggered!
        </h2>
        
        <p id="crisis-dialog-desc" className="text-xs sm:text-sm font-newsreader text-red-300/90 italic mt-2 max-w-md mx-auto leading-relaxed">
          The global meter has accumulated 100% neglect pressure. The ancient tavern laws demand an immediate tribute before your journey may proceed.
        </p>

        {/* The Two Sacred Sacrifices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 text-left">
          
          {/* OPTION 1: Sacrifice Stats */}
          <div className="bg-stone-950/80 border-2 border-red-700/80 hover:border-red-400 p-4 rounded-xl flex flex-col justify-between shadow-lg transition-all">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <h3 className="font-cinzel font-bold text-sm text-red-200 uppercase tracking-wider">
                  Sacrifice Stats
                </h3>
              </div>
              <p className="text-xs font-newsreader text-stone-300 leading-relaxed">
                Forfeit <strong>25% of all 4 attributes</strong> (Strength, Intellect, Discipline, Willpower). Your power score drops, but your gold remains untouched.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onResolveTradeoff('stats')}
              className="mt-4 w-full min-h-[44px] py-2.5 px-3 rounded-lg bg-red-800 hover:bg-red-700 border border-red-500 text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Forfeit 25% Stats
            </button>
          </div>

          {/* OPTION 2: Sacrifice Coins */}
          <div className="bg-stone-950/80 border-2 border-amber-600/80 hover:border-amber-400 p-4 rounded-xl flex flex-col justify-between shadow-lg transition-all">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="font-cinzel font-bold text-sm text-amber-200 uppercase tracking-wider">
                  Sacrifice Wealth
                </h3>
              </div>
              <p className="text-xs font-newsreader text-stone-300 leading-relaxed">
                Offer <strong>50% of your current coin balance</strong> ({Math.round(coinBalance * 0.5)} GP) to the altar. Your stats and leaderboard rank remain preserved.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onResolveTradeoff('coins')}
              className="mt-4 w-full min-h-[44px] py-2.5 px-3 rounded-lg bg-amber-700 hover:bg-amber-600 border border-amber-400 text-stone-950 font-cinzel font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              Tribute 50% Coins
            </button>
          </div>

        </div>

        {/* Warning Note */}
        <p className="text-[11px] font-cinzel text-red-400/80">
          * Choosing a sacrifice instantly clears the reincarnation meter back to 0%. There is no escape without a tribute.
        </p>

      </div>
    </div>
  );
}
