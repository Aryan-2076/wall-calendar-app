'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Note } from '@/hooks/useNotes';

interface NoteItemProps {
  note: Note;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  accentColor: string;
}

export default function NoteItem({ note, onUpdate, onDelete, accentColor }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed) {
      onUpdate(note.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditText(note.text);
      setIsEditing(false);
    }
  };

  const formatDateRange = () => {
    if (!note.startDate) return 'Entire month';
    if (note.startDate === note.endDate) {
      const d = new Date(note.startDate + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    const s = new Date(note.startDate + 'T00:00:00');
    const e = new Date(note.endDate! + 'T00:00:00');
    return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div
      className="group relative p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800
        bg-white dark:bg-zinc-900/50
        hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20
        hover:-translate-y-0.5
        transition-all duration-200 ease-out"
    >
      {/* Date range badge */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider
            px-2 py-0.5 rounded-md"
          style={{
            backgroundColor: note.color ? `${note.color}20` : `${accentColor}20`,
            color: note.color || accentColor,
          }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {formatDateRange()}
        </span>
      </div>

      {/* Note content */}
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full text-sm text-zinc-800 dark:text-zinc-200 bg-transparent
            border-none outline-none resize-none min-h-[60px]
            placeholder:text-zinc-400"
          placeholder="Write your note..."
          rows={3}
        />
      ) : (
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {note.text}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-[11px] font-medium text-zinc-400 hover:text-zinc-600
                dark:hover:text-zinc-300 px-2 py-1 rounded-md
                hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              Edit
            </button>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-[11px] font-medium text-zinc-400 hover:text-red-500
                  px-2 py-1 rounded-md
                  hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
              >
                Delete
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onDelete(note.id)}
                  className="text-[11px] font-bold text-red-500 px-2 py-1 rounded-md
                    bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-[11px] font-medium text-zinc-400 px-2 py-1 rounded-md
                    hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
