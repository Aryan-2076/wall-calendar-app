'use client';

import { useState, useCallback, useMemo } from 'react';
import { isDateBefore } from '@/lib/calendar';

type SelectionPhase = 'idle' | 'selecting' | 'selected';

export function useDateSelection() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [phase, setPhase] = useState<SelectionPhase>('idle');

  const handleDateClick = useCallback((dateString: string) => {
    switch (phase) {
      case 'idle':
        // First click — set start date
        setStartDate(dateString);
        setEndDate(null);
        setPhase('selecting');
        break;

      case 'selecting':
        // Second click — set end date (auto-correct order)
        if (dateString === startDate) {
          // Same day selection
          setEndDate(dateString);
        } else if (isDateBefore(dateString, startDate!)) {
          // Reverse selection — swap
          setEndDate(startDate);
          setStartDate(dateString);
        } else {
          setEndDate(dateString);
        }
        setPhase('selected');
        setHoveredDate(null);
        break;

      case 'selected':
        // Third click — reset and start new selection
        setStartDate(dateString);
        setEndDate(null);
        setPhase('selecting');
        break;
    }
  }, [phase, startDate]);

  const handleDateHover = useCallback((dateString: string | null) => {
    if (phase === 'selecting') {
      setHoveredDate(dateString);
    }
  }, [phase]);

  const clearSelection = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setHoveredDate(null);
    setPhase('idle');
  }, []);

  // Derive the effective range for hover preview
  const effectiveRange = useMemo(() => {
    if (phase === 'selected' && startDate && endDate) {
      return { start: startDate, end: endDate };
    }
    if (phase === 'selecting' && startDate && hoveredDate) {
      const s = isDateBefore(hoveredDate, startDate) ? hoveredDate : startDate;
      const e = isDateBefore(hoveredDate, startDate) ? startDate : hoveredDate;
      return { start: s, end: e };
    }
    return null;
  }, [phase, startDate, endDate, hoveredDate]);

  const isStart = useCallback((dateString: string) => dateString === startDate, [startDate]);
  const isEnd = useCallback((dateString: string) => {
    if (phase === 'selected') return dateString === endDate;
    return false;
  }, [endDate, phase]);

  const isInRange = useCallback((dateString: string) => {
    if (!effectiveRange) return false;
    return dateString > effectiveRange.start && dateString < effectiveRange.end;
  }, [effectiveRange]);

  const isHoverPreview = useCallback((dateString: string) => {
    if (phase !== 'selecting' || !startDate || !hoveredDate) return false;
    const s = isDateBefore(hoveredDate, startDate) ? hoveredDate : startDate;
    const e = isDateBefore(hoveredDate, startDate) ? startDate : hoveredDate;
    return dateString >= s && dateString <= e;
  }, [phase, startDate, hoveredDate]);

  return {
    startDate,
    endDate,
    hoveredDate,
    phase,
    effectiveRange,
    handleDateClick,
    handleDateHover,
    clearSelection,
    isStart,
    isEnd,
    isInRange,
    isHoverPreview,
  };
}
