/**
 * Color utilities for deriving theme accents from hero image dominant colors.
 * Uses HSL manipulation for contrast-safe color generation.
 */

export interface ThemeColors {
  accent: string;
  accentSoft: string;
  accentHover: string;
  accentMuted: string;
  gradientStart: string;
  gradientEnd: string;
  selectionBg: string;
  selectionBorder: string;
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function deriveThemeFromColor(hex: string, isDark: boolean = false): ThemeColors {
  const { h, s } = hexToHSL(hex);

  // Adjust saturation and lightness for pleasant, non-garish colors
  const baseSat = Math.min(s, 70);

  if (isDark) {
    return {
      accent: hslToString(h, baseSat, 55),
      accentSoft: hslToString(h, baseSat - 15, 20),
      accentHover: hslToString(h, baseSat, 65),
      accentMuted: hslToString(h, baseSat - 20, 30),
      gradientStart: hslToString(h, baseSat - 10, 15),
      gradientEnd: hslToString(h + 30, baseSat - 20, 10),
      selectionBg: hslToString(h, baseSat - 15, 25),
      selectionBorder: hslToString(h, baseSat, 45),
    };
  }

  return {
    accent: hslToString(h, baseSat, 45),
    accentSoft: hslToString(h, baseSat - 10, 92),
    accentHover: hslToString(h, baseSat, 40),
    accentMuted: hslToString(h, baseSat - 15, 85),
    gradientStart: hslToString(h, baseSat - 5, 95),
    gradientEnd: hslToString(h + 30, baseSat - 15, 90),
    selectionBg: hslToString(h, baseSat - 10, 90),
    selectionBorder: hslToString(h, baseSat, 55),
  };
}
