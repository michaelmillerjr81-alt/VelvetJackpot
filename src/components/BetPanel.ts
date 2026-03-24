import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { gsap } from 'gsap';
import { GAME_CONFIG } from '../config/gameConfig.ts';
import { gameState } from '../state/GameState.ts';
import { audioManager } from '../audio/AudioManager.ts';

export class BetPanel {
  readonly container = new Container();
  private betLabel!: Text;
  private betIndex = GAME_CONFIG.betLevels.indexOf(GAME_CONFIG.defaultBet);
  private accentColor: number;
  private bgColor: number;

  constructor(accentColor: number = 0xf5c842, bgColor: number = 0x0d0010) {
    this.accentColor = accentColor;
    this.bgColor = bgColor;
    this.build();
  }

  private build(): void {
    const btnStyle  = new TextStyle({ fontFamily: 'sans-serif', fontSize: 30, fill: this.accentColor, fontWeight: 'bold' });
    const valStyle  = new TextStyle({ fontFamily: 'monospace',  fontSize: 24, fill: 0xffffff });
    const capStyle  = new TextStyle({ fontFamily: 'sans-serif', fontSize: 13, fill: 0x666666 });

    const cap = new Text({ text: 'PLAY AMOUNT', style: capStyle });
    cap.anchor.set(0.5); cap.x = 0; cap.y = -28;
    this.container.addChild(cap);

    const minus = this.makeBtn('−', btnStyle, -70, () => this.changeBet(-1));
    const plus  = this.makeBtn('+', btnStyle,  70, () => this.changeBet(+1));
    this.container.addChild(minus, plus);

    this.betLabel = new Text({ text: this.formatBet(), style: valStyle });
    this.betLabel.anchor.set(0.5); this.betLabel.x = 0; this.betLabel.y = 10;
    this.container.addChild(this.betLabel);
  }

  private makeBtn(label: string, style: TextStyle, x: number, action: () => void): Container {
    const c = new Container();
    c.x = x; c.y = 10;
    const bg = new Graphics().circle(0, 0, 24).fill({ color: this.bgColor }).circle(0, 0, 24).stroke({ color: this.accentColor, width: 1, alpha: 0.4 });
    const t  = new Text({ text: label, style });
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
