import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { gsap } from 'gsap';
import { GAME_CONFIG } from '../config/gameConfig.ts';
import { gameState } from '../state/GameState.ts';
import { audioManager } from '../audio/AudioManager.ts';

export class BetPanel {
  readonly container = new Container();
  private betLabel!: Text;
  private betIndex = GAME_CONFIG.betLevels.indexOf(GAME_CONFIG.defaultBet);

  constructor() {
    this.build();
  }

  private build(): void {
    const btnStyle = new TextStyle({ fontFamily: 'sans-serif', fontSize: 28, fill: 0xf5c842, fontWeight: 'bold' });
    const labelStyle = new TextStyle({ fontFamily: 'monospace', fontSize: 22, fill: 0xffffff });
    const captionStyle = new TextStyle({ fontFamily: 'sans-serif', fontSize: 14, fill: 0x888888 });

    const caption = new Text({ text: 'PLAY AMOUNT', style: captionStyle });
    caption.anchor.set(0.5); caption.x = 80;
    this.container.addChild(caption);

    const minus = this.makeBtn('-', btnStyle, -60, () => this.changeBet(-1));
    const plus  = this.makeBtn('+', btnStyle,  60, () => this.changeBet(+1));
    this.container.addChild(minus);
    this.container.addChild(plus);

    this.betLabel = new Text({ text: this.formatBet(), style: labelStyle });
    this.betLabel.anchor.set(0.5); this.betLabel.x = 0; this.betLabel.y = 18;
    this.container.addChild(this.betLabel);
  }

  private makeBtn(label: string, style: TextStyle, x: number, action: () => void): Container {
    const c = new Container();
    c.x = x; c.y = 18;
    const bg = new Graphics().circle(0, 0, 22).fill({ color: 0x2a1a30 });
    const t = new Text({ text: label, style });
    t.anchor.set(0.5);
    c.addChild(bg, t);
    c.eventMode = 'static'; c.cursor = 'pointer';
    c.on('pointerdown', () => { gsap.to(c.scale, { x: 0.88, y: 0.88, duration: 0.08 }); action(); });
    c.on('pointerup',   () => gsap.to(c.scale, { x: 1, y: 1, duration: 0.12 }));
    return c;
  }

  private changeBet(dir: number): void {
    this.betIndex = Math.max(0, Math.min(GAME_CONFIG.betLevels.length - 1, this.betIndex + dir));
    gameState.setBet(GAME_CONFIG.betLevels[this.betIndex]);
    this.betLabel.text = this.formatBet();
    audioManager.play('bet_change');
  }

  private formatBet(): string {
    return GAME_CONFIG.betLevels[this.betIndex].toFixed(2);
  }
}
