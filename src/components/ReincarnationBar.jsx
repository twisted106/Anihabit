import React from 'react';
import { Flame, AlertTriangle, Info } from 'lucide-react';
import { RECEIVE_ON_FAIL, REDUCE_ON_COMPLETE, REINCARNATION_MAX } from '../constants/gameConfig';

/**
 * Global Reincarnation Pressure Meter
 * 0% to 100% Progress Bar with Calm-to-Fiery-Red Color Shift
 * Displays x > y tooltip (+15% per missed task, -8% per completed task)
 */
export default function ReincarnationBar({
  meterValue = 0,
  onOpenTradeoffModal
}) {
  const clampedValue = Math.min(REINCARNATION_MAX, Math.max(0, Math.round(meterValue)));
  const percentage = (clampedValue / REINCARNATION_MAX) * 100;
  const isHighPressure = percentage >= 70;
  const isCrisis = percentage >= 100;

  return (
    <section 
      className="w-full max-w-5xl mx-auto carved-plaque p-3 sm:p-4 rounded-xl border-2 border-amber-700/80 shadow-2xl relative overflow-hidden my-2"
      data-purpose="reincarnation-pressure-meter"
      aria-labelledby="pressure-meter-label"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-amber-400 text-base flame-glow" role="img" aria-label="Flame">
            🔥
          </span>
          <h2 
            id="pressure-meter-label"
            className="font-cinzel font-black text-xs sm:text-sm uppercase tracking-widest text-amber-200 drop-shadow"
          >
            Global Reincarnation Pressure
          </h2>
          <span className={`px-2 py-0.5 rounded font-cinzel text-xs font-bold border shadow ${
            isHighPressure 
              ? 'bg-red-950/90 border-red-500/80 text-red-200 animate-pulse' 
              : 'bg-amber-950/80 border-amber-600/60 text-amber-200'
          }`}>
            {clampedValue}% / {REINCARNATION_MAX}%
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* High-Pressure Warning Alert */}
          {percentage >= 70 && (
            <button
              type="button"
              onClick={onOpenTradeoffModal}
              className="text-xs font-cinzel font-bold text-red-300 hover:text-red-100 border border-red-600/70 hover:border-red-400 bg-red-950/60 hover:bg-red-900/80 px-2.5 py-1 rounded transition-all active:scale-95 flex items-center gap-1.5 shadow"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>CRISIS AT 100%</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}
        </div>
      </div>

      {/* Meter Track */}
      <div 
        className="w-full h-3.5 bg-stone-950 rounded-full border-2 border-amber-900/80 p-0.5 relative overflow-hidden shadow-inner"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={REINCARNATION_MAX}
        aria-label="Reincarnation Pressure Meter"
      >
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            percentage >= 75
              ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 pulse-pressure'
              : percentage >= 40
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500'
              : 'bg-gradient-to-r from-emerald-600 to-amber-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Diegetic Rule & Tooltip Note */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-cinzel text-amber-400/80 mt-1.5 px-1">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-amber-500 inline" />
          <span>
            <strong className="text-red-300">+8 to +10</strong> on missed task · <strong className="text-emerald-300">-1 to -3</strong> on completed task
          </span>
        </span>
        <span className="text-stone-400 hidden sm:inline">
          Reincarnation forces a severe sacrifice upon reaching 100%
        </span>
      </div>
    </section>
  );
}
