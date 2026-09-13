import React from 'react';
import { Trophy, Shield, Scroll, ShoppingBag, Coins, LogIn, LogOut, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../lib/audio';

/**
 * Top Tabletop Navigation Bar
 * Features:
 * - Burning Candle & Player Level
 * - 4 Carved Medallion Icons: Leaderboard, Dashboard, Habit/Task (Game View), Shop
 * - Treasury Vault Gold Counter
 * - Audio & Auth Toggles
 */
export default function Navbar({
  activeTab,
  onSwitchTab,
  sessionUser,
  isDemoMode,
  profile,
  onOpenAuth,
  onSignOut,
  isMuted,
  onToggleMute
}) {
  return (
    <header 
      className="w-full relative z-30 border-b-4 border-amber-950/80 bg-gradient-to-b from-[#2b170c] via-[#201007] to-[#160b05] px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl"
      data-purpose="top-navigation-bar"
    >
      {/* Left: Candle & Player Profile Title */}
      <div className="flex items-center space-x-3">
        {/* Burning Candle Ornament */}
        <div className="relative flex items-center justify-center w-8 h-12" title="Candlelight of Focus">
          <div className="w-3 h-6 bg-gradient-to-t from-amber-100 to-amber-50 rounded-sm absolute bottom-1 shadow-inner border border-amber-800/40" />
          <div className="flame-glow w-2.5 h-4 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-full absolute top-1" />
          <div className="w-6 h-1.5 bg-amber-950 rounded-full absolute bottom-0 shadow-md" />
        </div>

        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400/90 font-cinzel font-bold">
              Champion
            </span>
            <span className="px-1.5 py-0.2 bg-amber-900/70 border border-amber-500/50 text-[10px] rounded text-amber-200 font-cinzel">
              Lv. {profile?.current_level || 1}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-cinzel font-bold text-parchment-200 tracking-wide drop-shadow truncate max-w-[150px] sm:max-w-xs">
            {sessionUser?.email ? sessionUser.email.split('@')[0] : 'Hero of the Realm'}
          </p>
        </div>
      </div>

      {/* Center: 4 Carved Stone & Gold Medallions (Navigation) */}
      <nav 
        className="flex items-center justify-center space-x-3 sm:space-x-6 md:space-x-8"
        data-purpose="nav-medallions"
        aria-label="Tabletop Navigation"
      >
        {/* 1. Leaderboard Medallion */}
        <button
          type="button"
          onClick={() => onSwitchTab('leaderboard')}
          className="medallion-btn group focus:outline-none focus-visible:outline-none cursor-pointer"
          title="Leaderboard"
          aria-label="View Leaderboard"
          aria-current={activeTab === 'leaderboard' ? 'page' : undefined}
        >
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full p-1 border-2 transition-all flex items-center justify-center group-focus-visible:ring-2 group-focus-visible:ring-amber-400 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#160b05] ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 border-yellow-200 shadow-[0_0_16px_rgba(245,180,40,0.6)] scale-105'
              : 'bg-gradient-to-b from-stone-800 to-black border-amber-800/60 hover:border-amber-400 shadow-lg'
          }`}>
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1f2937] to-[#111827] flex items-center justify-center border border-amber-900/40">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className={`mt-1 text-[10px] sm:text-xs font-cinzel font-bold ${
            activeTab === 'leaderboard' ? 'text-amber-300' : 'text-amber-400/70 group-hover:text-amber-300'
          }`}>
            Leaderboard
          </span>
        </button>

        {/* 2. Dashboard Medallion (Player Sheet) */}
        <button
          type="button"
          onClick={() => onSwitchTab('dashboard')}
          className="medallion-btn group focus:outline-none focus-visible:outline-none cursor-pointer"
          title="Player Dashboard"
          aria-label="View Player Dashboard"
          aria-current={activeTab === 'dashboard' ? 'page' : undefined}
        >
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full p-1 border-2 transition-all flex items-center justify-center group-focus-visible:ring-2 group-focus-visible:ring-emerald-400 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#160b05] ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-b from-emerald-500 via-emerald-700 to-emerald-950 border-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.6)] scale-105'
              : 'bg-gradient-to-b from-emerald-950 to-black border-emerald-800/60 hover:border-emerald-400 shadow-lg'
          }`}>
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0e271a] to-[#06140d] flex items-center justify-center border border-emerald-700/50">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className={`mt-1 text-[10px] sm:text-xs font-cinzel font-bold ${
            activeTab === 'dashboard' ? 'text-emerald-300' : 'text-emerald-400/70 group-hover:text-emerald-300'
          }`}>
            Dashboard
          </span>
        </button>

        {/* 3. Habit / Task Medallion */}
        <button
          type="button"
          onClick={() => onSwitchTab('gameview')}
          className="medallion-btn group focus:outline-none focus-visible:outline-none cursor-pointer"
          title="Habit & Task Tabletop Arena"
          aria-label="View Tabletop Arena"
          aria-current={activeTab === 'gameview' ? 'page' : undefined}
        >
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full p-1 border-2 transition-all flex items-center justify-center group-focus-visible:ring-2 group-focus-visible:ring-amber-400 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#160b05] ${
            activeTab === 'gameview'
              ? 'bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 border-yellow-200 shadow-[0_0_20px_rgba(245,180,40,0.7)] scale-110'
              : 'bg-gradient-to-b from-stone-800 to-black border-amber-800/60 hover:border-amber-400 shadow-lg'
          }`}>
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#4d1616] to-[#250808] flex items-center justify-center border border-amber-300">
              <Scroll className="w-5 h-5 sm:w-6 sm:h-6 text-parchment-200 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className={`mt-1 text-[10px] sm:text-xs font-cinzel font-bold ${
            activeTab === 'gameview' ? 'text-amber-300 drop-shadow' : 'text-amber-400/70 group-hover:text-amber-300'
          }`}>
            Habit / Task
          </span>
        </button>

        {/* 4. Shop Medallion */}
        <button
          type="button"
          onClick={() => onSwitchTab('shop')}
          className="medallion-btn group focus:outline-none focus-visible:outline-none cursor-pointer"
          title="Cosmetics Bazaar"
          aria-label="View Shop"
          aria-current={activeTab === 'shop' ? 'page' : undefined}
        >
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full p-1 border-2 transition-all flex items-center justify-center group-focus-visible:ring-2 group-focus-visible:ring-purple-400 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#160b05] ${
            activeTab === 'shop'
              ? 'bg-gradient-to-b from-purple-500 via-purple-700 to-purple-950 border-purple-300 shadow-[0_0_16px_rgba(192,132,252,0.6)] scale-105'
              : 'bg-gradient-to-b from-purple-950 to-black border-purple-800/60 hover:border-purple-400 shadow-lg'
          }`}>
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#290e38] to-[#12041a] flex items-center justify-center border border-purple-700/50">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className={`mt-1 text-[10px] sm:text-xs font-cinzel font-bold ${
            activeTab === 'shop' ? 'text-purple-300' : 'text-purple-400/70 group-hover:text-purple-300'
          }`}>
            Shop
          </span>
        </button>
      </nav>

      {/* Right: Gold Vault & Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Treasury Coin Purse (Habits are the sole coin source) */}
        <div 
          className="flex items-center space-x-2 bg-wood-900/90 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-amber-700/60 shadow-inner"
          title="Habit Coin Balance (Sole source of coins in the realm)"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border border-amber-800 flex items-center justify-center font-cinzel font-black text-amber-950 text-xs shadow">
            🪙
          </div>
          <div>
            <div className="text-[9px] uppercase font-cinzel tracking-wider text-amber-400/70 leading-none">
              Vault
            </div>
            <div className="text-xs sm:text-sm font-cinzel font-bold text-amber-300 leading-tight">
              {profile?.coin_balance ?? 0} GP
            </div>
          </div>
        </div>

        {/* Audio Mute Toggle */}
        <button
          type="button"
          onClick={onToggleMute}
          className="p-1.5 rounded-lg bg-wood-850 hover:bg-wood-800 border border-amber-900/60 text-amber-300/80 hover:text-amber-200 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Auth Button */}
        {sessionUser ? (
          <button
            type="button"
            onClick={onSignOut}
            className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-amber-300/90 text-xs font-cinzel font-semibold rounded border border-amber-900/60 flex items-center gap-1 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
            title="Sign out of the tavern"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Depart</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="px-3 py-1 bg-amber-700 hover:bg-amber-600 text-amber-100 text-xs font-cinzel font-bold rounded border border-amber-400 shadow flex items-center gap-1 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Enter Tavern</span>
          </button>
        )}
      </div>
    </header>
  );
}
