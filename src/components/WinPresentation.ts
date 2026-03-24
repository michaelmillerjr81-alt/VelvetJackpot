import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { gsap } from 'gsap';
import { audioManager } from '../audio/AudioManager.ts';
import { animateNumber } from '../utils/math.ts';
import type { WinTier } from '../types/index.ts';

function getWinTier(win: number, bet: number): WinTier {
  const mult = win / bet;
  if (mult >= 100) return 'JACKPOT';
  if (mult >= 50)  return 'MEGA';
  if (mult >= 15)  return 'BIG';
  if (mult >= 5)   return 'MEDIUM';
  return 'SMALL';
}

const TIER_CONFIG: Record<WinTier, { label: string; color: number; duration: number; soundKey: string }> = {
  SMALL:   { label: '',         color: 0xFFD700, duration: 1500, soundKey: 'win_small'  },
  MEDIUM:  { label: '',         color: 0xFFD700, duration: 3000, soundKey: 'win_medium' },
  BIG:     { label: 'BIG WIN!', color: 0xFFD700, duration: 5000, soundKey: 'win_big'    },
  MEGA:    { label: 'MEGA WIN!',color: 0xFF00FF, duration: 8000, soundKey: 'win_mega'   },
  JACKPOT: { label: 'JACKPOT!', color: 0xFFFFFF, duration: 12000,soundKey: 'win_jackpot'},
};

export class WinPresentation {
  readonly container = new Container();
  private overlay!: Graphics;
  private banner!: Text;
  private counter!: Text;

  constructor(private W: number, private H: number) {
    this.build();
  }

  private build(): void {
    this.overlay = new Graphics().rect(0, 0, this.W, this.H).fill({ color: 0x000000, alpha: 0.65 });
    this.overlay.alpha = 0;
    this.container.addChild(this.overlay);

    const bannerStyle = new TextStyle({
      fontFamily: 'Impact, sans-serif',
      fontSize: 96,
      fontWeight: 'bold',
      fill: 0xFFD700,
      stroke: { color: 0x000000, width: 8 },
      dropShadow: { color: 0x000000, blur: 16, distance: 6 },
    });
    this.banner = new Text({ text: '', style: bannerStyle });
    this.banner.anchor.set(0.5);
    this.banner.x = this.W / 2;
    this.banner.y = this.H * 0.38;
    this.banner.alpha = 0;
    this.container.addChild(this.banner);

    const counterStyle = new TextStyle({
      fontFamily: 'Impact, sans-serif',
      fontSize: 72,
      fill: 0xffffff,
      stroke: { color: 0x000000, width: 6 },
    });
    this.counter = new Text({ text: '0', style: counterStyle });
    this.counter.anchor.set(0.5);
    this.counter.x = this.W / 2;
    this.counter.y = this.H * 0.50;
    this.counter.alpha = 0;
    this.container.addChild(this.counter);
  }

  async show(winAmount: number, bet: number): Promise<void> {
    const tier = getWinTier(winAmount, bet);
    const cfg  = TIER_CONFIG[tier];

    audioManager.duck('music', 0.2, 400);
    audioManager.play(cfg.soundKey);

    // Fade in overlay
    await gsap.to(this.overlay, { alpha: 1, duration: 0.3 }).then();

    if (cfg.label) {
      this.banner.text = cfg.label;
      this.banner.style.fill = cfg.color;
      await gsap.fromTo(this.banner, { alpha: 0, scale: 0.5 }, { alpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }).then();
    }

    // Counter
    this.counter.alpha = 1;
    await new Promise<void>((resolve) => {
      animateNumber(0, winAmount, cfg.duration * 0.7, (v) => {
        this.counter.text = v.toLocaleString();
        audioManager.play('counter_tick');
      }, () => {
        audioManager.play('counter_end');
        resolve();
      });
    });

    // Hold then dismiss
    await gsap.to({}, { duration: cfg.duration * 0.001 }).then();
    await gsap.to([this.overlay, this.banner, this.counter], { alpha: 0, duration: 0.4 }).then();

    // Restore music
    audioManager.duck('music', 0.4, 800);

    this.banner.alpha = 0;
    this.counter.alpha = 0;
    this.counter.text = '0';
  }
}
