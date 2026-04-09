'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MONTH_NAMES } from '@/lib/calendar';
import type { MonthData } from '@/lib/constants';

interface HeroPanelProps {
  monthData: MonthData;
  currentMonth: number;
  currentYear: number;
  accentColor: string;
  onTodayClick: () => void;
  isCurrentMonth: boolean;
}

export default function HeroPanel({
  monthData,
  currentMonth,
  currentYear,
  accentColor,
  onTodayClick,
  isCurrentMonth,
}: HeroPanelProps) {

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayData, setDisplayData] = useState(monthData);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayData(monthData);
      setIsTransitioning(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [monthData]);

  return (
    <div
      className="
        relative w-full h-[280px] lg:h-full lg:min-h-screen
        overflow-hidden flex flex-col justify-end
        bg-black
      "
    >

      {/* Image */}
      <div className={`absolute inset-0 transition-opacity duration-700 ease-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={displayData.image}
          alt={`${displayData.name} landscape`}
          fill
          className="object-cover scale-[1.02]"
          priority
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
      </div>

      {/* 🔥 CINEMATIC OVERLAYS */}

      {/* Main gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Side vignette (depth) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Subtle noise lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.06),transparent)]" />

      {/* Content */}
      <div
        className={`
          relative z-10 p-6 lg:p-12
          flex flex-col gap-3
          transition-all duration-500 ease-out
          ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
        `}
      >

        {/* Year */}
        <span className="text-white/60 text-sm font-medium tracking-[0.25em] uppercase">
          {currentYear}
        </span>

        {/* Month (🔥 main focus) */}
        <h1 className="
          text-5xl lg:text-7xl font-extrabold tracking-tight leading-none
          text-white
          drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]
        ">
          {MONTH_NAMES[currentMonth]}
        </h1>

        {/* Quote */}
        <p className="
          text-white/70 text-base lg:text-lg
          font-light italic max-w-xs mt-1
          leading-relaxed
        ">
          &ldquo;{displayData.quote}&rdquo;
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4 lg:mt-6">

          {!isCurrentMonth && (
            <button
              onClick={onTodayClick}
              className="
                px-5 py-2.5 rounded-full text-sm font-semibold
                bg-white/20 backdrop-blur-md text-white border border-white/30

                hover:bg-white/30
                hover:shadow-lg

                transition-all duration-300
                hover:scale-105 active:scale-95
              "
            >
              ↩ Today
            </button>
          )}

          {/* Accent pulse */}
          <div
            className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.6)]"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-700"
        style={{
          background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`
        }}
      />
    </div>
  );
}