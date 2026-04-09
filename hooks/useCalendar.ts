'use client';

import { useState, useMemo, useCallback } from 'react';
import { generateCalendarGrid, formatMonthYear, getMonthKey, type CalendarDay } from '@/lib/calendar';

export function useCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const calendarGrid: CalendarDay[] = useMemo(
    () => generateCalendarGrid(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const monthLabel = useMemo(
    () => formatMonthYear(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const monthKey = useMemo(
    () => getMonthKey(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const isCurrentMonth = useMemo(() => {
    return currentMonth === today.getMonth() && currentYear === today.getFullYear();
  }, [currentMonth, currentYear, today]);

  const goToPrevMonth = useCallback(() => {
    setDirection('left');
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setDirection('right');
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    const targetMonth = now.getMonth();
    const targetYear = now.getFullYear();
    if (targetYear < currentYear || (targetYear === currentYear && targetMonth < currentMonth)) {
      setDirection('left');
    } else {
      setDirection('right');
    }
    setCurrentMonth(targetMonth);
    setCurrentYear(targetYear);
  }, [currentMonth, currentYear]);

  return {
    currentMonth,
    currentYear,
    calendarGrid,
    monthLabel,
    monthKey,
    isCurrentMonth,
    direction,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
  };
}
