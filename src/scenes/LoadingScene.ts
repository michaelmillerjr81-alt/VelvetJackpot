import { Application, Assets, Container, Graphics, Text, TextStyle } from 'pixi.js';
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

    // Background
    const bg = new Graphics()
      .rect(0, 0, W, H)
      .fill({ color: 0x0a0005 });
    this.container.addChild(bg);

    // Logo text
    const titleStyle = new TextStyle({
      fontFamily: 'Georgia, serif',
      fontSize: 72,
      fontWeight: 'bold',
      fill: 0xf5c842,
      dropShadow: { color: 0x000000, blur: 12, distance: 4 },
    });
    const title = new Text({ text: 'VELVET JACKPOT', style: titleStyle });
    title.anchor.set(0.5);
    title.x = W / 2;
    title.y = H * 0.38;
    this.container.addChild(title);

    // Subtitle
    const subStyle = new TextStyle({
      fontFamily: 'sans-serif',
      fontSize: 24,
      fill: 0xb89a4a,
      letterSpacing: 6,
    });
    const sub = new Text({ text: 'SOCIAL SWEEPSTAKES', style: subStyle });
    sub.anchor.set(0.5);
    sub.x = W / 2;
    sub.y = H * 0.45;
    this.container.addChild(sub);

    // Bar track
    const trackW = W * 0.55;
    const trackH = 8;
    const trackX = (W - trackW) / 2;
    const trackY = H * 0.54;

    const track = new Graphics()
      .roundRect(trackX, trackY, trackW, trackH, 4)
      .fill({ color: 0x2a1a30 });
    this.container.addChild(track);

    // Bar fill (starts at 0 width)
    const bar = new Graphics();
    this.container.addChild(bar);

    // Percent label
    const pctStyle = new TextStyle({ fontFamily: 'monospace', fontSize: 18, fill: 0x888888 });
    const pctLabel = new Text({ text: '0%', style: pctStyle });
    pctLabel.anchor.set(0.5);
    pctLabel.x = W / 2;
    pctLabel.y = trackY + 30;
    this.container.addChild(pctLabel);

    // Store refs for run()
    (this as unknown as Record<string, unknown>)._bar = bar;
    (this as unknown as Record<string, unknown>)._barTrack = { x: trackX, y: trackY, w: trackW, h: trackH };
    (this as unknown as Record<string, unknown>)._pctLabel = pctLabel;
  }

  async run(): Promise<void> {
    const bar        = (this as unknown as Record<string, unknown>)._bar as Graphics;
    const track      = (this as unknown as Record<string, unknown>)._barTrack as { x: number; y: number; w: number; h: number };
    const pctLabel   = (this as unknown as Record<string, unknown>)._pctLabel as Text;

    // Preload base game bundle with progress
    await Assets.loadBundle('base-game', (progress: number) => {
      const pct = Math.round(progress * 100);
      bar.clear()
        .roundRect(track.x, track.y, track.w * progress, track.h, 4)
        .fill({ color: 0xf5c842 });
      pctLabel.text = `${pct}%`;
    });

    // Fade out loading scene
    await gsap.to(this.container, { alpha: 0, duration: 0.5 }).then();
    this.container.destroy();

    // Dynamically import and start base game scene
    const { BaseGameScene } = await import('./BaseGameScene.ts');
    const scene = new BaseGameScene(this.app);
    this.app.stage.addChild(scene.container);
  }
}
