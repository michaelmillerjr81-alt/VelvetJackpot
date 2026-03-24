import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { gameState } from '../state/GameState.ts';
import { animateNumber } from '../utils/math.ts';

export class BalanceDisplay {
  readonly container = new Container();
  private gcText!: Text;
  private scText!: Text;
  private winText!: Text;

  constructor(private screenW: number) {
    this.build();
    gameState.subscribe(() => this.refresh());
  }

  private build(): void {
    const W = this.screenW;
    const style = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 28,
      fill: 0xf5c842,
      dropShadow: { color: 0x000000, blur: 6, distance: 2 },
    });
    const dimStyle = new TextStyle({ fontFamily: 'monospace', fontSize: 16, fill: 0x888888 });

    // Background bar
    const bar = new Graphics().rect(0, -30, W, 60).fill({ color: 0x110008 });
    this.container.addChild(bar);

    // GC
    const gcLabel = new Text({ text: 'GC', style: dimStyle });
    gcLabel.x = W * 0.12; gcLabel.anchor.set(0.5);
    this.container.addChild(gcLabel);
    this.gcText = new Text({ text: '0', style });
    this.gcText.x = W * 0.25; this.gcText.anchor.set(0.5);
    this.container.addChild(this.gcText);

    // WIN
    const winLabel = new Text({ text: 'WIN', style: dimStyle });
    winLabel.x = W * 0.5; winLabel.anchor.set(0.5);
    this.container.addChild(winLabel);
    this.winText = new Text({ text: '0', style });
    this.winText.x = W * 0.5; this.winText.y = 12; this.winText.anchor.set(0.5);
    this.container.addChild(this.winText);

    // SC
    const scLabel = new Text({ text: 'SC', style: dimStyle });
    scLabel.x = W * 0.75; scLabel.anchor.set(0.5);
    this.container.addChild(scLabel);
    this.scText = new Text({ text: '0.00', style });
    this.scText.x = W * 0.88; this.scText.anchor.set(0.5);
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
