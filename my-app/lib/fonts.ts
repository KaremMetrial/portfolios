import {
  IBM_Plex_Sans_Arabic,
  Inter,
  JetBrains_Mono,
  Montserrat,
} from "next/font/google";

/**
 * Self-hosted fonts (SRS-FE §4.1, NFR-FE-P8: ≤ 4 files on first load).
 * Only the Latin body and display faces are preloaded; mono and Arabic load
 * on use with font-display: swap. The FE-6 performance pass revisits this.
 */
export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  montserrat.variable,
  inter.variable,
  jetbrainsMono.variable,
  plexArabic.variable,
].join(" ");
