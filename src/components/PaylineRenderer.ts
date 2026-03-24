import { Container, Graphics } from 'pixi.js';
import { gsap } from 'gsap';
import { SYMBOL_SIZE, GAME_CONFIG } from '../config/gameConfig.ts';
import type { WinLine } from '../types/index.ts';

const PAYLINE_COLORS = [0xFFD700, 0xFF4444, 0x44AAFF, 0x44FF88, 0xCC44FF, 0xFF8844, 0x44FFEE];
const SPACING = SYMBOL_SIZE + 8;

export class PaylineRenderer {
  readonly container = new Container();
  private gfx = new Graphics();

  constructor() {
    this.container.addChild(this.gfx);
  }

  async show(winLines: WinLine[]): Promise<void> {
    const totalW = SPACING * GAME_CONFIG.reelCount;
    const offsetX = -totalW / 2 + SPACING / 2;

    for (let li = 0; li < winLines.length; li++) {
      const line = winLines[li];
      const color = PAYLINE_COLORS[li % PAYLINE_COLORS.length];
      this.gfx.clear();
      this.gfx.moveTo(
        offsetX + line.positions[0].reel * SPACING,
        (line.positions[0].row - 1) * SYMBOL_SIZE,
      );
      for (const pos of line.positions) {
        this.gfx.lineTo(
          offsetX + pos.reel * SPACING,
          (pos.row - 1) * SYMBOL_SIZE,
        );
      }
      this.gfx.stroke({ color, width: 4, alpha: 0.85 });

      await gsap.to({}, { duration: 1.5 }).then();
    }

    // Fade out
    await gsap.to(this.gfx, { alpha: 0, duration: 0.3 }).then();
    this.gfx.clear();
    this.gfx.alpha = 1;
  }
}
