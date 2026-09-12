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

const SwordIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#f1c97a]" fill="currentColor" viewBox="0 0 24 24" aria-label="Sword Strength">
    <path d="M6.92 5L5 6.92l4.95 4.95-1.41 1.41 1.41 1.41L12 12.63l5.05 5.05c.39.39 1.02.39 1.41 0l.54-.54-2.83-2.83 1.41-1.41 2.83 2.83.54-.54c.39-.39.39-1.02 0-1.41L15.9 8.73 13.83 10.8l-1.41-1.41 1.41-1.41L6.92 5zM3 21l3-1-2-2-1 3z" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#f1c97a]" fill="currentColor" viewBox="0 0 24 24" aria-label="Book Intellect">
    <path d="M18 2H6c-1.2 0-2 .8-2 2v16c0 .55.45 1 1 1 .3 0 .6-.13.8-.35L7 19.4c.56-.45 1.25-.7 1.97-.7H18c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 13.5V5h5.5c.28 0 .5.22.5.5V14c0 .28-.22.5-.5.5H12z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#f1c97a]" fill="currentColor" viewBox="0 0 24 24" aria-label="Shield Discipline">
    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 2.22l6 2.25v4.62c0 3.96-2.61 7.7-6 8.75-3.39-1.05-6-4.79-6-8.75V6.47l6-2.25z" />
  </svg>
);

const SpiralIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#f1c97a]" fill="currentColor" viewBox="0 0 24 24" aria-label="Spiral Willpower">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-3.31-1.61-6.24-4.1-8.04l-1.42 1.42C18.06 6.64 19.3 8.68 19.3 11c0 4.03-3.27 7.3-7.3 7.3S4.7 15.03 4.7 11 7.97 3.7 12 3.7c2.11 0 4.02.9 5.37 2.33l1.42-1.42C17.06 2.87 14.67 2 12 2zm0 4.7c-2.38 0-4.3 1.92-4.3 4.3s1.92 4.3 4.3 4.3 4.3-1.92 4.3-4.3c0-1.19-.48-2.27-1.26-3.04l-1.41 1.41c.42.42.67.99.67 1.63 0 1.27-1.03 2.3-2.3 2.3s-2.3-1.03-2.3-2.3 1.03-2.3 2.3-2.3v-2z" />
  </svg>
);

export default function TabletopCard({
  name,
  category,
  imageSrc,
  imageFilterClass = '',
  categoryBadge,
  statusBadge,
  stats = { strength: 10, intellect: 10, discipline: 10, willpower: 10 },
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
      aria-label={`Inspect ${name} (${category || 'Player'})${isGreyedOut ? ' - 0 Active Tasks (Dormant)' : ''}`}
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
        <div className={`relative w-full ${isPlayer ? 'h-52 sm:h-64' : 'h-40 sm:h-44'} rounded-sm overflow-hidden border border-[#523712] shadow-inner bg-stone-900 flex items-center justify-center`}>
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

          {/* Bottom-Right Active Tasks or Status Badge */}
          {statusBadge && (
            <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/75 text-amber-200 font-cinzel text-[9px] rounded border border-stone-600 shadow">
              {statusBadge}
            </div>
          )}
        </div>

        {/* Stat Bar Footer: Exactly 4 Partitions */}
        <div className="guardian-dark-inset rounded-md py-1.5 px-1 grid grid-cols-4 gap-0 divide-x divide-[#5a3f1c]">
          
          {/* Column 1: Sword = Strength (Fitness) */}
          <div className="flex flex-col items-center justify-center" title="Strength (Fitness)">
            <SwordIcon />
            <span className="font-garamond font-bold text-sm text-[#faecd1] leading-tight mt-0.5">
              {stats.strength ?? 10}
            </span>
          </div>

          {/* Column 2: Book = Intellect (Academics) */}
          <div className="flex flex-col items-center justify-center" title="Intellect (Academics)">
            <BookIcon />
            <span className="font-garamond font-bold text-sm text-[#faecd1] leading-tight mt-0.5">
              {stats.intellect ?? 10}
            </span>
          </div>

          {/* Column 3: Shield = Discipline (Lifestyle) */}
          <div className="flex flex-col items-center justify-center" title="Discipline (Lifestyle)">
            <ShieldIcon />
            <span className="font-garamond font-bold text-sm text-[#faecd1] leading-tight mt-0.5">
              {stats.discipline ?? 10}
            </span>
          </div>

          {/* Column 4: Spiral = Willpower (Other) */}
          <div className="flex flex-col items-center justify-center" title="Willpower (Other)">
            <SpiralIcon />
            <span className="font-garamond font-bold text-sm text-[#faecd1] leading-tight mt-0.5">
              {stats.willpower ?? 10}
            </span>
          </div>

        </div>

      </div>
    </button>
  );
}
