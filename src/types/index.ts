export type CurrencyMode = 'GC' | 'SC';

export interface PlayerBalance {
  gc: number;
  sc: number;
}

export interface SpinResult {
  grid: string[][];        // 5 reels × 3 rows
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
