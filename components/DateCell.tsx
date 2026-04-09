'use client';

import React from 'react';
import type { CalendarDay } from '@/lib/calendar';
import { getHolidayForDate } from '@/lib/holidays';
import HolidayBadge from './HolidayBadge';

interface DateCellProps {
  day: CalendarDay;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isHoverPreview: boolean;
  hasNote: boolean;
  accentColor: string;
  accentSoft: string;
  onClick: (dateString: string) => void;
  onHover: (dateString: string | null) => void;
  tabIndex: number;
  isFocused: boolean;
  onKeyDown: (e: React.KeyboardEvent, dateString: string) => void;
}

export default function DateCell({
  day,
  isStart,
  isEnd,
  isInRange,
  isHoverPreview,
  hasNote,
  accentColor,
  accentSoft,
  onClick,
  onHover,
  tabIndex,
  isFocused,
  onKeyDown,
}: DateCellProps) {

  const holiday = getHolidayForDate(day.dateString);
  const isHighlighted = isStart || isEnd;

  if (!day.isCurrentMonth) {
    return <div className="w-full aspect-square opacity-0 pointer-events-none" />;
  }

  let style: React.CSSProperties = {};
  let text = 'text-zinc-700 dark:text-zinc-300';
  let state = '';

  // Start / End
  if (isHighlighted) {
    state = `
      bg-gradient-to-br from-indigo-500 to-purple-500
      text-white
      shadow-[0_8px_25px_rgba(99,102,241,0.6)]
      scale-[1.08]
      z-10
    `;
    text = 'font-semibold';
  }

  // Range
  else if (isInRange) {
    state = `bg-indigo-500/10 dark:bg-indigo-500/20`;
  }

  // Hover
  else if (isHoverPreview) {
    state = `bg-indigo-500/10 dark:bg-indigo-500/20 opacity-70`;
  }

  // Today ring
  if (day.isToday && !isHighlighted) {
    state += ' ring-2 ring-offset-2 dark:ring-offset-zinc-900';
    style = {
      ...style,
      ['--tw-ring-color' as any]: accentColor,
    };
  }

  // Focus
  if (isFocused) {
    state += ' outline outline-2 outline-blue-500';
  }

  // Shape
  let shape = 'rounded-xl';
  if (isInRange || isHoverPreview) shape = 'rounded-none';
  if (isStart) shape = 'rounded-l-xl rounded-r-none';
  if (isEnd) shape = 'rounded-r-xl rounded-l-none';
  if (isStart && isEnd) shape = 'rounded-xl';

  return (
    <button
      id={`date-${day.dateString}`}
      role="gridcell"
      aria-selected={isHighlighted}
      tabIndex={tabIndex}
      className={`
        relative w-full aspect-square flex flex-col items-center justify-center
        text-sm select-none
        transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]

        ${shape}
        ${text}
        ${state}

        hover:scale-[1.05]
        active:scale-95

        hover:bg-white/30 dark:hover:bg-white/10
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]

        focus:outline-none
      `}
      style={style}
      onClick={() => onClick(day.dateString)}
      onMouseEnter={() => onHover(day.dateString)}
      onMouseLeave={() => onHover(null)}
      onKeyDown={(e) => onKeyDown(e, day.dateString)}
    >
      {/* Date */}
      <span className="relative z-10 text-[13px] font-semibold tracking-tight">
        {day.date}
      </span>

      {/* Indicators */}
      <div className="flex items-center gap-1 mt-1 h-2 z-10">
        {holiday && <HolidayBadge holiday={holiday} />}
        {hasNote && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500" />
        )}
      </div>

      {/* Today dot */}
      {day.isToday && !isHighlighted && (
        <span
          className="absolute top-1 right-1 w-2 h-2 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </button>
  );
}