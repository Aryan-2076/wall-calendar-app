'use client';

import React, { useState } from 'react';
import type { Holiday } from '@/lib/holidays';

interface HolidayBadgeProps {
  holiday: Holiday;
}

export default function HolidayBadge({ holiday }: HolidayBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const typeColors = {
    national: 'bg-orange-500',
    international: 'bg-blue-500',
    observance: 'bg-emerald-500',
  };

  return (
    <div className="relative inline-flex">
      <span
        className={`w-1.5 h-1.5 rounded-full ${typeColors[holiday.type]} ring-2 ring-white dark:ring-zinc-900 
          animate-pulse cursor-help`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
        role="img"
        aria-label={`Holiday: ${holiday.name}`}
      />

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
          px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap
          bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900
          shadow-xl shadow-black/20 dark:shadow-black/40
          animate-[fadeIn_0.15s_ease-out]
          pointer-events-none">
          <span>{holiday.name}</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="w-2 h-2 bg-zinc-900 dark:bg-zinc-100 rotate-45 -translate-y-1" />
          </div>
        </div>
      )}
    </div>
  );
}
