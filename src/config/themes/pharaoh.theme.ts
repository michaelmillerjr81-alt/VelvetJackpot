import type { ThemeDefinition } from '../../types/index.ts';

export const pharaohTheme: ThemeDefinition = {
  id: 'pharaoh',
  displayName: "PHARAOH'S FORTUNE",
  tagline: 'TREASURES OF THE NILE',
  logoFontFamily: 'Georgia, serif',
  soundPrefix: 'pharaoh',

  palette: {
    bgDark:          0x0a0800,
    bgMid:           0x1a1200,
    bgGlow:          0x2a1a00,
    accentPrimary:   0xffcc00,
    accentSecondary: 0xcc6600,
    ctrlBar:         0x100c00,
    frameStroke:     0xffcc00,
    frameInner:      0x0d0a00,
    textPrimary:     0xffcc00,
    textDim:         0x887744,
  },

  frameStyle: {
    strokeColor: 0xffcc00,
    strokeWidth: 3,
    strokeAlpha: 0.8,
    fillColor:   0xffcc00,
    fillAlpha:   0.10,
    innerFill:   0x0d0a00,
    cornerRadius: 4,
  },

  symbols: [
    { name: 'Ten',    textureKey: 'sym_10'        },
    { name: 'J',      textureKey: 'sym_J'         },
    { name: 'Q',      textureKey: 'sym_Q'         },
    { name: 'K',      textureKey: 'sym_K'         },
    { name: 'A',      textureKey: 'sym_A'         },
    { name: 'Ankh',   textureKey: 'sym_ankh'      },
    { name: 'Eye',    textureKey: 'sym_eye'       },
    { name: 'Scarab', textureKey: 'sym_scarab'    },
    { name: 'Wild',   textureKey: 'sym_wild',   isWild: true    },
    { name: 'Scatter',textureKey: 'sym_scatter', isScatter: true },
    { name: 'Bonus',  textureKey: 'sym_bonus',   isBonus: true   },
  ],

  symbolStyles: {
    Ten:    { bg: 0x1a1400, text: 0xbbaa44, label: '10'     },
    J:      { bg: 0x1a1400, text: 0xccbb55, label: 'J'      },
    Q:      { bg: 0x1a1400, text: 0xddcc66, label: 'Q'      },
    K:      { bg: 0x1a1400, text: 0xeedd77, label: 'K'      },
    A:      { bg: 0x1a1400, text: 0xffee88, label: 'A'      },
    Ankh:   { bg: 0x2a1800, text: 0xffaa00, label: '☥'      },
    Eye:    { bg: 0x001a2a, text: 0x00aaff, label: '👁'     },
    Scarab: { bg: 0x002a1a, text: 0x00cc88, label: '🪲'     },
    Wild:   { bg: 0x2a1a00, text: 0xffdd00, label: 'WILD'   },
    Scatter:{ bg: 0x1a0a00, text: 0xff8800, label: '🌟'     },
    Bonus:  { bg: 0x0a1a00, text: 0xaaff00, label: 'BONUS'  },
  },

  paytable: {
    Scarab:  [0, 0, 100, 500, 2500],
    Eye:     [0, 0,  50, 200,  750],
    Ankh:    [0, 0,  25, 100,  400],
    A:       [0, 0,  10,  40,  150],
    K:       [0, 0,   8,  30,  100],
    Q:       [0, 0,   6,  20,   80],
    J:       [0, 0,   4,  15,   60],
    Ten:     [0, 0,   3,  10,   40],
    Wild:    [0, 0,  20,  80,  300],
  },
};
