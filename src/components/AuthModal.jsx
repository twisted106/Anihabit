/**
 * @file AuthModal.jsx
 * @description Accessible modal dialog for Supabase email/password authentication and Demo mode access.
 */

import React, { useState } from 'react';
import { X, Shield, Lock, Mail, Sparkles, AlertTriangle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AuthModal({ isOpen, onClose, onDemoAccess, notify }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMsg('Supabase URL/Key is not configured in .env. Use Demo Hero mode to explore!');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        if (data?.user) {
          notify('Account forged! Check your email or sign in directly.', 'success', '🛡️');
          onClose();
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data?.user) {
          notify(`Welcome back, Hero ${email.split('@')[0]}!`, 'success', '⚔️');
          onClose();
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="rpg-panel max-w-md w-full p-6 sm:p-8 relative border-indigo-500/40 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close authentication window"
          className="rpg-btn absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 mx-auto flex items-center justify-center mb-3 text-indigo-400 shadow-glow-intellect">
            <Shield className="w-6 h-6" />
          </div>
          <h2 id="auth-modal-title" className="font-fantasy text-2xl font-bold text-white tracking-wide">
            {isSignUp ? 'Forge Your Hero' : 'Hero Sign In'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSignUp ? 'Begin your life progression under the Reincarnation covenant' : 'Resume your journey and fortify your attributes'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-700/50 text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Hero Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hero@kingdom.realm"
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-rpg-dark border border-rpg-border rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Secret Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-rpg-dark border border-rpg-border rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="rpg-btn w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-glow-intellect transition-all"
          >
            {loading ? 'Communing with Realm...' : isSignUp ? 'Create Hero Profile' : 'Enter the Realm'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-medium"
          >
            {isSignUp ? 'Already registered? Return to Sign In' : "Don't have a hero yet? Create Account"}
          </button>
        </div>

        {/* Instant Demo Hero Access */}
        <div className="mt-6 pt-4 border-t border-rpg-border text-center">
          <button
            type="button"
            onClick={() => {
              if (onDemoAccess) onDemoAccess();
              onClose();
              notify('Exploring in Demo Hero Mode! All RPG mechanics are interactive.', 'info', '🎮');
            }}
            className="rpg-btn w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Instant Demo Access (No Account Required)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
