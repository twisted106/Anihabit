/**
 * @file ShopModal.jsx
 * @description Accessible modal for purchasing cosmetic items (titles, frames, badges) using gold coins earned from habits.
 */

import React, { useState } from 'react';
import { X, ShoppingBag, Coins, Sparkles, Check, Shield, Award } from 'lucide-react';

export default function ShopModal({
  isOpen,
  onClose,
  coinBalance,
  shopItems,
  userInventory,
  onBuyItem,
  onToggleEquipItem
}) {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'inventory'

  if (!isOpen) return null;

  const isItemOwned = (itemId) => userInventory.some((inv) => inv.item_id === itemId);
  const isItemEquipped = (itemId) => userInventory.some((inv) => inv.item_id === itemId && inv.is_equipped);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shop-modal-title"
    >
      <div className="rpg-panel max-w-2xl w-full p-6 sm:p-7 relative border-amber-500/40 shadow-glow-gold/30 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cosmetic shop"
          className="rpg-btn absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Balance Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rpg-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-glow-gold/40">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shop-modal-title" className="font-fantasy text-xl font-bold text-white tracking-wide">
                Cosmetics Bazaar
              </h2>
              <p className="text-xs text-slate-400">
                Titles, avatar frames, and badges (zero effect on leaderboard)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-black/50 border border-amber-500/40 px-3.5 py-1.5 rounded-xl self-start sm:self-auto shadow-sm">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-sm font-bold text-amber-300">
              {coinBalance} <span className="text-xs font-normal text-amber-400">Coins</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 py-3 border-b border-rpg-border text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`rpg-btn px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'catalog'
                ? 'bg-amber-600/30 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Item Catalog ({shopItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`rpg-btn px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'inventory'
                ? 'bg-amber-600/30 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hero Inventory ({userInventory.length})
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 scrollbar-thin">
          {activeTab === 'catalog' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shopItems.map((item) => {
                const owned = isItemOwned(item.id);
                const canAfford = coinBalance >= item.cost;

                return (
                  <div
                    key={item.id}
                    className={`rpg-card p-4 flex flex-col justify-between gap-3 border ${
                      owned 
                        ? 'border-emerald-800/40 bg-emerald-950/10' 
                        : 'border-rpg-border hover:border-amber-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-2xl select-none" role="img" aria-label={item.name}>
                          {item.icon}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-rpg-border">
                          {item.category.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="font-fantasy text-sm font-bold text-white">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-rpg-border/60 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-300 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>{item.cost} Coins</span>
                      </span>

                      {owned ? (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Owned</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onBuyItem(item)}
                          disabled={!canAfford}
                          className={`rpg-btn px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            canAfford
                              ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-glow-gold'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Acquire
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Inventory Tab
            userInventory.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No items in inventory. Complete daily habits to earn coins and purchase titles and frames!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userInventory.map((inv) => {
                  const item = shopItems.find((i) => i.id === inv.item_id);
                  if (!item) return null;
                  const equipped = inv.is_equipped;

                  return (
                    <div
                      key={inv.item_id}
                      className={`rpg-card p-4 flex flex-col justify-between gap-3 border ${
                        equipped ? 'border-indigo-500/60 shadow-glow-intellect/30' : 'border-rpg-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h3 className="font-fantasy text-sm font-bold text-white">{item.name}</h3>
                          <span className="text-[10px] uppercase text-slate-400">{item.category.replace('_', ' ')}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-rpg-border/60 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {equipped ? <strong className="text-indigo-400">Active Gear</strong> : 'Stored'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleEquipItem(item.id)}
                          className={`rpg-btn px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            equipped
                              ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-700/50'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-intellect'
                          }`}
                        >
                          {equipped ? 'Unequip' : 'Equip Gear'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
