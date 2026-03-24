import type { ThemeDefinition } from '../../types/index.ts';

export const pirateTheme: ThemeDefinition = {
  id: 'pirate',
  displayName: "PIRATE'S PLUNDER",
  tagline: 'X MARKS THE SPOT',
  logoFontFamily: 'Georgia, serif',
  soundPrefix: 'pirate',

  palette: {
    bgDark:          0x000a15,
    bgMid:           0x001530,
    bgGlow:          0x002050,
    accentPrimary:   0xf0a020,
    accentSecondary: 0x006688,
    ctrlBar:         0x000810,
    frameStroke:     0xf0a020,
    frameInner:      0x000810,
    textPrimary:     0xf0a020,
    textDim:         0x557788,
  },

  frameStyle: {
    strokeColor: 0xf0a020,
    strokeWidth: 3,
    strokeAlpha: 0.75,
    fillColor:   0xf0a020,
    fillAlpha:   0.08,
    innerFill:   0x000810,
    cornerRadius: 6,
  },

  symbols: [
    { name: 'Ten',    textureKey: 'sym_10'          },
    { name: 'J',      textureKey: 'sym_J'           },
    { name: 'Q',      textureKey: 'sym_Q'           },
    { name: 'K',      textureKey: 'sym_K'           },
    { name: 'A',      textureKey: 'sym_A'           },
    { name: 'Anchor', textureKey: 'sym_anchor'      },
    { name: 'Chest',  textureKey: 'sym_chest'       },
    { name: 'Skull',  textureKey: 'sym_skull'       },
    { name: 'Wild',   textureKey: 'sym_wild',    isWild: true    },
    { name: 'Scatter',textureKey: 'sym_scatter', isScatter: true },
    { name: 'Bonus',  textureKey: 'sym_bonus',   isBonus: true   },
  ],

  symbolStyles: {
    Ten:    { bg: 0x001020, text: 0x4488aa, label: '10'     },
    J:      { bg: 0x001020, text: 0x5599bb, label: 'J'      },
    Q:      { bg: 0x001020, text: 0x66aacc, label: 'Q'      },
    K:      { bg: 0x001020, text: 0x77bbdd, label: 'K'      },
    A:      { bg: 0x001020, text: 0x88ccee, label: 'A'      },
    Anchor: { bg: 0x001520, text: 0x00bbff, label: '⚓'     },
    Chest:  { bg: 0x1a0a00, text: 0xffaa00, label: '🎁'     },
    Skull:  { bg: 0x1a0000, text: 0xff4444, label: '💀'     },
    Wild:   { bg: 0x1a1000, text: 0xf0a020, label: 'WILD'   },
    Scatter:{ bg: 0x001010, text: 0x00ffcc, label: '🗺'     },
    Bonus:  { bg: 0x0a0a00, text: 0xffdd00, label: 'BONUS'  },
  },

  paytable: {
    Skull:   [0, 0, 100, 500, 2500],
    Chest:   [0, 0,  50, 200,  750],
    Anchor:  [0, 0,  25, 100,  400],
    A:       [0, 0,  10,  40,  150],
    K:       [0, 0,   8,  30,  100],
    Q:       [0, 0,   6,  20,   80],
    J:       [0, 0,   4,  15,   60],
    Ten:     [0, 0,   3,  10,   40],
    Wild:    [0, 0,  20,  80,  300],
  },
};
