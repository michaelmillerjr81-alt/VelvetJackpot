import type { GameConfig } from '../types/index.ts';

export const GAME_CONFIG: GameConfig = {
  reelCount: 5,
  rowCount: 3,
  betLevels: [0.25, 0.50, 1.00, 2.00, 5.00, 10.00],
  defaultBet: 1.00,
  rtp: 0.96,
  symbols: [
    { name: 'A',       textureKey: 'sym_A' },
    { name: 'K',       textureKey: 'sym_K' },
    { name: 'Q',       textureKey: 'sym_Q' },
    { name: 'J',       textureKey: 'sym_J' },
    { name: 'Ten',     textureKey: 'sym_10' },
    { name: 'Gem',     textureKey: 'sym_gem' },
    { name: 'Crown',   textureKey: 'sym_crown' },
    { name: 'Diamond', textureKey: 'sym_diamond' },
    { name: 'Wild',    textureKey: 'sym_wild',    isWild: true },
    { name: 'Scatter', textureKey: 'sym_scatter', isScatter: true },
    { name: 'Bonus',   textureKey: 'sym_bonus',   isBonus: true },
  ],
  paytable: {
    Diamond: [0, 0, 100, 500, 2500],
    Crown:   [0, 0,  50, 200,  750],
    Gem:     [0, 0,  25, 100,  400],
    A:       [0, 0,  10,  40,  150],
    K:       [0, 0,   8,  30,  100],
    Q:       [0, 0,   6,  20,   80],
    J:       [0, 0,   4,  15,   60],
    Ten:     [0, 0,   3,  10,   40],
  },
};

export const REEL_SPIN_DURATIONS = [0.4, 0.6, 0.8, 1.0, 1.2]; // seconds per reel
export const SYMBOL_SIZE = 180;
export const REEL_MASK_ROWS = 3;
export const REFERENCE_WIDTH  = 1080;
export const REFERENCE_HEIGHT = 1920;
