import React from 'react';
import { ShoppingBag, Check, Sparkles, Coins } from 'lucide-react';

/**
 * SCREEN 6 — Shop (Market Stall Layout)
 * Styled like stalls / wares laid out on an authentic tavern market table:
 * - Grid of cosmetic item cards (titles, avatar frames, badges)
 * - Shows item art / icon, name, coin cost
 * - Buy button if unowned
 * - 'Equipped / Unequip' toggle if already owned
 */
export default function ShopView({
  coinBalance = 0,
  shopItems = [],
  userInventory = [],
  onBuyItem,
  onToggleEquip
}) {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6" data-purpose="screen-shop">
      
      {/* Market Stall Canopy Header */}
      <div className="carved-plaque px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border-2 border-amber-700/80 shadow-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 border border-amber-800 shadow shrink-0">
            <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="font-cinzel font-black text-sm sm:text-base md:text-lg text-amber-200 tracking-wider uppercase drop-shadow truncate">
              The Tavern Bazaar & Merchant Stall
            </h2>
            <p className="text-[11px] sm:text-xs font-newsreader text-stone-300 italic">
              Adorn your Guild Leaderboard row with prestigious cosmetic borders forged from your daily habit coins
            </p>
          </div>
        </div>

        {/* Live Coin Purse in Header */}
        <div className="flex items-center space-x-2 bg-wood-950/90 border border-amber-600/70 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-inner shrink-0">
          <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-[9px] sm:text-[10px] font-cinzel text-amber-400/80 uppercase leading-none">Your Wealth</div>
            <div className="text-xs sm:text-sm font-cinzel font-black text-amber-300 leading-tight">{coinBalance} GP</div>
          </div>
        </div>
      </div>

      {/* Grid of Merchant Wares / Item Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shopItems.map((item) => {
          const inventoryRecord = userInventory.find(inv => inv.item_id === item.id);
          const isOwned = Boolean(inventoryRecord);
          const isEquipped = Boolean(inventoryRecord?.is_equipped);
          const canAfford = coinBalance >= item.cost;
          const borderClass = item.cssClass || (
            item.id === 'border_iron_band' ? 'leaderboard-border-iron' :
            item.id === 'border_bronze_sigil' ? 'leaderboard-border-bronze' :
            item.id === 'border_ember_rune' ? 'leaderboard-border-ember' : ''
          );

          // Tier badge colors
          const tierClass = item.tier === 'Legendary' 
            ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
            : item.tier === 'Rare'
            ? 'bg-amber-900/60 border-amber-600 text-amber-200'
            : 'bg-stone-900 border-stone-600 text-stone-300';

          return (
            <div 
              key={item.id}
              className="guardian-card-frame p-3.5 bg-wood-planks/95 border-3 border-[#201308] shadow-[0_12px_35px_rgba(0,0,0,0.9)] relative flex flex-col justify-between"
            >
              <div>
                {/* Item Tier & Status Tag */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-cinzel font-bold px-2 py-0.5 rounded border uppercase ${tierClass}`}>
                      {item.tier || 'Cosmetic'}
                    </span>
                  </div>

                  {isEquipped && (
                    <span className="text-[10px] font-cinzel font-bold px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-500/60 flex items-center gap-1 shadow">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Equipped</span>
                    </span>
                  )}
                </div>

                {/* Item Art Panel with Live Leaderboard Preview */}
                <div className="w-full h-36 rounded-md bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-[#523712] flex flex-col items-center justify-center p-3 shadow-inner relative overflow-hidden mb-3">
                  <div className="text-3xl mb-2 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    {item.icon}
                  </div>
                  
                  {/* Visual Live Preview of Row Border */}
                  <div className={`w-full max-w-[210px] py-1.5 px-2.5 bg-stone-950/90 flex items-center justify-between text-[11px] font-cinzel shadow ${borderClass}`}>
                    <span className="text-amber-200 font-bold truncate">#1 Hero (You)</span>
                    <span className="text-amber-400 font-bold text-[10px]">PWR 45.0</span>
                  </div>
                  <div className="text-[9px] font-cinzel text-stone-400 mt-1 uppercase tracking-wider">
                    Live Leaderboard Preview
                  </div>
                </div>

                {/* Item Title & Description */}
                <div className="guardian-dark-inset p-2 rounded text-center mb-2">
                  <h3 className="font-garamond font-bold text-base text-[#faecd1] leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[11px] font-newsreader text-amber-300/80 italic mt-0.5 line-clamp-2">
                    {item.description || 'A prized cosmetic artifact forged by guild artisans.'}
                  </p>
                </div>
              </div>

              {/* Action Strip: Price & Buy / Equip Button */}
              <div className="mt-3 pt-2 border-t border-amber-900/60 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-cinzel font-bold text-sm text-amber-300">
                    {isOwned ? 'Owned' : `${item.cost} GP`}
                  </span>
                </div>

                {isOwned ? (
                  <button
                    type="button"
                    onClick={() => onToggleEquip(item.id)}
                    className={`min-h-[40px] px-3.5 py-2 rounded-lg font-cinzel text-xs font-bold border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                      isEquipped 
                        ? 'bg-emerald-900/80 hover:bg-emerald-800 border-emerald-400 text-emerald-100 shadow'
                        : 'bg-amber-950/90 hover:bg-amber-900 border-amber-500/70 text-amber-200'
                    }`}
                  >
                    {isEquipped ? 'Unequip' : 'Equip Border'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onBuyItem(item)}
                    disabled={!canAfford}
                    className={`min-h-[40px] px-4 py-2 rounded-lg font-cinzel text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                      canAfford 
                        ? 'bg-amber-700 hover:bg-amber-600 text-amber-100 border-yellow-300 shadow-lg active:scale-95'
                        : 'bg-stone-900 border-stone-800 text-stone-500 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Purchase</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
