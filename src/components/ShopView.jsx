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
      <div className="carved-plaque px-6 py-3 rounded-xl border-2 border-amber-700/80 shadow-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 border border-amber-800 shadow">
            <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h2 className="font-cinzel font-black text-base sm:text-lg text-amber-200 tracking-wider uppercase drop-shadow">
              The Tavern Bazaar & Merchant Stall
            </h2>
            <p className="text-xs font-newsreader text-stone-300 italic">
              Adorn your champion with illustrious cosmetics forged from your daily habit coins
            </p>
          </div>
        </div>

        {/* Live Coin Purse in Header */}
        <div className="flex items-center space-x-2 bg-wood-950/90 border border-amber-600/70 px-4 py-2 rounded-xl shadow-inner">
          <span className="text-lg">🪙</span>
          <div>
            <div className="text-[10px] font-cinzel text-amber-400/80 uppercase leading-none">Your Wealth</div>
            <div className="text-sm font-cinzel font-black text-amber-300 leading-tight">{coinBalance} GP</div>
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

          return (
            <div 
              key={item.id}
              className="guardian-card-frame p-3 bg-wood-planks border-3 border-[#201308] relative flex flex-col justify-between"
            >
              <div>
                {/* Item Category Tag */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-cinzel font-bold px-2 py-0.5 rounded bg-black/70 border border-amber-600/60 text-amber-300 uppercase">
                    {item.category.replace('_', ' ')}
                  </span>
                  {isEquipped && (
                    <span className="text-[10px] font-cinzel font-black px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/70 text-emerald-300 flex items-center gap-1 shadow">
                      <Check className="w-3 h-3" />
                      EQUIPPED
                    </span>
                  )}
                </div>

                {/* Item Art Panel */}
                <div className="w-full h-36 rounded-md bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-[#523712] flex flex-col items-center justify-center p-3 shadow-inner relative overflow-hidden mb-3">
                  <div className="text-5xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] transform hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100b06]/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Item Title & Description */}
                <div className="guardian-dark-inset p-2 rounded text-center mb-2">
                  <h3 className="font-garamond font-bold text-base text-[#faecd1] leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[11px] font-newsreader text-amber-300/70 italic mt-0.5 line-clamp-2">
                    {item.description || 'A prized cosmetic artifact forged by guild artisans.'}
                  </p>
                </div>
              </div>

              {/* Action Strip: Price & Buy / Equip Button */}
              <div className="mt-3 pt-2 border-t border-amber-900/60 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm">🪙</span>
                  <span className="font-cinzel font-bold text-sm text-amber-300">
                    {isOwned ? 'Owned' : `${item.cost} GP`}
                  </span>
                </div>

                {isOwned ? (
                  <button
                    type="button"
                    onClick={() => onToggleEquip(item.id)}
                    className={`px-3 py-1.5 rounded-lg font-cinzel text-xs font-bold border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                      isEquipped 
                        ? 'bg-emerald-900/80 hover:bg-emerald-800 border-emerald-400 text-emerald-100 shadow'
                        : 'bg-stone-800 hover:bg-stone-700 border-amber-700/60 text-amber-200'
                    }`}
                  >
                    {isEquipped ? 'Unequip' : 'Equip Gear'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onBuyItem(item)}
                    disabled={!canAfford}
                    className={`px-3.5 py-1.5 rounded-lg font-cinzel text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                      canAfford 
                        ? 'bg-amber-700 hover:bg-amber-600 text-amber-100 border-yellow-300 shadow-lg active:scale-95'
                        : 'bg-stone-900 border-stone-800 text-stone-500 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-yellow-300" />
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
