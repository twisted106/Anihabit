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
  onOpenCustomizeProfile,
  onSignOut,
  isMuted,
  onToggleMute
}) {
  return (
    <header 
      className="w-full relative z-30 border-b-4 border-amber-950/80 bg-gradient-to-b from-[#2b170c] via-[#201007] to-[#160b05] px-3 sm:px-6 py-2 sm:py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-4 shadow-2xl"
      data-purpose="top-navigation-bar"
    >
      {/* Mobile Tier 1 Top Row / Desktop Left & Right Groupings */}
      <div className="w-full md:w-auto flex items-center justify-between gap-2">
        {/* Left: Avatar Thumbnail & Player Profile Title */}
        <div 
          className={`flex items-center space-x-2.5 sm:space-x-3 min-w-0 ${onOpenCustomizeProfile ? 'cursor-pointer group' : ''}`}
          onClick={onOpenCustomizeProfile}
          title={onOpenCustomizeProfile ? "Click to customize champion moniker and portrait" : undefined}
        >
          {/* Avatar Thumbnail */}
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-amber-500/80 overflow-hidden bg-stone-950 shadow-md group-hover:scale-105 transition-transform shrink-0">
            <img 
              src={profile?.avatar_url || '/images/avatars/knight_protector.jpg'} 
              alt={profile?.display_name || 'Champion Avatar'} 
              className="w-full h-full object-cover"
            />
            {onOpenCustomizeProfile && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] font-cinzel text-amber-200 font-bold">
                Edit
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400/90 font-cinzel font-bold">
                Champion
              </span>
              <span className="px-1.5 py-0.2 bg-amber-900/70 border border-amber-500/50 text-[10px] rounded text-amber-200 font-cinzel">
                Lv. {profile?.current_level || 1}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-cinzel font-bold text-parchment-200 tracking-wide drop-shadow truncate max-w-[120px] sm:max-w-[180px] md:max-w-xs group-hover:text-amber-300 transition-colors">
              {profile?.display_name || (sessionUser?.email ? sessionUser.email.split('@')[0] : 'Hero of Realm')}
            </p>
          </div>
        </div>

        {/* Mobile-Only Controls (Rendered on Row 1 for Mobile < md) */}
        <div className="flex md:hidden items-center space-x-1.5 shrink-0">
          {/* Mobile Treasury Coin Purse */}
          <div 
            className="flex items-center space-x-1.5 bg-wood-900/90 px-2 py-1 rounded-lg border border-amber-700/60 shadow-inner"
            title="Habit Coin Balance (Sole source of coins in the realm)"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border border-amber-800 flex items-center justify-center shadow">
              <Coins className="w-3 h-3 text-amber-950" />
            </div>
            <div>
              <div className="text-[8px] uppercase font-cinzel tracking-wider text-amber-400/70 leading-none">
                Vault
              </div>
              <div className="text-[11px] font-cinzel font-bold text-amber-300 leading-tight">
                {profile?.coin_balance ?? 0} GP
              </div>
            </div>
          </div>

          {/* Mobile Audio Mute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-wood-850 hover:bg-wood-800 border border-amber-900/60 text-amber-300/80 hover:text-amber-200 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Mobile Auth Button */}
          {sessionUser ? (
            <button
              type="button"
              onClick={onSignOut}
              className="min-h-[36px] px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-amber-300/90 text-[11px] font-cinzel font-semibold rounded border border-amber-900/60 flex items-center gap-1 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              title="Sign out of the tavern"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Depart</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="min-h-[36px] px-2.5 py-1 bg-amber-700 hover:bg-amber-600 text-amber-100 text-[11px] font-cinzel font-bold rounded border border-amber-400 shadow flex items-center gap-1 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Enter</span>
            </button>
          )}
        </div>
      </div>

      {/* Center: 4 Carved Stone & Gold Medallions (Navigation) — Visible on ALL screens */}
      <nav 
        className="w-full md:w-auto flex items-center justify-around md:justify-center space-x-1 sm:space-x-4 md:space-x-6 lg:space-x-8 pt-1.5 md:pt-0 border-t border-amber-900/30 md:border-t-0"
        data-purpose="nav-medallions"
        aria-label="Tabletop Navigation"
      >
        {/* 1. Leaderboard Medallion */}
        <button
          type="button"
          onClick={() => onSwitchTab('leaderboard')}
          className="medallion-btn group focus:outline-none focus-visible:outline-none cursor-pointer flex-1 md:flex-initial"
          title="Leaderboard"
          aria-label="View Leaderboard"
          aria-current={activeTab === 'leaderboard' ? 'page' : undefined}
        >
          <div className={`w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full p-1 border-2 transition-all flex items-center justify-center group-focus-visible:ring-2 group-focus-visible:ring-amber-400 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#160b05] ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 border-yellow-200 shadow-[0_0_16px_rgba(245,180,40,0.6)] scale-105'
              : 'bg-gradient-to-b from-stone-800 to-black border-amber-800/60 hover:border-amber-400 shadow-lg'
          }`}>
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1f2937] to-[#111827] flex items-center justify-center border border-amber-900/40">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className={`mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] md:text-xs font-cinzel font-bold text-center ${
            activeTab === 'leaderboard' ? 'text-amber-300' : 'text-amber-400/70 group-hover:text-amber-300'
          }`}>
            Rank
          </span>
        </button>

        {/* 2. Dashboard Medallion (Player Sheet) */}
        <button
          type="button"
          onClick={() => onSwitchTab('dashboard')}
          className="medallion-btn group focus:outline-none focus-visible:outline-none cursor-pointer flex-1 md:flex-initial"
          title="Player Dashboard"
          aria-label="View Player Dashboard"
          aria-current={activeTab === 'dashboard' ? 'page' : undefined}
        >
          <div className={`w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full p-1 border-2 transition-all flex items-center justify-center group-focus-visible:ring-2 group-focus-visible:ring-emerald-400 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#160b05] ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-b from-emerald-500 via-emerald-700 to-emerald-950 border-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.6)] scale-105'
              : 'bg-gradient-to-b from-emerald-950 to-black border-emerald-800/60 hover:border-emerald-400 shadow-lg'
          }`}>
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0e271a] to-[#06140d] flex items-center justify-center border border-emerald-700/50">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className={`mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] md:text-xs font-cinzel font-bold text-center ${
            activeTab === 'dashboard' ? 'text-emerald-300' : 'text-emerald-400/70 group-hover:text-emerald-300'
          }`}>
            Hero
          </span>
        </button>

        {/* 3. Habit / Task Medallion */}
        <button
          type="button"
          onClick={() => onSwitchTab('gameview')}
          className="medallion-btn group focus:outline-none focus-visible:outline-none cursor-pointer flex-1 md:flex-initial"
          title="Habit & Task Tabletop Arena"
          aria-label="View Tabletop Arena"
          aria-current={activeTab === 'gameview' ? 'page' : undefined}
        >
          <div className={`w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full p-1 border-2 transition-all flex items-center justify-center group-focus-visible:ring-2 group-focus-visible:ring-amber-400 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#160b05] ${
            activeTab === 'gameview'
              ? 'bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 border-yellow-200 shadow-[0_0_20px_rgba(245,180,40,0.7)] scale-105 sm:scale-110'
              : 'bg-gradient-to-b from-stone-800 to-black border-amber-800/60 hover:border-amber-400 shadow-lg'
          }`}>
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#4d1616] to-[#250808] flex items-center justify-center border border-amber-300">
              <Scroll className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-parchment-200 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className={`mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] md:text-xs font-cinzel font-bold text-center ${
            activeTab === 'gameview' ? 'text-amber-300 drop-shadow' : 'text-amber-400/70 group-hover:text-amber-300'
          }`}>
            Arena
          </span>
        </button>

        {/* 4. Shop Medallion */}
        <button
          type="button"
          onClick={() => onSwitchTab('shop')}
          className="medallion-btn group focus:outline-none focus-visible:outline-none cursor-pointer flex-1 md:flex-initial"
          title="Cosmetics Bazaar"
          aria-label="View Shop"
          aria-current={activeTab === 'shop' ? 'page' : undefined}
        >
          <div className={`w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full p-1 border-2 transition-all flex items-center justify-center group-focus-visible:ring-2 group-focus-visible:ring-purple-400 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#160b05] ${
            activeTab === 'shop'
              ? 'bg-gradient-to-b from-purple-500 via-purple-700 to-purple-950 border-purple-300 shadow-[0_0_16px_rgba(192,132,252,0.6)] scale-105'
              : 'bg-gradient-to-b from-purple-950 to-black border-purple-800/60 hover:border-purple-400 shadow-lg'
          }`}>
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#290e38] to-[#12041a] flex items-center justify-center border border-purple-700/50">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className={`mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] md:text-xs font-cinzel font-bold text-center ${
            activeTab === 'shop' ? 'text-purple-300' : 'text-purple-400/70 group-hover:text-purple-300'
          }`}>
            Bazaar
          </span>
        </button>
      </nav>

      {/* Desktop-Only Right: Gold Vault & Controls (Hidden on mobile < md because rendered in Tier 1) */}
      <div className="hidden md:flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Treasury Coin Purse */}
        <div 
          className="flex items-center space-x-2 bg-wood-900/90 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-amber-700/60 shadow-inner"
          title="Habit Coin Balance (Sole source of coins in the realm)"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border border-amber-800 flex items-center justify-center shadow">
            <Coins className="w-3.5 h-3.5 text-amber-950" />
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
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-wood-850 hover:bg-wood-800 border border-amber-900/60 text-amber-300/80 hover:text-amber-200 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
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
            className="min-h-[40px] px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300/90 text-xs font-cinzel font-semibold rounded border border-amber-900/60 flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            title="Sign out of the tavern"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Depart</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="min-h-[40px] px-3.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-amber-100 text-xs font-cinzel font-bold rounded border border-amber-400 shadow flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Enter Tavern</span>
          </button>
        )}
      </div>
    </header>
  );
}
