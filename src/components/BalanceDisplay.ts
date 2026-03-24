import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { gameState } from '../state/GameState.ts';
import { animateNumber } from '../utils/math.ts';

export class BalanceDisplay {
  readonly container = new Container();
  private screenW: number;
  private gcText!: Text;
  private scText!: Text;
  private winText!: Text;

  constructor(screenW: number) {
    this.screenW = screenW;
    this.build();
    gameState.subscribe(() => this.refresh());
  }

  private build(): void {
    const W = this.screenW;
    const goldStyle = new TextStyle({ fontFamily: 'monospace', fontSize: 28, fill: 0xf5c842, dropShadow: { color: 0x000000, blur: 6, distance: 2 } });
    const dimStyle  = new TextStyle({ fontFamily: 'monospace', fontSize: 14, fill: 0x888888 });

    const bar = new Graphics().rect(0, -32, W, 64).fill({ color: 0x110008 });
    this.container.addChild(bar);

    // GC column
    const gcLabel = new Text({ text: 'GOLD COINS', style: dimStyle });
    gcLabel.anchor.set(0.5); gcLabel.x = W * 0.18; gcLabel.y = -16;
    this.container.addChild(gcLabel);
    this.gcText = new Text({ text: '10,000', style: goldStyle });
    this.gcText.anchor.set(0.5); this.gcText.x = W * 0.18; this.gcText.y = 8;
    this.container.addChild(this.gcText);

    // WIN column
    const winLabel = new Text({ text: 'WIN', style: dimStyle });
    winLabel.anchor.set(0.5); winLabel.x = W * 0.5; winLabel.y = -16;
    this.container.addChild(winLabel);
    this.winText = new Text({ text: '0', style: goldStyle });
    this.winText.anchor.set(0.5); this.winText.x = W * 0.5; this.winText.y = 8;
    this.container.addChild(this.winText);

    // SC column
    const scLabel = new Text({ text: 'SWEEPS COINS', style: dimStyle });
    scLabel.anchor.set(0.5); scLabel.x = W * 0.82; scLabel.y = -16;
    this.container.addChild(scLabel);
    this.scText = new Text({ text: '5.00', style: goldStyle });
    this.scText.anchor.set(0.5); this.scText.x = W * 0.82; this.scText.y = 8;
    this.container.addChild(this.scText);

    this.refresh();
  }

  private refresh(): void {
    const prev = parseFloat(this.gcText.text.replace(/,/g, '')) || 0;
    const nextGC = gameState.balance.gc;
    if (prev !== nextGC) {
      animateNumber(prev, nextGC, 400, (v) => { this.gcText.text = v.toLocaleString(); });
    }
    this.scText.text = gameState.balance.sc.toFixed(2);
    if (gameState.lastWin > 0) {
      animateNumber(0, gameState.lastWin, 800, (v) => { this.winText.text = v.toLocaleString(); });
    }
  }
}
