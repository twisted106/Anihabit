/**
 * @file App.jsx
 * @description Main dashboard hub for the Life RPG application.
 * Unifies character progression, reincarnation danger gauge, categorized quests,
 * habit streaks, cosmetic arena, and coin economy on a single accessible screen.
 */

import React from 'react';
import { useGameState } from './hooks/useGameState';
import Navbar from './components/Navbar';
import CharacterPanel from './components/CharacterPanel';
import TaskBoard from './components/TaskBoard';
import HabitBoard from './components/HabitBoard';
import ArenaView from './components/ArenaView';
import TradeoffModal from './components/TradeoffModal';
import CreateTaskModal from './components/CreateTaskModal';
import ShopModal from './components/ShopModal';
import LeaderboardModal from './components/LeaderboardModal';
import AuthModal from './components/AuthModal';
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
    equippedTitle,
    equippedFrame,

    // Actions
    createTask,
    completeTask,
    deleteTask,
    createHabit,
    checkInHabit,
    resolveTradeoff,
    buyShopItem,
    toggleEquipItem,
    fetchLeaderboard,

    // Modals & Alerts
    isAuthModalOpen,
    setIsAuthModalOpen,
    isCreateTaskModalOpen,
    setIsCreateTaskModalOpen,
    isShopModalOpen,
    setIsShopModalOpen,
    isLeaderboardModalOpen,
    setIsLeaderboardModalOpen,
    isTradeoffModalOpen,
    setIsTradeoffModalOpen,
    toasts,
    notify
  } = useGameState();

  return (
    <div className="min-h-screen bg-rpg-dark text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white antialiased">
      {/* Top Navigation */}
      <Navbar
        sessionUser={sessionUser}
        isDemoMode={isDemoMode}
        equippedTitle={equippedTitle}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenShop={() => setIsShopModalOpen(true)}
        onOpenLeaderboard={() => {
          fetchLeaderboard();
          setIsLeaderboardModalOpen(true);
        }}
        notify={notify}
      />

      {/* Main Single-Screen Dashboard Hub */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* 1. Character Panel & Global Reincarnation Danger Bar (Top Region) */}
        <CharacterPanel
          profile={profile}
          stats={stats}
          powerScore={powerScore}
          xpNeeded={xpNeeded}
          equippedTitle={equippedTitle}
          equippedFrame={equippedFrame}
        />

        {/* 2. The Arena (Cosmetic Guardians & Auras) */}
        <ArenaView stats={stats} />

        {/* 3. The Core Productivity Engines: Tasks & Habits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Categorized Task Matrix Board (One-off Tasks) */}
          <div className="lg:col-span-7">
            <TaskBoard
              tasks={tasks}
              onCompleteTask={completeTask}
              onDeleteTask={deleteTask}
              onOpenCreateModal={() => setIsCreateTaskModalOpen(true)}
            />
          </div>

          {/* Habit Forge (Recurring Streaks & Coin Escalation) */}
          <div className="lg:col-span-5">
            <HabitBoard
              habits={habits}
              onCheckInHabit={checkInHabit}
              onCreateHabit={createHabit}
            />
          </div>
        </div>
      </main>

      {/* Footer / System Status */}
      <footer className="border-t border-rpg-border bg-rpg-panel/80 py-6 px-4 text-center text-xs text-slate-400 space-y-1">
        <p className="font-fantasy tracking-wider text-slate-300">
          LIFE RPG — Gamified Real-World Progression Engine
        </p>
        <p className="text-[11px] text-slate-500">
          Built with React, Tailwind CSS, Supabase PostgreSQL, and Web Audio API • Tab-navigable & Fully Accessible
        </p>
      </footer>

      {/* Modals & Dialogs */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onCreateTask={createTask}
      />

      <ShopModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
        coinBalance={profile.coin_balance}
        shopItems={shopItems}
        userInventory={userInventory}
        onBuyItem={buyShopItem}
        onToggleEquipItem={toggleEquipItem}
      />

      <LeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={() => setIsLeaderboardModalOpen(false)}
        leaderboard={leaderboard}
        onRefresh={fetchLeaderboard}
        currentUserId={sessionUser?.id}
      />

      <TradeoffModal
        isOpen={isTradeoffModalOpen}
        stats={stats}
        coinBalance={profile.coin_balance}
        onResolveTradeoff={resolveTradeoff}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onDemoAccess={() => setIsDemoMode(true)}
        notify={notify}
      />

      {/* Floating Reactive Alerts */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
