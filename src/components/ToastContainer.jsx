/**
 * @file ToastContainer.jsx
 * @description Renders reactive floating toast notifications for level ups, coin gains, errors, and alerts.
 */

import React from 'react';

export default function ToastContainer({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <aside 
      aria-label="Game Notifications" 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
    >
      {toasts.map((toast) => {
        let borderClass = 'border-indigo-500/50 text-slate-100 bg-slate-900/95';
        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/60 text-emerald-100 bg-emerald-950/95 shadow-glow-discipline';
        } else if (toast.type === 'danger') {
          borderClass = 'border-rose-500/70 text-rose-100 bg-rose-950/95 shadow-glow-strength animate-shake';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/60 text-amber-100 bg-amber-950/95 shadow-glow-gold';
        } else if (toast.type === 'gold') {
          borderClass = 'border-amber-400/80 text-amber-200 bg-amber-950/95 shadow-glow-gold';
        }

        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md transition-all duration-200 animate-fadeIn ${borderClass}`}
          >
            <span className="text-xl shrink-0" aria-hidden="true">{toast.icon || '✨'}</span>
            <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
              {toast.message}
            </div>
          </div>
        );
      })}
    </aside>
  );
}
