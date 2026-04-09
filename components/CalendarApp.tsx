'use client';

import React, { useMemo } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { useDateSelection } from '@/hooks/useDateSelection';
import { useNotes } from '@/hooks/useNotes';
import { useTheme } from '@/hooks/useTheme';
import { deriveThemeFromColor } from '@/lib/colors';
import { MONTH_DATA } from '@/lib/constants';
import HeroPanel from './HeroPanel';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import ThemeToggle from './ThemeToggle';

export default function CalendarApp() {
  const { isDark, isLoaded: themeLoaded, toggleTheme } = useTheme();
  const calendar = useCalendar();
  const selection = useDateSelection();
  const notesHook = useNotes();

  const monthData = MONTH_DATA[calendar.currentMonth];

  const themeColors = useMemo(
    () => deriveThemeFromColor(monthData.dominantColor, isDark),
    [monthData.dominantColor, isDark]
  );

  const monthNotes = useMemo(
    () => notesHook.getNotesForMonth(calendar.monthKey),
    [notesHook, calendar.monthKey]
  );

  if (!themeLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="
      min-h-screen flex flex-col lg:flex-row
      bg-gradient-to-br 
      from-white via-zinc-100 to-white 
      dark:from-black dark:via-zinc-900 dark:to-black
      text-black dark:text-white
      relative overflow-hidden transition-all duration-500
    ">

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent)]" />
      </div>

      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

      {/* Hero */}
      <aside className="w-full lg:w-[40%] lg:fixed lg:left-0 lg:top-0 lg:bottom-0">
        <HeroPanel
          monthData={monthData}
          currentMonth={calendar.currentMonth}
          currentYear={calendar.currentYear}
          accentColor={themeColors.accent}
          onTodayClick={calendar.goToToday}
          isCurrentMonth={calendar.isCurrentMonth}
        />
      </aside>

      {/* Main */}
      <main className="w-full lg:w-[60%] lg:ml-[40%] flex flex-col">

        {/* 🔥 FIXED SPACING */}
        <div className="max-w-xl mx-auto w-full px-4 sm:px-6 py-6 lg:py-12 flex flex-col gap-6 lg:gap-8">

          {/* Selection */}
          {selection.phase === 'selected' && selection.startDate && selection.endDate && (
            <div
              className="flex items-center justify-between p-3 rounded-xl animate-[fadeIn_0.2s_ease-out]"
              style={{ backgroundColor: themeColors.accentSoft }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColors.accent }} />
                <span className="text-sm font-medium" style={{ color: themeColors.accent }}>
                  {selection.startDate === selection.endDate
                    ? new Date(selection.startDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric',
                      })
                    : `${new Date(selection.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → ${new Date(selection.endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  }
                </span>
              </div>
              <button
                onClick={selection.clearSelection}
                className="text-xs font-medium px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ color: themeColors.accent }}
              >
                Clear
              </button>
            </div>
          )}

          {/* Calendar */}
          <CalendarGrid
            calendarGrid={calendar.calendarGrid}
            monthLabel={calendar.monthLabel}
            monthKey={calendar.monthKey}
            direction={calendar.direction}
            currentMonth={calendar.currentMonth}
            currentYear={calendar.currentYear}
            themeColors={themeColors}
            isStart={selection.isStart}
            isEnd={selection.isEnd}
            isInRange={selection.isInRange}
            isHoverPreview={selection.isHoverPreview}
            daysWithNotes={notesHook.getDaysWithNotes}
            onDateClick={selection.handleDateClick}
            onDateHover={selection.handleDateHover}
            onPrevMonth={calendar.goToPrevMonth}
            onNextMonth={calendar.goToNextMonth}
            onToday={calendar.goToToday}
            isCurrentMonth={calendar.isCurrentMonth}
          />

          {/* 🔥 FIXED DIVIDER */}
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent" />

          {/* Notes */}
          <NotesPanel
            notes={monthNotes}
            monthKey={calendar.monthKey}
            currentMonth={calendar.currentMonth}
            startDate={selection.startDate}
            endDate={selection.endDate}
            selectionPhase={selection.phase}
            accentColor={themeColors.accent}
            accentSoft={themeColors.accentSoft}
            onAddNote={notesHook.addNote}
            onUpdateNote={notesHook.updateNote}
            onDeleteNote={notesHook.deleteNote}
          />
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium tracking-wide uppercase">
            Wall Calendar • {new Date().getFullYear()}
          </p>
        </footer>

      </main>
    </div>
  );
}