import { Container, Graphics, Texture, Sprite } from 'pixi.js';
import { gsap } from 'gsap';
import { GAME_CONFIG, SYMBOL_SIZE, REEL_MASK_ROWS } from '../config/gameConfig.ts';

const VISIBLE_H = SYMBOL_SIZE * REEL_MASK_ROWS;
const STRIP_EXTRA = 4; // extra symbols above the visible area during spin

export class Reel {
  readonly container = new Container();
  private strip = new Container();
  private mask!: Graphics;
  private symbols: Sprite[] = [];
  private spinning = false;
  private spinTicker?: number;

  constructor(private index: number) {
    this.build();
  }

  private build(): void {
    // Clip mask
    this.mask = new Graphics()
      .rect(-SYMBOL_SIZE / 2, -VISIBLE_H / 2, SYMBOL_SIZE, VISIBLE_H)
      .fill({ color: 0xffffff });
    this.container.addChild(this.mask);
    this.container.addChild(this.strip);
    this.strip.mask = this.mask;

    // Seed with placeholder symbols
    const count = REEL_MASK_ROWS + STRIP_EXTRA;
    const symbols = GAME_CONFIG.symbols;
    for (let i = 0; i < count; i++) {
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      const tex = this.getTexture(sym.textureKey);
      const sprite = new Sprite(tex);
      sprite.anchor.set(0.5);
      sprite.width = SYMBOL_SIZE - 8;
      sprite.height = SYMBOL_SIZE - 8;
      sprite.x = 0;
      sprite.y = (i - STRIP_EXTRA) * SYMBOL_SIZE;
      this.strip.addChild(sprite);
      this.symbols.push(sprite);
    }
  }

  private getTexture(key: string): Texture {
    try { return Texture.from(key); }
    catch { return Texture.WHITE; }
  }

  beginSpin(): void {
    this.spinning = true;
    // Phase 1: windup nudge up
    gsap.to(this.strip, {
      y: -30,
      duration: 0.15,
      ease: 'power2.out',
      onComplete: () => this.accelerate(),
    });
  }

  private accelerate(): void {
    if (!this.spinning) return;
    gsap.to(this.strip, { y: SYMBOL_SIZE * 2, duration: 0.2, ease: 'power2.in', onComplete: () => this.fullSpeed() });
  }

  private fullSpeed(): void {
    if (!this.spinning) return;
    let y = this.strip.y;
    const speed = SYMBOL_SIZE * 0.4; // px per frame at 60fps
    const stripH = SYMBOL_SIZE * this.symbols.length;
    const ticker = this.container.eventMode; // use RAF instead
    const tick = () => {
      if (!this.spinning) return;
      y += speed;
      if (y > stripH / 2) y -= stripH;
      this.strip.y = y;
      this.spinTicker = requestAnimationFrame(tick);
    };
    this.spinTicker = requestAnimationFrame(tick);
  }

  async stopSpin(finalSymbols: string[]): Promise<void> {
    this.spinning = false;
    if (this.spinTicker !== undefined) cancelAnimationFrame(this.spinTicker);

    // Snap strip to landing position
    this.strip.y = 0;

    // Apply final symbols to visible rows
    const visibleCount = REEL_MASK_ROWS;
    for (let row = 0; row < visibleCount; row++) {
      const symbolName = finalSymbols[row] ?? '';
      const cfg = GAME_CONFIG.symbols.find(s => s.name === symbolName);
      const tex = cfg ? this.getTexture(cfg.textureKey) : Texture.WHITE;
      if (this.symbols[row + 1]) {
        this.symbols[row + 1].texture = tex;
        this.symbols[row + 1].y = (row - 1) * SYMBOL_SIZE;
      }
    }

    // Phase 4: deceleration overshoot + Phase 5: bounce settle
    await gsap.timeline()
      .to(this.strip, { y: 15, duration: 0.3, ease: 'power2.out' })
      .to(this.strip, { y: 0,  duration: 0.2, ease: 'elastic.out(1, 0.3)' })
      .then();
  }

  stopImmediate(): void {
    this.spinning = false;
    if (this.spinTicker !== undefined) cancelAnimationFrame(this.spinTicker);
    gsap.killTweensOf(this.strip);
    this.strip.y = 0;
  }
}
