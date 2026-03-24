import { Container, Graphics } from 'pixi.js';
import { Reel } from './Reel.ts';
import { GAME_CONFIG, SYMBOL_SIZE, REEL_MASK_ROWS, REEL_SPIN_DURATIONS } from '../config/gameConfig.ts';
import { audioManager } from '../audio/AudioManager.ts';
import type { SymbolStyleConfig, WinLine } from '../types/index.ts';

const VISIBLE_H = SYMBOL_SIZE * REEL_MASK_ROWS;

export class ReelSet {
  readonly container = new Container();
  private reels: Reel[] = [];

  constructor(styleMap: Record<string, SymbolStyleConfig>, frameStroke: number = 0xf5c842) {
    const spacing = SYMBOL_SIZE + 8;
    const totalW = spacing * GAME_CONFIG.reelCount;
    const offsetX = -totalW / 2 + spacing / 2;

    for (let i = 0; i < GAME_CONFIG.reelCount; i++) {
      const reel = new Reel(styleMap);
      reel.container.x = offsetX + i * spacing;
      this.container.addChild(reel.container);
      this.reels.push(reel);
    }

    // Reel dividers between each column
    for (let i = 0; i < GAME_CONFIG.reelCount - 1; i++) {
      const x = offsetX + i * spacing + spacing / 2 + 4;
      const divider = new Graphics()
        .rect(x - 1, -VISIBLE_H / 2, 2, VISIBLE_H)
        .fill({ color: frameStroke, alpha: 0.2 });
      this.container.addChild(divider);
    }
  }

  beginSpin(): void {
    for (const reel of this.reels) reel.beginSpin();
  }

  abortSpin(): void {
    for (const reel of this.reels) reel.stopImmediate();
  }

  async stopSpin(grid: string[][]): Promise<void> {
    const stops: Promise<void>[] = [];
    for (let i = 0; i < this.reels.length; i++) {
      const delay = REEL_SPIN_DURATIONS[i] * 1000;
      const reel = this.reels[i];
      const column = grid[i];
      const reelIdx = i + 1;
      stops.push(
        new Promise<void>((resolve) => {
          setTimeout(async () => {
            await reel.stopSpin(column);
            audioManager.play(`reel_stop_${reelIdx}`);
            resolve();
          }, delay);
        }),
      );
    }
    await Promise.all(stops);
  }

  /** Highlight winning tiles, dim all others */
  applyWinHighlights(winLines: WinLine[]): void {
    const winSet = new Set<string>();
    for (const line of winLines) {
      for (const pos of line.positions) winSet.add(`${pos.reel},${pos.row}`);
    }

    for (let r = 0; r < this.reels.length; r++) {
      for (let row = 0; row < GAME_CONFIG.rowCount; row++) {
        const tile = this.reels[r].getTile(row);
        if (tile) tile.highlight(winSet.has(`${r},${row}`));
      }
    }
  }

  resetHighlights(): void {
    for (const reel of this.reels) {
      for (let row = 0; row < GAME_CONFIG.rowCount; row++) {
        reel.getTile(row)?.resetHighlight();
      }
    }
  }
}
