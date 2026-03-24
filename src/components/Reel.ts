import { Container, Graphics } from 'pixi.js';
import { gsap } from 'gsap';
import { GAME_CONFIG, SYMBOL_SIZE, REEL_MASK_ROWS } from '../config/gameConfig.ts';
import { SymbolTile } from './SymbolTile.ts';

const VISIBLE_H = SYMBOL_SIZE * REEL_MASK_ROWS;
const STRIP_COUNT = REEL_MASK_ROWS + 4; // extra symbols above for seamless scroll

export class Reel {
  readonly container = new Container();
  private strip = new Container();
  private clipMask!: Graphics;
  private tiles: SymbolTile[] = [];
  private spinning = false;
  private rafId?: number;

  constructor() {
    this.build();
  }

  private build(): void {
    this.clipMask = new Graphics()
      .rect(-SYMBOL_SIZE / 2, -VISIBLE_H / 2, SYMBOL_SIZE, VISIBLE_H)
      .fill({ color: 0xffffff });
    this.container.addChild(this.clipMask);
    this.container.addChild(this.strip);
    this.strip.mask = this.clipMask;

    const symbols = GAME_CONFIG.symbols;
    for (let i = 0; i < STRIP_COUNT; i++) {
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      const tile = new SymbolTile(sym.name);
      tile.container.x = 0;
      tile.container.y = (i - (STRIP_COUNT - REEL_MASK_ROWS)) * SYMBOL_SIZE;
      this.strip.addChild(tile.container);
      this.tiles.push(tile);
    }
  }

  beginSpin(): void {
    this.spinning = true;
    gsap.to(this.strip, {
      y: -30,
      duration: 0.15,
      ease: 'power2.out',
      onComplete: () => this.accelerate(),
    });
  }

  private accelerate(): void {
    if (!this.spinning) return;
    gsap.to(this.strip, {
      y: SYMBOL_SIZE * 2,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => this.fullSpeed(),
    });
  }

  private fullSpeed(): void {
    if (!this.spinning) return;
    let y = this.strip.y;
    const speed = SYMBOL_SIZE * 0.4;
    const stripH = SYMBOL_SIZE * this.tiles.length;

    const tick = () => {
      if (!this.spinning) return;
      y += speed;
      if (y > stripH / 2) y -= stripH;
      this.strip.y = y;
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  async stopSpin(finalSymbols: string[]): Promise<void> {
    this.spinning = false;
    if (this.rafId !== undefined) cancelAnimationFrame(this.rafId);

    this.strip.y = 0;

    // Place final symbols into the visible rows
    for (let row = 0; row < REEL_MASK_ROWS; row++) {
      const name = finalSymbols[row] ?? 'A';
      const tileIdx = row + 1;
      if (this.tiles[tileIdx]) {
        this.tiles[tileIdx].setSymbol(name);
        this.tiles[tileIdx].container.y = (row - 1) * SYMBOL_SIZE;
      }
    }

    await gsap.timeline()
      .to(this.strip, { y: 15,  duration: 0.3, ease: 'power2.out' })
      .to(this.strip, { y: 0,   duration: 0.2, ease: 'elastic.out(1, 0.3)' })
      .then();
  }

  stopImmediate(): void {
    this.spinning = false;
    if (this.rafId !== undefined) cancelAnimationFrame(this.rafId);
    gsap.killTweensOf(this.strip);
    this.strip.y = 0;
  }
}
