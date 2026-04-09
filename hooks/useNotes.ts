'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface Note {
  id: string;
  text: string;
  startDate: string | null;
  endDate: string | null;
  monthKey: string; // "2026-04"
  createdAt: string;
  color: string;
}

const STORAGE_KEY = 'wall-calendar-notes';

function loadNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setNotes(loadNotes());
    setIsLoaded(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (isLoaded) {
      saveNotes(notes);
    }
  }, [notes, isLoaded]);

  const addNote = useCallback((
    text: string,
    monthKey: string,
    startDate: string | null,
    endDate: string | null,
    color: string
  ) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      text,
      startDate,
      endDate,
      monthKey,
      createdAt: new Date().toISOString(),
      color,
    };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  const updateNote = useCallback((id: string, text: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const getNotesForMonth = useCallback((monthKey: string) => {
    return notes.filter(n => n.monthKey === monthKey);
  }, [notes]);

  const getNotesForRange = useCallback((start: string, end: string) => {
    return notes.filter(n => {
      if (!n.startDate || !n.endDate) return false;
      return (n.startDate <= end && n.endDate >= start);
    });
  }, [notes]);

  const getDaysWithNotes = useMemo(() => {
    const days = new Set<string>();
    notes.forEach(n => {
      if (n.startDate && n.endDate) {
        // Add all days in range
        const start = new Date(n.startDate);
        const end = new Date(n.endDate);
        const current = new Date(start);
        while (current <= end) {
          days.add(current.toISOString().split('T')[0]);
          current.setDate(current.getDate() + 1);
        }
      }
    });
    return days;
  }, [notes]);

  return {
    notes,
    isLoaded,
    addNote,
    updateNote,
    deleteNote,
    getNotesForMonth,
    getNotesForRange,
    getDaysWithNotes,
  };
}
