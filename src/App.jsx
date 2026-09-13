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
import CustomizeProfileModal from './components/CustomizeProfileModal';
import ToastContainer from './components/ToastContainer';

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
    equippedLeaderboardEffect,
    claimedBossesThisCycle,
    currentCycleId,

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
    buyShopItem,
    toggleEquipItem,
    fetchLeaderboard,
    updateProfile,

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

  // Challenge Modal Target Type ('task' | 'habit')
  const [challengeModalType, setChallengeModalType] = useState('task');

  // Profile Customization Modal State
  const [isCustomizeProfileModalOpen, setIsCustomizeProfileModalOpen] = useState(false);

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
    <div className="min-h-screen bg-[#120803] text-[#faecd1] font-garamond flex flex-col selection:bg-amber-800 selection:text-amber-100 antialiased pb-6 sm:pb-8 relative">
      
      {/* Main Full-Screen Background Image for Game View (Task / Habit) Section */}
      {activeTab === 'gameview' && (
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(14, 7, 3, 0.45), rgba(10, 5, 2, 0.35), rgba(14, 7, 3, 0.6)), url('/images/task_habit_bg.jpg')`
          }}
          aria-hidden="true"
        />
      )}

      {/* Main Full-Screen Background Image for Leaderboard Section */}
      {activeTab === 'leaderboard' && (
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(14, 7, 3, 0.45), rgba(10, 5, 2, 0.35), rgba(14, 7, 3, 0.6)), url('/images/leaderboard_bg.png')`
          }}
          aria-hidden="true"
        />
      )}

      {/* Main Full-Screen Background Image for Dashboard Section */}
      {activeTab === 'dashboard' && (
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(14, 7, 3, 0.45), rgba(10, 5, 2, 0.35), rgba(14, 7, 3, 0.6)), url('/images/dashboard_bg.jpg')`
          }}
          aria-hidden="true"
        />
      )}

      {/* Main Full-Screen Background Image for Shop Section */}
      {activeTab === 'shop' && (
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(14, 7, 3, 0.45), rgba(10, 5, 2, 0.35), rgba(14, 7, 3, 0.6)), url('/images/shop_bg.jpg')`
          }}
          aria-hidden="true"
        />
      )}

      {/* 1. Desktop & Tablet Top Navigation Header with 4 Medallions */}
      <Navbar 
        activeTab={activeTab}
        onSwitchTab={handleTabSwitch}
        sessionUser={sessionUser}
        isDemoMode={isDemoMode}
        profile={profile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCustomizeProfile={() => setIsCustomizeProfileModalOpen(true)}
        onSignOut={signOut}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      {/* 2. Main Tabletop Workspace (Renders the Selected Screen) */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 relative z-10">
        
        {/* SCREEN 2 — Game View (Default Tabletop Landing) */}
        {activeTab === 'gameview' && (
          <GameView 
            profile={profile}
            stats={stats}
            tasks={tasks}
            habits={habits}
            claimedBossesThisCycle={claimedBossesThisCycle}
            currentCycleId={currentCycleId}
            onInspectCard={(card) => setInspectedCard(card)}
            onOpenAddChallenge={(type = 'task') => {
              setChallengeModalType(type);
              setIsCreateTaskModalOpen(true);
            }}
            onOpenTradeoffModal={() => setIsTradeoffModalOpen(true)}
            onCompleteHabit={completeHabit}
            onDeleteHabit={deleteHabit}
            onOpenCustomizeProfile={() => setIsCustomizeProfileModalOpen(true)}
          />
        )}

        {/* SCREEN 5 — Dashboard (Player-Only Character Sheet View) */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            profile={profile}
            stats={stats}
            habits={habits}
            onOpenCustomizeProfile={() => setIsCustomizeProfileModalOpen(true)}
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
            equippedLeaderboardEffect={equippedLeaderboardEffect}
          />
        )}

      </main>

      {/* 3. MODALS & OVERLAYS */}

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
        claimedBossesThisCycle={claimedBossesThisCycle}
        currentCycleId={currentCycleId}
        onClose={() => setInspectedCard(null)}
        onCompleteTask={completeTask}
        onFailTask={failTask}
        onOpenCustomizeProfile={() => setIsCustomizeProfileModalOpen(true)}
      />

      {/* SCREEN 4 — Add Challenge Flow Modal */}
      <AddChallengeModal 
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        targetType={challengeModalType}
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

      {/* Profile & Avatar Customization Modal */}
      <CustomizeProfileModal 
        isOpen={isCustomizeProfileModalOpen}
        onClose={() => setIsCustomizeProfileModalOpen(false)}
        profile={profile}
        onUpdateProfile={updateProfile}
        notify={notify}
      />

      {/* Combat Log Toasts */}
      <ToastContainer toasts={toasts} />

    </div>
  );
}
