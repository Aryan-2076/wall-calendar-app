export interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateString: string; // ISO format YYYY-MM-DD
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function toDateString(year: number, month: number, date: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
}

export function parseDateString(dateString: string): { year: number; month: number; date: number } {
  const [y, m, d] = dateString.split('-').map(Number);
  return { year: y, month: m - 1, date: d };
}

export function generateCalendarGrid(year: number, month: number): CalendarDay[] {
  const today = new Date();
  const todayStr = toDateString(today.getFullYear(), today.getMonth(), today.getDate());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const grid: CalendarDay[] = [];

  // Previous month's trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const date = daysInPrevMonth - i;
    const dateString = toDateString(prevYear, prevMonth, date);
    grid.push({
      date,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isToday: dateString === todayStr,
      dateString,
    });
  }

  // Current month's days
  for (let date = 1; date <= daysInMonth; date++) {
    const dateString = toDateString(year, month, date);
    grid.push({
      date,
      month,
      year,
      isCurrentMonth: true,
      isToday: dateString === todayStr,
      dateString,
    });
  }

  // Next month's leading days (fill to 42 cells = 6 rows)
  const remaining = 42 - grid.length;
  for (let date = 1; date <= remaining; date++) {
    const dateString = toDateString(nextYear, nextMonth, date);
    grid.push({
      date,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      isToday: dateString === todayStr,
      dateString,
    });
  }

  return grid;
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

export function isDateInRange(date: string, start: string | null, end: string | null): boolean {
  if (!start || !end) return false;
  return date >= start && date <= end;
}

export function isDateBefore(a: string, b: string): boolean {
  return a < b;
}

export function isDateAfter(a: string, b: string): boolean {
  return a > b;
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatMonthYear(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

export function getMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}
