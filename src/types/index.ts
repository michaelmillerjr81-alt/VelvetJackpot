export type CurrencyMode = 'GC' | 'SC';

export interface PlayerBalance {
  gc: number;
  sc: number;
}

export interface SpinResult {
  grid: string[][];
  winLines: WinLine[];
  totalWin: number;
  currency: CurrencyMode;
  freeSpinsAwarded?: number;
  bonusTriggered?: boolean;
  jackpotWon?: JackpotTier;
}

export interface WinLine {
  lineIndex: number;
  symbolName: string;
  count: number;
  positions: { reel: number; row: number }[];
  payout: number;
}

export type JackpotTier = 'MINI' | 'MAJOR' | 'GRAND';
export type WinTier = 'SMALL' | 'MEDIUM' | 'BIG' | 'MEGA' | 'JACKPOT';

export interface GameConfig {
  reelCount: number;
  rowCount: number;
  betLevels: number[];
  defaultBet: number;
  symbols: SymbolConfig[];
  paytable: Record<string, number[]>;
  rtp: number;
}

export interface SymbolConfig {
  name: string;
  textureKey: string;
  blurTextureKey?: string;
  isWild?: boolean;
  isScatter?: boolean;
  isBonus?: boolean;
}

export type GameMode = 'BASE' | 'FREE_SPINS' | 'BONUS';

// ── Theme System ───────────────────────────────────────────────────────────

export interface SymbolStyleConfig {
  bg: number;
  text: number;
  label: string;
}

export interface ThemePalette {
  bgDark: number;
  bgMid: number;
  bgGlow: number;
  accentPrimary: number;
  accentSecondary: number;
  ctrlBar: number;
  frameStroke: number;
  frameInner: number;
  textPrimary: number;
  textDim: number;
}

export interface FrameStyleConfig {
  strokeColor: number;
  strokeWidth: number;
  strokeAlpha: number;
  fillColor: number;
  fillAlpha: number;
  innerFill: number;
  cornerRadius: number;
}

export interface ThemeDefinition {
  id: string;
  displayName: string;
  tagline: string;
  palette: ThemePalette;
  symbols: SymbolConfig[];
  symbolStyles: Record<string, SymbolStyleConfig>;
  paytable: Record<string, number[]>;
  frameStyle: FrameStyleConfig;
  logoFontFamily: string;
  soundPrefix: string;
}
