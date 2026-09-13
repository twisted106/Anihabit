/**
 * @file App.jsx
 * @description Authoritative Frontend Hub for Life RPG (Amplify)
 * Strictly conforms to the 'Tavern Hearth Tabletop' design system and the 8 core screens:
 * - SCREEN 1: Auth (Login / Signup Modal)
 * - SCREEN 2: Game View (The Tabletop Arena, default landing)
 * - SCREEN 3: Card Detail / Expanded Modal (Inspect any card + task checklist)
 * - SCREEN 4: Add Challenge Flow Modal (2-step category selection + form)
 * - SCREEN 5: Dashboard (Player-only character sheet detail view)
 * - SCREEN 6: Shop (Market stall cosmetic bazaar)
 * - SCREEN 7: Leaderboard (Ranked list by average stat power)
 * - SCREEN 8: Crisis Trade-Off Modal (100% Reincarnation Pressure Dilemma)
 */

import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import Navbar from './components/Navbar';
import GameView from './components/GameView';
import DashboardView from './components/DashboardView';
import ShopView from './components/ShopView';
import LeaderboardView from './components/LeaderboardView';
import CardDetailModal from './components/CardDetailModal';
import AddChallengeModal from './components/AddChallengeModal';
import CrisisModal from './components/CrisisModal';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';
import { Trophy, Shield, Scroll, ShoppingBag } from 'lucide-react';

