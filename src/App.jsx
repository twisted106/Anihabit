import React from 'react';
import { Shield, Flame, BookOpen, Dumbbell, Sparkles, AlertCircle } from 'lucide-react';
import { CATEGORIES } from './constants/gameConfig';

export default function App() {
  return (
    <div className="min-h-screen bg-rpg-dark text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-rpg-border bg-rpg-panel/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-glow-intellect">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-fantasy text-xl font-bold tracking-wider text-white">LIFE RPG</h1>
            <p className="text-xs text-slate-400">Phase 1: Environment & Engine Scaffolded</p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        <div className="rpg-panel p-6 border-indigo-500/30">
          <h2 className="font-fantasy text-lg font-bold text-indigo-300 mb-2">Phase 1 Initialized Successfully</h2>
          <p className="text-sm text-slate-300">
            Tailwind CSS, Google Fonts (Cinzel & Plus Jakarta Sans), Supabase client, and game engine configurations are ready.
          </p>
        </div>

        {/* Categories Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <div key={key} className={`rpg-card p-4 border ${cat.badgeClass}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{cat.arenaBoss.emoji}</span>
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/40">
                  {cat.statLabel}
                </span>
              </div>
              <h3 className="font-bold text-white text-base">{cat.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{cat.arenaBoss.name}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
