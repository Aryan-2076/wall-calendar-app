'use client';

import React from 'react';

interface ThemeToggleProps {
  isDark: boolean;
  isLoaded: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full
        bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md
        shadow-lg shadow-black/5 dark:shadow-black/20
        border border-zinc-200/50 dark:border-zinc-700/50
        flex items-center justify-center
        hover:scale-110 active:scale-95
        transition-all duration-300 ease-out
        cursor-pointer group"
    >
      <svg
        className={`w-5 h-5 text-amber-500 absolute transition-all duration-500 ease-out
          ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>

      <svg
        className={`w-5 h-5 text-indigo-400 absolute transition-all duration-500 ease-out
          ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </button>
  );
}