export default function App() {
  const {
    sessionUser,
    isDemoMode,
    setIsDemoMode,
    profile,
    stats,
    tasks,
    habits,
    shopItems,
    userInventory,
    leaderboard,
    powerScore,
    xpNeeded,
    equippedTitle,
    equippedFrame,

    // Actions
    signOut,
    createTask,
    completeTask,
    failTask,
    deleteTask,
    fetchHabits,
    createHabit,
    deleteHabit,
    completeHabit,
    checkInHabit,
    resolveTradeoff,
    adjustReincarnationPressure,
    buyShopItem,
    toggleEquipItem,
    fetchLeaderboard,

    // Modals & Notifications
    isAuthModalOpen,
    setIsAuthModalOpen,
    isCreateTaskModalOpen,
    setIsCreateTaskModalOpen,
    isTradeoffModalOpen,
    setIsTradeoffModalOpen,
    toasts,
    notify
  } = useGameState();

  // Active Screen View: 'gameview' (default), 'dashboard', 'shop', 'leaderboard'
  const [activeTab, setActiveTab] = useState('gameview');
  
  // Inspected Card State (SCREEN 3 Card Detail Modal)
  const [inspectedCard, setInspectedCard] = useState(null);

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);

  // Auto-trigger Crisis Trade-Off Modal when reincarnation pressure hits 100%
  useEffect(() => {
    if (profile?.reincarnation_meter >= 100 && !isTradeoffModalOpen) {
      setIsTradeoffModalOpen(true);
      notify?.('Reincarnation Pressure reached 100%! A tribute must be chosen!', 'danger');
    }
  }, [profile?.reincarnation_meter, isTradeoffModalOpen, setIsTradeoffModalOpen, notify]);

  const handleTabSwitch = (tabName) => {
    if (tabName === 'leaderboard') {
      fetchLeaderboard();
    }
    setActiveTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-[#120803] text-[#faecd1] font-garamond flex flex-col selection:bg-amber-800 selection:text-amber-100 antialiased pb-20 sm:pb-8">
      
      {/* 1. Desktop & Tablet Top Navigation Header with 4 Medallions */}
      <Navbar 
        activeTab={activeTab}
        onSwitchTab={handleTabSwitch}
        sessionUser={sessionUser}
        isDemoMode={isDemoMode}
        profile={profile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={signOut}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      {/* 2. Main Tabletop Workspace (Renders the Selected Screen) */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 relative">
        
        {/* SCREEN 2 — Game View (Default Tabletop Landing) */}
        {activeTab === 'gameview' && (
          <GameView 
            profile={profile}
            stats={stats}
            tasks={tasks}
            habits={habits}
            onInspectCard={(card) => setInspectedCard(card)}
            onOpenAddChallenge={() => setIsCreateTaskModalOpen(true)}
            onOpenTradeoffModal={() => setIsTradeoffModalOpen(true)}
            onAdjustPressure={adjustReincarnationPressure}
            onCompleteHabit={completeHabit}
            onDeleteHabit={deleteHabit}
          />
        )}

        {/* SCREEN 5 — Dashboard (Player-Only Character Sheet View) */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            profile={profile}
            stats={stats}
            habits={habits}
            equippedTitle={equippedTitle}
          />
        )}

        {/* SCREEN 6 — Shop (Market Stall Bazaar View) */}
        {activeTab === 'shop' && (
          <ShopView 
            coinBalance={profile?.coin_balance ?? 0}
            shopItems={shopItems}
            userInventory={userInventory}
            onBuyItem={buyShopItem}
            onToggleEquip={toggleEquipItem}
          />
        )}

        {/* SCREEN 7 — Leaderboard (Simple Ranked List View) */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView 
            leaderboard={leaderboard}
            currentUserId={sessionUser?.id}
            powerScore={powerScore}
          />
        )}

      </main>

      {/* 3. Mobile Fixed Bottom Navigation Bar (4 Circular Medallions) */}
      <nav 
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#160b05] via-[#201007] to-[#2b170c] border-t-2 border-amber-800/80 px-4 py-2 flex items-center justify-around shadow-[0_-8px_20px_rgba(0,0,0,0.9)]"
        aria-label="Mobile Navigation"
      >
        {/* Leaderboard Medallion */}
        <button
          type="button"
          onClick={() => handleTabSwitch('leaderboard')}
          className="flex flex-col items-center focus:outline-none"
          aria-label="Leaderboard"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-transform ${
            activeTab === 'leaderboard' ? 'bg-amber-600 border-yellow-200 scale-110 shadow-lg' : 'bg-stone-900 border-amber-900 text-stone-400'
          }`}>
            <Trophy className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-[9px] font-cinzel font-bold text-amber-300/90 mt-0.5">Rank</span>
        </button>

        {/* Dashboard Medallion */}
        <button
          type="button"
          onClick={() => handleTabSwitch('dashboard')}
          className="flex flex-col items-center focus:outline-none"
          aria-label="Player Sheet"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-transform ${
            activeTab === 'dashboard' ? 'bg-emerald-700 border-emerald-300 scale-110 shadow-lg' : 'bg-stone-900 border-amber-900 text-stone-400'
          }`}>
            <Shield className="w-4 h-4 text-emerald-300" />
          </div>
          <span className="text-[9px] font-cinzel font-bold text-emerald-300/90 mt-0.5">Hero</span>
        </button>

        {/* Habit / Task (Game View) Medallion */}
        <button
          type="button"
          onClick={() => handleTabSwitch('gameview')}
          className="flex flex-col items-center focus:outline-none"
          aria-label="Tabletop Game View"
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-transform ${
            activeTab === 'gameview' ? 'bg-amber-500 border-yellow-100 scale-115 shadow-[0_0_12px_rgba(245,180,40,0.8)]' : 'bg-stone-900 border-amber-900 text-stone-400'
          }`}>
            <Scroll className="w-5 h-5 text-[#faecd1]" />
          </div>
          <span className="text-[9px] font-cinzel font-black text-amber-300 mt-0.5">Arena</span>
        </button>

        {/* Shop Medallion */}
        <button
          type="button"
          onClick={() => handleTabSwitch('shop')}
          className="flex flex-col items-center focus:outline-none"
          aria-label="Shop"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-transform ${
            activeTab === 'shop' ? 'bg-purple-700 border-purple-300 scale-110 shadow-lg' : 'bg-stone-900 border-amber-900 text-stone-400'
          }`}>
            <ShoppingBag className="w-4 h-4 text-purple-300" />
          </div>
          <span className="text-[9px] font-cinzel font-bold text-purple-300/90 mt-0.5">Bazaar</span>
        </button>
      </nav>

      {/* 4. MODALS & OVERLAYS */}

      {/* SCREEN 1 — Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onGuestMode={() => setIsDemoMode(true)}
        notify={notify}
      />

      {/* SCREEN 3 — Card Expanded / Detail Modal */}
      <CardDetailModal 
        card={inspectedCard}
        tasks={tasks}
        sessionUser={sessionUser}
        isDemoMode={isDemoMode}
        profile={profile}
        onClose={() => setInspectedCard(null)}
        onCompleteTask={completeTask}
        onFailTask={failTask}
      />

      {/* SCREEN 4 — Add Challenge Flow Modal */}
      <AddChallengeModal 
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onCreateTask={createTask}
        onCreateHabit={createHabit}
      />

      {/* SCREEN 8 — Crisis Trade-Off Modal (Forced at 100% Pressure) */}
      <CrisisModal 
        isOpen={isTradeoffModalOpen}
        stats={stats}
        coinBalance={profile?.coin_balance ?? 0}
        onResolveTradeoff={resolveTradeoff}
      />

      {/* Combat Log Toasts */}
      <ToastContainer toasts={toasts} />

    </div>
  );
}
