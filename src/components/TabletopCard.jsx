import React from 'react';

/**
 * Universal Card Component for Tavern Hearth Tabletop
 * Replicates the exact Forest Guardian / Knight Protector card construction from Stitch MCP.
 * 
 * Features:
 * - Thick textured gold frame with 4 leaf-scroll corner flourishes
 * - Inner contour relief bevel (#573911 / #e8c67c)
 * - Deep inset dark brown name plaque
 * - Painterly art panel (~60% height) with inner vignette overlay and category/status badges
 * - Exact 4-segment stat bar:
 *     Column 1: Sword = Strength
 *     Column 2: Book = Intellect
 *     Column 3: Shield = Discipline
 *     Column 4: Spiral = Willpower
 */

const LeafCorner = ({ positionClass, transformClass = '' }) => (
  <svg 
    className={`absolute ${positionClass} w-5 h-5 text-[#fae19a] drop-shadow z-20 pointer-events-none ${transformClass}`} 
    fill="currentColor" 
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M3 3h8c-2 1-3.5 3-4 6-1-1.5-2.5-3-4-3v-3zm0 0v8c1-2 3-3.5 6-4-1.5-1-3-2.5-3-4h-3zM7 7c1.5.5 3 2 3.5 3.5-.5-1.5-2-3-3.5-3.5z" />
  </svg>
);

export default function TabletopCard({
  name,
  category,
  imageSrc,
  imageFilterClass = '',
  categoryBadge,
  statusBadge,
  bountyBadge,
  onClick,
  isPlayer = false,
  isGreyedOut = false,
  className = ''
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative text-left w-full guardian-card-frame p-2 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer ${
        isGreyedOut ? 'card-inactive-grey' : ''
      } ${className}`}
      aria-label={`Inspect ${name} (${category || 'Player'})${isGreyedOut ? ' - Defeated (0 Active Tasks)' : ''}`}
    >
      {/* 4 Corner Leaf-Scroll Flourishes (Stitch SVGs) */}
      <LeafCorner positionClass="top-1 left-1" />
      <LeafCorner positionClass="top-1 right-1" transformClass="transform scale-x-[-1]" />
      <LeafCorner positionClass="bottom-1 left-1" transformClass="transform scale-y-[-1]" />
      <LeafCorner positionClass="bottom-1 right-1" transformClass="transform scale-[-1]" />

      {/* Inner Relief Contour */}
      <div className="guardian-inner-contour p-1.5 rounded-lg bg-[#b5873d]/40 flex flex-col space-y-1.5 h-full justify-between">
        
        {/* Top Dark Inset Name Plaque */}
        <div className="guardian-dark-inset rounded-md py-1.5 px-2 text-center">
          <h4 className="font-garamond font-bold text-sm sm:text-base text-[#faecd1] tracking-wide leading-none drop-shadow truncate">
            {name}
          </h4>
        </div>

        {/* Art Area: High-contrast Painterly Artwork */}
        <div className={`relative w-full ${isPlayer ? 'h-64 sm:h-76' : 'h-48 sm:h-56'} rounded-sm overflow-hidden border border-[#523712] shadow-inner bg-stone-900 flex items-center justify-center`}>
          <img 
            src={imageSrc} 
            alt={name}
            className={`w-full h-full object-cover object-center ${imageFilterClass || 'brightness-95 contrast-105'} group-hover:scale-105 transition-transform duration-300`}
            loading="lazy"
          />
          
          {/* Ambient Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#100b06]/85 via-transparent to-[#100b06]/40 pointer-events-none" />

          {/* Top-Left Category Badge */}
          {categoryBadge && (
            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/75 text-amber-300 font-cinzel text-[9px] rounded border border-amber-500/50 shadow">
              {categoryBadge}
            </div>
          )}

          {/* Bottom-Left Bounty Badge */}
          {bountyBadge && (
            <div className={`absolute bottom-1.5 left-1.5 px-1.5 py-0.5 font-cinzel text-[8px] sm:text-[9px] font-bold rounded border shadow flex items-center gap-1 ${
              bountyBadge.includes('Claimed')
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60'
                : 'bg-amber-950/90 text-amber-300 border-amber-500/60'
            }`}>
              <span>{bountyBadge}</span>
            </div>
          )}

          {/* Bottom-Right Active Tasks or Status Badge */}
          {statusBadge && (
            <div className={`absolute bottom-1.5 right-1.5 px-1.5 py-0.5 font-cinzel text-[9px] rounded border shadow ${
              isGreyedOut 
                ? 'bg-amber-950/90 text-amber-300 border-amber-500/60 font-bold' 
                : 'bg-black/75 text-amber-200 border-stone-600'
            }`}>
              {statusBadge}
            </div>
          )}
        </div>

      </div>
    </button>
  );
}
