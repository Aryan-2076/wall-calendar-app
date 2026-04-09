export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  type: 'national' | 'international' | 'observance';
}

// Static holiday data — India-focused + major international holidays
// Using 2026 dates (adjustable)
const HOLIDAYS_2026: Holiday[] = [
  // January
  { date: '2026-01-01', name: 'New Year\'s Day', type: 'international' },
  { date: '2026-01-14', name: 'Makar Sankranti', type: 'national' },
  { date: '2026-01-26', name: 'Republic Day', type: 'national' },

  // February
  { date: '2026-02-14', name: 'Valentine\'s Day', type: 'international' },
  { date: '2026-02-19', name: 'Shivaji Jayanti', type: 'national' },

  // March
  { date: '2026-03-10', name: 'Holi', type: 'national' },
  { date: '2026-03-17', name: 'St. Patrick\'s Day', type: 'international' },
  { date: '2026-03-30', name: 'Ugadi', type: 'national' },

  // April
  { date: '2026-04-02', name: 'Ram Navami', type: 'national' },
  { date: '2026-04-06', name: 'Mahavir Jayanti', type: 'national' },
  { date: '2026-04-14', name: 'Ambedkar Jayanti', type: 'national' },
  { date: '2026-04-22', name: 'Earth Day', type: 'international' },

  // May
  { date: '2026-05-01', name: 'May Day', type: 'international' },
  { date: '2026-05-07', name: 'Buddha Purnima', type: 'national' },
  { date: '2026-05-10', name: 'Mother\'s Day', type: 'international' },

  // June
  { date: '2026-06-21', name: 'Intl Yoga Day', type: 'international' },

  // July
  { date: '2026-07-07', name: 'Eid ul-Adha', type: 'national' },
  { date: '2026-07-17', name: 'Muharram', type: 'national' },

  // August
  { date: '2026-08-15', name: 'Independence Day', type: 'national' },
  { date: '2026-08-22', name: 'Janmashtami', type: 'national' },

  // September
  { date: '2026-09-16', name: 'Milad-un-Nabi', type: 'national' },

  // October
  { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'national' },
  { date: '2026-10-20', name: 'Dussehra', type: 'national' },
  { date: '2026-10-31', name: 'Halloween', type: 'international' },

  // November
  { date: '2026-11-09', name: 'Diwali', type: 'national' },
  { date: '2026-11-14', name: 'Children\'s Day', type: 'national' },
  { date: '2026-11-26', name: 'Thanksgiving', type: 'international' },
  { date: '2026-11-30', name: 'Guru Nanak Jayanti', type: 'national' },

  // December
  { date: '2026-12-25', name: 'Christmas', type: 'international' },
  { date: '2026-12-31', name: 'New Year\'s Eve', type: 'international' },
];

export function getHolidaysForMonth(year: number, month: number): Holiday[] {
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  return HOLIDAYS_2026.filter(h => h.date.startsWith(monthStr));
}

export function getHolidayForDate(dateString: string): Holiday | undefined {
  return HOLIDAYS_2026.find(h => h.date === dateString);
}

export function isHoliday(dateString: string): boolean {
  return HOLIDAYS_2026.some(h => h.date === dateString);
}
