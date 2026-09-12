import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Shield, Mail, Lock, X, AlertTriangle, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * SCREEN 1 — Auth (Login / Signup)
 * - Themed parchment-and-wood modal
 * - Fields: email, password
 * - Toggle between Login / Signup
 * - Real <input> and <button> elements
 * - Session persists on refresh via Supabase
 */
export default function AuthModal({ isOpen, onClose, onGuestMode, notify }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        notify?.('Tavern adventurer registered! Logging in...', 'success');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        notify?.('Welcome back to the hearth, Adventurer!', 'success');
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-dialog-title"
      onClick={onClose}
    >
      <div 
        className="guardian-card-frame w-full max-w-md p-6 sm:p-7 bg-wood-planks border-4 border-[#201308] relative shadow-2xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-900 border border-amber-600/60 text-amber-200 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
          aria-label="Close login modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="guardian-dark-inset rounded-lg py-2 px-3 text-center mb-5">
          <h2 id="auth-dialog-title" className="font-cinzel font-black text-lg sm:text-xl text-[#faecd1] tracking-wider uppercase drop-shadow">
            {isSignUp ? 'Register Tavern Adventurer' : 'Adventurer Log In'}
          </h2>
          <p className="text-[11px] font-newsreader text-amber-300/80 italic mt-0.5">
            {isSignUp ? 'Inscribe your name in the Guild Tome (Level 1, 10 All Stats)' : 'Resume your journey in the tavern realm'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded bg-red-950/80 border border-red-600/60 text-red-200 text-xs font-cinzel flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-cinzel font-bold text-amber-200 uppercase tracking-wider mb-1" htmlFor="tavern-email">
              Scroll of Identity (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-600/80 absolute left-3 top-3" />
              <input 
                id="tavern-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adventurer@tavern.realm"
                className="w-full pl-9 pr-3 py-2 bg-wood-950/90 border-2 border-amber-800/80 rounded-lg text-sm text-parchment-100 placeholder-stone-500 font-garamond focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-cinzel font-bold text-amber-200 uppercase tracking-wider mb-1" htmlFor="tavern-password">
              Secret Cipher (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-600/80 absolute left-3 top-3" />
              <input 
                id="tavern-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-wood-950/90 border-2 border-amber-800/80 rounded-lg text-sm text-parchment-100 placeholder-stone-500 font-garamond focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full wax-seal py-3 px-4 rounded-xl border-2 border-amber-400 shadow-2xl font-cinzel font-bold text-sm text-[#faecd1] tracking-wider uppercase transition-all disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            {loading ? 'Consulting archives...' : isSignUp ? 'Inscribe & Begin Journey' : 'Enter the Tabletop'}
          </button>
        </form>

        {/* Toggle Login / Signup */}
        <div className="mt-4 pt-3 border-t border-amber-900/60 flex items-center justify-between text-xs font-cinzel">
          <span className="text-stone-400">
            {isSignUp ? 'Already registered?' : 'New traveler in town?'}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            className="text-amber-400 hover:text-amber-200 font-bold underline decoration-amber-600 focus:outline-none"
          >
            {isSignUp ? 'Switch to Login' : 'Create New Character'}
          </button>
        </div>

        {/* Demo Mode Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              onGuestMode?.();
              onClose();
            }}
            className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-lg text-xs font-cinzel border border-amber-800/60 flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Continue as Guest Hero (Instant Demo)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
