import type { ThemeDefinition } from '../../types/index.ts';

export const velvetTheme: ThemeDefinition = {
  id: 'velvet',
  displayName: 'VELVET JACKPOT',
  tagline: 'SOCIAL SWEEPSTAKES',
  logoFontFamily: 'Georgia, serif',
  soundPrefix: 'velvet',

  palette: {
    bgDark:          0x0a0005,
    bgMid:           0x1a0a2e,
    bgGlow:          0x2a0060,
    accentPrimary:   0xf5c842,
    accentSecondary: 0xc8172b,
    ctrlBar:         0x0d0010,
    frameStroke:     0xf5c842,
    frameInner:      0x0d0010,
    textPrimary:     0xf5c842,
    textDim:         0x888888,
  },

  frameStyle: {
    strokeColor: 0xf5c842,
    strokeWidth: 3,
    strokeAlpha: 0.7,
    fillColor:   0xf5c842,
    fillAlpha:   0.12,
    innerFill:   0x0d0010,
    cornerRadius: 12,
  },

  symbols: [
    { name: 'Ten',     textureKey: 'sym_10'      },
    { name: 'J',       textureKey: 'sym_J'       },
    { name: 'Q',       textureKey: 'sym_Q'       },
    { name: 'K',       textureKey: 'sym_K'       },
    { name: 'A',       textureKey: 'sym_A'       },
    { name: 'Gem',     textureKey: 'sym_gem'     },
    { name: 'Crown',   textureKey: 'sym_crown'   },
    { name: 'Diamond', textureKey: 'sym_diamond' },
    { name: 'Wild',    textureKey: 'sym_wild',    isWild: true    },
    { name: 'Scatter', textureKey: 'sym_scatter', isScatter: true },
    { name: 'Bonus',   textureKey: 'sym_bonus',   isBonus: true   },
  ],

  symbolStyles: {
    Ten:     { bg: 0x1a1a4a, text: 0x8888ff, label: '10'   },
    J:       { bg: 0x1a3a1a, text: 0x66cc66, label: 'J'    },
    Q:       { bg: 0x2a1a3a, text: 0xaa66cc, label: 'Q'    },
    K:       { bg: 0x3a2a0a, text: 0xddaa33, label: 'K'    },
    A:       { bg: 0x3a0a0a, text: 0xff5555, label: 'A'    },
    Gem:     { bg: 0x0a2a2a, text: 0x33dddd, label: '💎'   },
    Crown:   { bg: 0x2a1a00, text: 0xffaa00, label: '👑'   },
    Diamond: { bg: 0x002a3a, text: 0x00ccff, label: '◆'    },
    Wild:    { bg: 0x2a2000, text: 0xffd700, label: 'WILD' },
    Scatter: { bg: 0x2a0022, text: 0xff44aa, label: '★'    },
    Bonus:   { bg: 0x002a08, text: 0x44ff88, label: 'BONUS'},
  },

  paytable: {
    Diamond: [0, 0, 100, 500, 2500],
    Crown:   [0, 0,  50, 200,  750],
    Gem:     [0, 0,  25, 100,  400],
    A:       [0, 0,  10,  40,  150],
    K:       [0, 0,   8,  30,  100],
    Q:       [0, 0,   6,  20,   80],
    J:       [0, 0,   4,  15,   60],
    Ten:     [0, 0,   3,  10,   40],
    Wild:    [0, 0,  20,  80,  300],
  },
};
