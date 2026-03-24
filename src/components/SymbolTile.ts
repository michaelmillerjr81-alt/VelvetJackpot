import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { SYMBOL_SIZE } from '../config/gameConfig.ts';

// Visual config per symbol
const SYMBOL_STYLES: Record<string, { bg: number; text: number; label: string }> = {
  Ten:     { bg: 0x1a1a4a, text: 0x8888ff, label: '10'  },
  J:       { bg: 0x1a3a1a, text: 0x66cc66, label: 'J'   },
  Q:       { bg: 0x2a1a3a, text: 0xaa66cc, label: 'Q'   },
  K:       { bg: 0x3a2a0a, text: 0xddaa33, label: 'K'   },
  A:       { bg: 0x3a0a0a, text: 0xff5555, label: 'A'   },
  Gem:     { bg: 0x0a2a2a, text: 0x33dddd, label: '💎'  },
  Crown:   { bg: 0x2a1a00, text: 0xffaa00, label: '👑'  },
  Diamond: { bg: 0x002a3a, text: 0x00ccff, label: '◆'   },
  Wild:    { bg: 0x2a2000, text: 0xffd700, label: 'WILD' },
  Scatter: { bg: 0x2a0022, text: 0xff44aa, label: '★'   },
  Bonus:   { bg: 0x002a08, text: 0x44ff88, label: 'BONUS'},
};

const FALLBACK = { bg: 0x1a1a1a, text: 0xaaaaaa, label: '?' };
const PAD = 8;
const S = SYMBOL_SIZE - PAD * 2;

export class SymbolTile {
  readonly container = new Container();
  private bg!: Graphics;
  private label!: Text;
  private currentName = '';

  constructor(name: string) {
    this.buildBase();
    this.setSymbol(name);
  }

  private buildBase(): void {
    this.bg = new Graphics();
    this.container.addChild(this.bg);

    const style = new TextStyle({
      fontFamily: 'Impact, Arial, sans-serif',
      fontSize: 32,
      fontWeight: 'bold',
      fill: 0xffffff,
      stroke: { color: 0x000000, width: 4 },
    });
    this.label = new Text({ text: '', style });
    this.label.anchor.set(0.5);
    this.container.addChild(this.label);
  }

  setSymbol(name: string): void {
    if (name === this.currentName) return;
    this.currentName = name;

    const cfg = SYMBOL_STYLES[name] ?? FALLBACK;

    this.bg.clear()
      .roundRect(-S / 2, -S / 2, S, S, 10)
      .fill({ color: cfg.bg })
      .roundRect(-S / 2, -S / 2, S, S, 10)
      .stroke({ color: cfg.text, width: 2, alpha: 0.5 });

    this.label.text = cfg.label;
    this.label.style.fill = cfg.text;
  }

  highlight(on: boolean): void {
    this.container.alpha = on ? 1.0 : 0.4;
    if (on) {
      const cfg = SYMBOL_STYLES[this.currentName] ?? FALLBACK;
      this.bg.clear()
        .roundRect(-S / 2, -S / 2, S, S, 10)
        .fill({ color: cfg.bg })
        .roundRect(-S / 2, -S / 2, S, S, 10)
        .stroke({ color: cfg.text, width: 4, alpha: 1.0 });
    }
  }
}
