import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { gsap } from 'gsap';
import { REFERENCE_WIDTH, REFERENCE_HEIGHT } from '../config/gameConfig.ts';

export class LoadingScene {
  readonly container = new Container();
  private app: Application;

  constructor(app: Application) {
    this.app = app;
    this.build();
  }

  private build(): void {
    const W = REFERENCE_WIDTH;
    const H = REFERENCE_HEIGHT;

    new Graphics().rect(0, 0, W, H).fill({ color: 0x0a0005 });
    const bg = new Graphics().rect(0, 0, W, H).fill({ color: 0x0a0005 });
    this.container.addChild(bg);

    // Glow circle
    const glow = new Graphics().circle(W / 2, H * 0.40, 300).fill({ color: 0x1a0a2e, alpha: 0.9 });
    this.container.addChild(glow);

    const titleStyle = new TextStyle({
      fontFamily: 'Georgia, serif',
      fontSize: 72,
      fontWeight: 'bold',
      fill: 0xf5c842,
      dropShadow: { color: 0x000000, blur: 16, distance: 4 },
      letterSpacing: 6,
    });
    const title = new Text({ text: 'VELVET JACKPOT', style: titleStyle });
    title.anchor.set(0.5);
    title.x = W / 2;
    title.y = H * 0.38;
    this.container.addChild(title);

    const subStyle = new TextStyle({ fontFamily: 'sans-serif', fontSize: 22, fill: 0xb89a4a, letterSpacing: 8 });
    const sub = new Text({ text: 'SOCIAL SWEEPSTAKES', style: subStyle });
    sub.anchor.set(0.5);
    sub.x = W / 2;
    sub.y = H * 0.45;
    this.container.addChild(sub);

    // Loading bar
    const trackW = W * 0.55;
    const trackH = 8;
    const trackX = (W - trackW) / 2;
    const trackY = H * 0.54;

    const track = new Graphics().roundRect(trackX, trackY, trackW, trackH, 4).fill({ color: 0x2a1a30 });
    this.container.addChild(track);

    const bar = new Graphics();
    this.container.addChild(bar);

    const pctStyle = new TextStyle({ fontFamily: 'monospace', fontSize: 16, fill: 0x666666 });
    const pct = new Text({ text: '0%', style: pctStyle });
    pct.anchor.set(0.5);
    pct.x = W / 2;
    pct.y = trackY + 28;
    this.container.addChild(pct);

    // Store refs
    (this as unknown as Record<string, unknown>)._bar = bar;
    (this as unknown as Record<string, unknown>)._barMeta = { x: trackX, y: trackY, w: trackW, h: trackH };
    (this as unknown as Record<string, unknown>)._pct = pct;

    // Suppress unused app warning
    void this.app;
  }

  async run(): Promise<void> {
    const bar  = (this as unknown as Record<string, unknown>)._bar as Graphics;
    const meta = (this as unknown as Record<string, unknown>)._barMeta as { x: number; y: number; w: number; h: number };
    const pct  = (this as unknown as Record<string, unknown>)._pct as Text;

    // Animate loading bar (no real assets to load yet — simulate brief load)
    await new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 0.12, 1);
        bar.clear().roundRect(meta.x, meta.y, meta.w * progress, meta.h, 4).fill({ color: 0xf5c842 });
        pct.text = `${Math.round(progress * 100)}%`;
        if (progress >= 1) { clearInterval(interval); resolve(); }
      }, 80);
    });

    await gsap.to(this.container, { alpha: 0, duration: 0.5 }).then();
    this.container.destroy({ children: true });

    const { BaseGameScene } = await import('./BaseGameScene.ts');
    const { ThemeRegistry }  = await import('../config/themes/index.ts');
    const themeId = new URLSearchParams(location.search).get('theme') ?? 'velvet';
    const theme   = ThemeRegistry[themeId] ?? ThemeRegistry['velvet'];
    const scene   = new BaseGameScene(this.app, theme);
    this.app.stage.addChild(scene.container);
  }
}
