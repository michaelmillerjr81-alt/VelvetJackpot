import { Container, Graphics } from 'pixi.js';
import { gsap } from 'gsap';

export class FlashOverlay {
  readonly container = new Container();
  private quad: Graphics;

  constructor(W: number, H: number) {
    this.quad = new Graphics().rect(0, 0, W, H).fill({ color: 0xffffff });
    this.quad.alpha = 0;
    this.quad.eventMode = 'none';
    this.container.addChild(this.quad);
  }

  async flash(color: number = 0xffffff, maxAlpha: number = 0.85, durationMs: number = 300): Promise<void> {
    this.quad.tint = color;
    const dur = durationMs / 1000;
    await gsap.timeline()
      .to(this.quad, { alpha: maxAlpha, duration: dur * 0.25, ease: 'power2.out' })
      .to(this.quad, { alpha: 0,        duration: dur * 0.75, ease: 'power2.in'  })
      .then();
  }
}
