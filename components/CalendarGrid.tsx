'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { CalendarDay } from '@/lib/calendar';
import { WEEKDAY_LABELS } from '@/lib/calendar';
import type { ThemeColors } from '@/lib/colors';
import DateCell from './DateCell';

interface CalendarGridProps {
  calendarGrid: CalendarDay[];
  monthLabel: string;
  monthKey: string;
  direction: 'left' | 'right';
  currentMonth: number;
  currentYear: number;
  themeColors: ThemeColors;
  isStart: (d: string) => boolean;
  isEnd: (d: string) => boolean;
  isInRange: (d: string) => boolean;
  isHoverPreview: (d: string) => boolean;
  daysWithNotes: Set<string>;
  onDateClick: (d: string) => void;
  onDateHover: (d: string | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  isCurrentMonth: boolean;
}

export default function CalendarGrid({
  calendarGrid,
  monthLabel,
  direction,
  currentMonth,
  currentYear,
  themeColors,
  isStart,
  isEnd,
  isInRange,
  isHoverPreview,
  daysWithNotes,
  onDateClick,
  onDateHover,
  onPrevMonth,
  onNextMonth,
  onToday,
  isCurrentMonth,
}: CalendarGridProps) {

  const [animKey, setAnimKey] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnimKey(prev => prev + 1);
    setFocusedIndex(null);
  }, [currentMonth, currentYear]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, dateString: string) => {
    const idx = calendarGrid.findIndex(d => d.dateString === dateString);
    if (idx === -1) return;

    let newIdx = idx;
    switch (e.key) {
      case 'ArrowRight': newIdx = Math.min(idx + 1, calendarGrid.length - 1); break;
      case 'ArrowLeft': newIdx = Math.max(idx - 1, 0); break;
      case 'ArrowDown': newIdx = Math.min(idx + 7, calendarGrid.length - 1); break;
      case 'ArrowUp': newIdx = Math.max(idx - 7, 0); break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (calendarGrid[idx].isCurrentMonth) onDateClick(dateString);
        return;
      default: return;
    }

    e.preventDefault();
    setFocusedIndex(newIdx);

    const targetDate = calendarGrid[newIdx]?.dateString;
    if (targetDate) {
      const el = document.getElementById(`date-${targetDate}`);
      el?.focus();
    }
  }, [calendarGrid, onDateClick]);

  const slideClass = direction === 'right'
    ? 'animate-[slideFadeInRight_0.45s_cubic-bezier(0.22,1,0.36,1)]'
    : 'animate-[slideFadeInLeft_0.45s_cubic-bezier(0.22,1,0.36,1)]';

  return (
    <div className="flex flex-col gap-6">

      {/* Card */}
      <div className="
        relative
        bg-white/70 dark:bg-zinc-900/40
        backdrop-blur-3xl
        border border-white/30 dark:border-white/10
        rounded-3xl
        p-5 lg:p-6

        shadow-[0_30px_80px_rgba(0,0,0,0.6)]
        dark:shadow-[0_40px_100px_rgba(0,0,0,0.9)]

        transition-all duration-500

        before:absolute before:inset-0 before:rounded-3xl
        before:bg-gradient-to-br before:from-white/40 before:to-transparent
        before:opacity-40 dark:before:from-white/5
      ">

        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl">
          <div className="absolute -top-16 -left-16 w-60 h-60 bg-indigo-400/20 blur-3xl"></div>
          <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-purple-400/20 blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">

          <button onClick={onPrevMonth} className="w-11 h-11 rounded-full flex items-center justify-center bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-[0_2px_10px_rgba(99,102,241,0.4)]">
            {monthLabel}
          </h2>

          <button onClick={onNextMonth} className="w-11 h-11 rounded-full flex items-center justify-center bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Separator */}
        <div className="h-px mb-4 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-3 mb-3">
          {WEEKDAY_LABELS.map(label => (
            <div
              key={label}
              className="text-center text-[11px] font-medium tracking-wide uppercase text-zinc-500 dark:text-zinc-400"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div key={animKey} ref={gridRef} className={`grid grid-cols-7 gap-3 ${slideClass}`}>
          {calendarGrid.map((day, index) => (
            <DateCell
              key={day.dateString}
              day={day}
              isStart={isStart(day.dateString)}
              isEnd={isEnd(day.dateString)}
              isInRange={isInRange(day.dateString)}
              isHoverPreview={isHoverPreview(day.dateString)}
              hasNote={daysWithNotes.has(day.dateString)}
              accentColor={themeColors.accent}
              accentSoft={themeColors.accentSoft}
              onClick={onDateClick}
              onHover={onDateHover}
              tabIndex={index === (focusedIndex ?? 0) ? 0 : -1}
              isFocused={index === focusedIndex}
              onKeyDown={handleKeyDown}
            />
          ))}
        </div>
      </div>

      <p className="text-[11px] text-zinc-400 dark:text-zinc-600 text-center">
        Click to select start → end date • Click again to reset
      </p>
    </div>
  );
}