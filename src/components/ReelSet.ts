import { Container } from 'pixi.js';
import { Reel } from './Reel.ts';
import { GAME_CONFIG, SYMBOL_SIZE, REEL_SPIN_DURATIONS } from '../config/gameConfig.ts';
import { audioManager } from '../audio/AudioManager.ts';

export class ReelSet {
  readonly container = new Container();
  private reels: Reel[] = [];

  constructor() {
    const spacing = SYMBOL_SIZE + 8;
    const totalW = spacing * GAME_CONFIG.reelCount;
    const offsetX = -totalW / 2 + spacing / 2;

    for (let i = 0; i < GAME_CONFIG.reelCount; i++) {
      const reel = new Reel(i);
      reel.container.x = offsetX + i * spacing;
      this.container.addChild(reel.container);
      this.reels.push(reel);
    }
  }

  beginSpin(): void {
    for (const reel of this.reels) reel.beginSpin();
  }

  abortSpin(): void {
    for (const reel of this.reels) reel.stopImmediate();
  }

  /** Stops reels left-to-right with staggered delays. Returns promise that resolves when last reel lands. */
  async stopSpin(grid: string[][]): Promise<void> {
    const stops: Promise<void>[] = [];
    for (let i = 0; i < this.reels.length; i++) {
      const delay = REEL_SPIN_DURATIONS[i] * 1000;
      const reel = this.reels[i];
      const column = grid[i]; // server grid[reelIndex][rowIndex]
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
}
