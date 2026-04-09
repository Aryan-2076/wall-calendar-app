'use client';

import React, { useState, useRef, useMemo } from 'react';
import type { Note } from '@/hooks/useNotes';
import { MONTH_NAMES } from '@/lib/calendar';
import NoteItem from './NoteItem';

interface NotesPanelProps {
  notes: Note[];
  monthKey: string;
  currentMonth: number;
  startDate: string | null;
  endDate: string | null;
  selectionPhase: 'idle' | 'selecting' | 'selected';
  accentColor: string;
  accentSoft: string;
  onAddNote: (text: string, monthKey: string, start: string | null, end: string | null, color: string) => void;
  onUpdateNote: (id: string, text: string) => void;
  onDeleteNote: (id: string) => void;
}

export default function NotesPanel({
  notes,
  monthKey,
  currentMonth,
  startDate,
  endDate,
  selectionPhase,
  accentColor,
  accentSoft,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NotesPanelProps) {
  const [newNoteText, setNewNoteText] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter notes for current context
  const filteredNotes = useMemo(() => {
    if (selectionPhase === 'selected' && startDate && endDate) {
      return notes.filter(n => {
        // Show notes for this range or month-level notes
        if (!n.startDate || !n.endDate) return n.monthKey === monthKey;
        return (n.startDate <= endDate && n.endDate >= startDate);
      });
    }
    return notes.filter(n => n.monthKey === monthKey);
  }, [notes, monthKey, selectionPhase, startDate, endDate]);

  const contextLabel = useMemo(() => {
    if (selectionPhase === 'selected' && startDate && endDate) {
      if (startDate === endDate) {
        const d = new Date(startDate + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      const s = new Date(startDate + 'T00:00:00');
      const e = new Date(endDate + 'T00:00:00');
      return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return MONTH_NAMES[currentMonth];
  }, [selectionPhase, startDate, endDate, currentMonth]);

  const handleAddNote = () => {
    const trimmed = newNoteText.trim();
    if (!trimmed) return;

    const noteStart = selectionPhase === 'selected' ? startDate : null;
    const noteEnd = selectionPhase === 'selected' ? endDate : null;

    onAddNote(trimmed, monthKey, noteStart, noteEnd, accentColor);
    setNewNoteText('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <div id="notes-panel" className="flex flex-col gap-3">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-zinc-400 dark:text-zinc-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 tracking-tight">
            Notes
          </h3>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
            style={{ backgroundColor: accentSoft, color: accentColor }}
          >
            {contextLabel}
          </span>
          {filteredNotes.length > 0 && (
            <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-medium">
              ({filteredNotes.length})
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200
            ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-3 animate-[fadeIn_0.2s_ease-out]">
          {/* Add note form */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              id="new-note-input"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectionPhase === 'selected'
                  ? `Add note for ${contextLabel}...`
                  : `Add note for ${MONTH_NAMES[currentMonth]}...`
              }
              className="w-full text-sm p-3 pr-12 rounded-xl border border-zinc-200 dark:border-zinc-700
                bg-zinc-50 dark:bg-zinc-800/50
                text-zinc-800 dark:text-zinc-200
                placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                focus:outline-none focus:ring-2 focus:border-transparent
                resize-none transition-all duration-200"
              style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
              rows={2}
            />
            <button
              onClick={handleAddNote}
              disabled={!newNoteText.trim()}
              className="absolute right-2 bottom-2 w-8 h-8 rounded-lg flex items-center justify-center
                text-white transition-all duration-200
                disabled:opacity-30 disabled:cursor-not-allowed
                hover:scale-110 active:scale-95 cursor-pointer"
              style={{ backgroundColor: accentColor }}
              aria-label="Add note"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Notes list */}
          {filteredNotes.length > 0 ? (
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1
              scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700">
              {filteredNotes.map(note => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onUpdate={onUpdateNote}
                  onDelete={onDeleteNote}
                  accentColor={accentColor}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <svg
                className="w-12 h-12 text-zinc-200 dark:text-zinc-800"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center">
                No notes yet.
                <br />
                <span className="text-zinc-300 dark:text-zinc-700">
                  Select dates or add a month note above.
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
