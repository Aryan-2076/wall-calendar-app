import type { Metadata } from 'next';
import CalendarApp from '@/components/CalendarApp';

export const metadata: Metadata = {
  title: 'Wall Calendar — Interactive Calendar Experience',
  description:
    'A premium interactive wall calendar with date range selection, context-aware notes, dynamic hero images, and beautiful seasonal themes.',
  keywords: ['calendar', 'wall calendar', 'interactive', 'notes', 'productivity'],
};

export default function Home() {
  return <CalendarApp />;
}
