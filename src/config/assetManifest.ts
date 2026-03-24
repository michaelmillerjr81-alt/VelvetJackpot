import type { AssetsManifest } from 'pixi.js';

export const ASSET_MANIFEST: AssetsManifest = {
  bundles: [
    {
      name: 'preload',
      assets: [
        { alias: 'logo', src: '/assets/ui/logo.png' },
        { alias: 'loading_bg', src: '/assets/ui/loading_bg.png' },
      ],
    },
    {
      name: 'base-game',
      assets: [
        // Symbols
        { alias: 'sym_A',       src: '/assets/symbols/A.png' },
        { alias: 'sym_K',       src: '/assets/symbols/K.png' },
        { alias: 'sym_Q',       src: '/assets/symbols/Q.png' },
        { alias: 'sym_J',       src: '/assets/symbols/J.png' },
        { alias: 'sym_10',      src: '/assets/symbols/10.png' },
        { alias: 'sym_gem',     src: '/assets/symbols/gem.png' },
        { alias: 'sym_crown',   src: '/assets/symbols/crown.png' },
        { alias: 'sym_diamond', src: '/assets/symbols/diamond.png' },
        { alias: 'sym_wild',    src: '/assets/symbols/wild.png' },
        { alias: 'sym_scatter', src: '/assets/symbols/scatter.png' },
        { alias: 'sym_bonus',   src: '/assets/symbols/bonus.png' },
        // UI
        { alias: 'reel_frame',  src: '/assets/ui/reel_frame.png' },
        { alias: 'spin_btn',    src: '/assets/ui/spin_button.png' },
        { alias: 'coin',        src: '/assets/ui/coin.png' },
      ],
    },
    {
      name: 'bonus',
      assets: [
        { alias: 'chest_closed', src: '/assets/ui/chest_closed.png' },
        { alias: 'chest_open',   src: '/assets/ui/chest_open.png' },
      ],
    },
  ],
};
