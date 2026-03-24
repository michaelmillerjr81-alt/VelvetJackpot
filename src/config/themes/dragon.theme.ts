import type { ThemeDefinition } from '../../types/index.ts';

export const dragonTheme: ThemeDefinition = {
  id: 'dragon',
  displayName: "DRAGON'S HOARD",
  tagline: 'ANCIENT RICHES AWAIT',
  logoFontFamily: 'Georgia, serif',
  soundPrefix: 'dragon',

  palette: {
    bgDark:          0x05000a,
    bgMid:           0x1a0020,
    bgGlow:          0x3a0040,
    accentPrimary:   0xff4400,
    accentSecondary: 0xffaa00,
    ctrlBar:         0x0a0010,
    frameStroke:     0xff4400,
    frameInner:      0x0a0010,
    textPrimary:     0xff6600,
    textDim:         0x885544,
  },

  frameStyle: {
    strokeColor: 0xff4400,
    strokeWidth: 3,
    strokeAlpha: 0.8,
    fillColor:   0xff4400,
    fillAlpha:   0.08,
    innerFill:   0x080010,
    cornerRadius: 8,
  },

  symbols: [
    { name: 'Ten',    textureKey: 'sym_10'         },
    { name: 'J',      textureKey: 'sym_J'          },
    { name: 'Q',      textureKey: 'sym_Q'          },
    { name: 'K',      textureKey: 'sym_K'          },
    { name: 'A',      textureKey: 'sym_A'          },
    { name: 'Jade',   textureKey: 'sym_jade'       },
    { name: 'Coin',   textureKey: 'sym_coin'       },
    { name: 'Dragon', textureKey: 'sym_dragon'     },
    { name: 'Wild',   textureKey: 'sym_wild',    isWild: true    },
    { name: 'Scatter',textureKey: 'sym_scatter', isScatter: true },
    { name: 'Bonus',  textureKey: 'sym_bonus',   isBonus: true   },
  ],

  symbolStyles: {
    Ten:    { bg: 0x1a0a1a, text: 0xcc44cc, label: '10'     },
    J:      { bg: 0x1a0a1a, text: 0xdd55dd, label: 'J'      },
    Q:      { bg: 0x1a0a1a, text: 0xee66ee, label: 'Q'      },
    K:      { bg: 0x1a0a1a, text: 0xff77ff, label: 'K'      },
    A:      { bg: 0x1a0a1a, text: 0xff88ff, label: 'A'      },
    Jade:   { bg: 0x002a0a, text: 0x00ff88, label: '♦'      },
    Coin:   { bg: 0x2a1500, text: 0xffaa00, label: '🪙'     },
    Dragon: { bg: 0x2a0000, text: 0xff2200, label: '🐉'     },
    Wild:   { bg: 0x1a0800, text: 0xff6600, label: 'WILD'   },
    Scatter:{ bg: 0x0a001a, text: 0xaa44ff, label: '🔥'     },
    Bonus:  { bg: 0x001a0a, text: 0x44ffaa, label: 'BONUS'  },
  },

  paytable: {
    Dragon:  [0, 0, 100, 500, 2500],
    Coin:    [0, 0,  50, 200,  750],
    Jade:    [0, 0,  25, 100,  400],
    A:       [0, 0,  10,  40,  150],
    K:       [0, 0,   8,  30,  100],
    Q:       [0, 0,   6,  20,   80],
    J:       [0, 0,   4,  15,   60],
    Ten:     [0, 0,   3,  10,   40],
    Wild:    [0, 0,  20,  80,  300],
  },
};
