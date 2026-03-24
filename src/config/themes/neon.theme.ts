import type { ThemeDefinition } from '../../types/index.ts';

export const neonTheme: ThemeDefinition = {
  id: 'neon',
  displayName: 'NEON NIGHTS',
  tagline: 'THE CITY NEVER SLEEPS',
  logoFontFamily: 'Impact, sans-serif',
  soundPrefix: 'neon',

  palette: {
    bgDark:          0x000510,
    bgMid:           0x000a20,
    bgGlow:          0x001040,
    accentPrimary:   0x00ffee,
    accentSecondary: 0xff00aa,
    ctrlBar:         0x00050f,
    frameStroke:     0x00ffee,
    frameInner:      0x00050f,
    textPrimary:     0x00ffee,
    textDim:         0x447788,
  },

  frameStyle: {
    strokeColor: 0x00ffee,
    strokeWidth: 2,
    strokeAlpha: 0.9,
    fillColor:   0x00ffee,
    fillAlpha:   0.06,
    innerFill:   0x00050f,
    cornerRadius: 2,
  },

  symbols: [
    { name: 'Ten',   textureKey: 'sym_10'         },
    { name: 'J',     textureKey: 'sym_J'          },
    { name: 'Q',     textureKey: 'sym_Q'          },
    { name: 'K',     textureKey: 'sym_K'          },
    { name: 'A',     textureKey: 'sym_A'          },
    { name: 'Dice',  textureKey: 'sym_dice'       },
    { name: 'Bar',   textureKey: 'sym_bar'        },
    { name: 'Seven', textureKey: 'sym_seven'      },
    { name: 'Wild',  textureKey: 'sym_wild',    isWild: true    },
    { name: 'Scatter',textureKey:'sym_scatter', isScatter: true },
    { name: 'Bonus', textureKey: 'sym_bonus',   isBonus: true   },
  ],

  symbolStyles: {
    Ten:    { bg: 0x001020, text: 0x00ccff, label: '10'     },
    J:      { bg: 0x001020, text: 0x00ddff, label: 'J'      },
    Q:      { bg: 0x001020, text: 0x00eeff, label: 'Q'      },
    K:      { bg: 0x001020, text: 0x00ffee, label: 'K'      },
    A:      { bg: 0x001020, text: 0x44ffff, label: 'A'      },
    Dice:   { bg: 0x1a0020, text: 0xff44ff, label: '🎲'     },
    Bar:    { bg: 0x1a1000, text: 0xffee00, label: 'BAR'    },
    Seven:  { bg: 0x200010, text: 0xff2244, label: '7'      },
    Wild:   { bg: 0x001a20, text: 0x00ffee, label: 'WILD'   },
    Scatter:{ bg: 0x200020, text: 0xff00ff, label: '⚡'     },
    Bonus:  { bg: 0x001a10, text: 0x00ff88, label: 'BONUS'  },
  },

  paytable: {
    Seven:   [0, 0, 100, 500, 2500],
    Bar:     [0, 0,  50, 200,  750],
    Dice:    [0, 0,  25, 100,  400],
    A:       [0, 0,  10,  40,  150],
    K:       [0, 0,   8,  30,  100],
    Q:       [0, 0,   6,  20,   80],
    J:       [0, 0,   4,  15,   60],
    Ten:     [0, 0,   3,  10,   40],
    Wild:    [0, 0,  20,  80,  300],
  },
};
