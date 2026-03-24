import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { gsap } from 'gsap';
import { SYMBOL_SIZE } from '../config/gameConfig.ts';
import type { SymbolStyleConfig } from '../types/index.ts';

const PAD = 8;
const S = SYMBOL_SIZE - PAD * 2;
const FALLBACK: SymbolStyleConfig = { bg: 0x1a1a1a, text: 0xaaaaaa, label: '?' };

export class SymbolTile {
  readonly container = new Container();
  private bg!: Graphics;
  private glow!: Graphics;
  private label!: Text;
  private currentName = '';
  private styleMap: Record<string, SymbolStyleConfig>;

  constructor(name: string, styleMap: Record<string, SymbolStyleConfig>) {
    this.styleMap = styleMap;
    this.buildBase();
    this.setSymbol(name);
  }

  private buildBase(): void {
    // Additive glow layer (behind bg, visible on win)
    this.glow = new Graphics().circle(0, 0, S * 0.55).fill({ color: 0xffffff, alpha: 0 });
    this.glow.blendMode = 'add';
    this.container.addChild(this.glow);

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
    const cfg = this.styleMap[name] ?? FALLBACK;

    this.bg.clear()
      .roundRect(-S / 2, -S / 2, S, S, 10)
      .fill({ color: cfg.bg })
      .roundRect(-S / 2, -S / 2, S, S, 10)
      .stroke({ color: cfg.text, width: 2, alpha: 0.4 });

    this.label.text = cfg.label;
    this.label.style.fill = cfg.text;
    this.glow.tint = cfg.text;
    this.container.alpha = 1;
  }

  highlight(on: boolean): void {
    const cfg = this.styleMap[this.currentName] ?? FALLBACK;

    if (on) {
      // Bright border + glow
      this.bg.clear()
        .roundRect(-S / 2, -S / 2, S, S, 10)
        .fill({ color: cfg.bg })
        .roundRect(-S / 2, -S / 2, S, S, 10)
        .stroke({ color: cfg.text, width: 4, alpha: 1.0 });

      gsap.to(this.glow, { alpha: 0.4, duration: 0.15 });
      gsap.fromTo(
        this.container.scale,
        { x: 1, y: 1 },
        { x: 1.12, y: 1.12, duration: 0.18, ease: 'back.out(2)', yoyo: true, repeat: 1 },
      );
    } else {
      this.container.alpha = 0.35;
      gsap.to(this.glow, { alpha: 0, duration: 0.1 });

      this.bg.clear()
        .roundRect(-S / 2, -S / 2, S, S, 10)
        .fill({ color: cfg.bg })
        .roundRect(-S / 2, -S / 2, S, S, 10)
        .stroke({ color: cfg.text, width: 2, alpha: 0.3 });
    }
  }

  resetHighlight(): void {
    this.container.alpha = 1;
    this.container.scale.set(1);
    gsap.to(this.glow, { alpha: 0, duration: 0.2 });
    const cfg = this.styleMap[this.currentName] ?? FALLBACK;
    this.bg.clear()
      .roundRect(-S / 2, -S / 2, S, S, 10)
      .fill({ color: cfg.bg })
      .roundRect(-S / 2, -S / 2, S, S, 10)
      .stroke({ color: cfg.text, width: 2, alpha: 0.4 });
  }
}
