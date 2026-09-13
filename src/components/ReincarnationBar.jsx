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
  onOpenTradeoffModal,
  onAdjustPressure
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
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
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

        {/* Action & Testing Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Demo Reincarnation Testing Button Group */}
          {onAdjustPressure && (
            <div className="flex flex-wrap items-center gap-1.5 bg-black/60 border border-amber-700/60 px-2 py-1 rounded-lg shadow-inner">
              <span className="text-[10px] font-cinzel text-amber-400/90 uppercase tracking-wider font-bold mr-0.5">
                Demo Test:
              </span>

              {/* Simulate Task Fail: Hard (+8), Medium (+9), Easy (+10) */}
              <button
                type="button"
                onClick={() => onAdjustPressure(8)}
                className="px-1.5 py-0.5 rounded bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white border border-red-700/50 text-[10px] font-cinzel font-bold shadow-sm transition-all active:scale-95 cursor-pointer focus:outline-none"
                title="Simulate Hard task fail (+8 Pressure)"
              >
                +8% (Fail Hard)
              </button>
              <button
                type="button"
                onClick={() => onAdjustPressure(9)}
                className="px-1.5 py-0.5 rounded bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white border border-red-700/50 text-[10px] font-cinzel font-bold shadow-sm transition-all active:scale-95 cursor-pointer focus:outline-none"
                title="Simulate Medium task fail (+9 Pressure)"
              >
                +9% (Fail Med)
              </button>
              <button
                type="button"
                onClick={() => onAdjustPressure(10)}
                className="px-1.5 py-0.5 rounded bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white border border-red-700/50 text-[10px] font-cinzel font-bold shadow-sm transition-all active:scale-95 cursor-pointer focus:outline-none"
                title="Simulate Easy task fail (+10 Pressure)"
              >
                +10% (Fail Easy)
              </button>

              {/* Simulate Task Complete: Hard (-3), Medium (-2), Easy (-1) */}
              <button
                type="button"
                onClick={() => onAdjustPressure(-3)}
                className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-700/50 text-[10px] font-cinzel font-bold shadow-sm transition-all active:scale-95 cursor-pointer focus:outline-none"
                title="Simulate Hard task complete (-3 Pressure)"
              >
                -3% (Done Hard)
              </button>
              <button
                type="button"
                onClick={() => onAdjustPressure(-2)}
                className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-700/50 text-[10px] font-cinzel font-bold shadow-sm transition-all active:scale-95 cursor-pointer focus:outline-none"
                title="Simulate Medium task complete (-2 Pressure)"
              >
                -2% (Done Med)
              </button>
              <button
                type="button"
                onClick={() => onAdjustPressure(-1)}
                className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-700/50 text-[10px] font-cinzel font-bold shadow-sm transition-all active:scale-95 cursor-pointer focus:outline-none"
                title="Simulate Easy task complete (-1 Pressure)"
              >
                -1% (Done Easy)
              </button>

              {/* Button 2: Immediate 100% Crisis Trigger */}
              <button
                type="button"
                onClick={() => onAdjustPressure(100)}
                className="px-2.5 py-0.5 rounded bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-amber-100 hover:text-white border border-amber-400/80 text-[10px] font-cinzel font-black shadow transition-all active:scale-95 cursor-pointer focus:outline-none"
                title="Immediately surge pressure to 100% to test the Crisis Dilemma Modal"
              >
                Test 100% Crisis
              </button>

              {/* Button 3: Reset to 0% */}
              {clampedValue > 0 && (
                <button
                  type="button"
                  onClick={() => onAdjustPressure(-clampedValue)}
                  className="px-1.5 py-0.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-[10px] font-cinzel font-bold transition-all active:scale-95 cursor-pointer focus:outline-none"
                  title="Reset reincarnation pressure back to 0%"
                >
                  ↺ Reset 0%
                </button>
              )}
            </div>
          )}

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
