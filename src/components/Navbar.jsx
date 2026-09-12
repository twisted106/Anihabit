/**
 * @file Navbar.jsx
 * @description Top navigation bar with app branding, audio controls, shop & leaderboard toggles, and auth state.
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Volume2, 
  VolumeX, 
  Trophy, 
  ShoppingBag, 
  User, 
  LogOut, 
  Sparkles,
  Zap
} from 'lucide-react';
import { sound } from '../lib/audio';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Navbar({
  sessionUser,
  isDemoMode,
  equippedTitle,
  onOpenAuth,
  onOpenShop,
  onOpenLeaderboard,
  notify
}) {
  const [isAudioMuted, setIsAudioMuted] = useState(sound.isMuted);

  const handleToggleAudio = () => {
    const nextMuted = sound.toggleMute();
    setIsAudioMuted(nextMuted);
    notify(nextMuted ? 'Sound effects muted' : 'Sound effects enabled', 'info', nextMuted ? '🔇' : '🔊');
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured && sessionUser) {
      await supabase.auth.signOut();
      notify('Logged out successfully. Switched to demo mode.', 'info', '👋');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rpg-border bg-rpg-panel/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-600 p-0.5 shadow-glow-intellect flex items-center justify-center">
            <div className="w-full h-full bg-rpg-dark rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-fantasy text-xl font-bold tracking-wider text-white">
                LIFE <span className="text-indigo-400">RPG</span>
              </h1>
              {isDemoMode && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Demo Hero
                </span>
              )}
            </div>
            <p className="hidden sm:block text-xs text-slate-400">
              Discipline Forge & Reincarnation Pressure
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={isAudioMuted ? 'Unmute game audio' : 'Mute game audio'}
            className="rpg-btn w-9 h-9 rounded-lg bg-rpg-card hover:bg-slate-800 border border-rpg-border text-slate-300 hover:text-white transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Shop Trigger */}
          <button
            type="button"
            onClick={onOpenShop}
            aria-label="Open Cosmetic Shop"
            className="rpg-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold transition-colors shadow-glow-gold/40"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Shop</span>
          </button>

          {/* Leaderboard Trigger */}
          <button
            type="button"
            onClick={onOpenLeaderboard}
            aria-label="Open Global Leaderboard"
            className="rpg-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold transition-colors shadow-glow-intellect/40"
          >
            <Trophy className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Ranks</span>
          </button>

          {/* Authentication State */}
          {sessionUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-rpg-border">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200">
                  {sessionUser.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-indigo-400 font-mono">
                  {equippedTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Sign out of account"
                title="Sign Out"
                className="rpg-btn w-9 h-9 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              aria-label="Sign In or Create Account"
              className="rpg-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-glow-intellect"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
