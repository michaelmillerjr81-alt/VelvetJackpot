import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { gsap } from 'gsap';
import { audioManager } from '../audio/AudioManager.ts';

export class SpinButton {
  readonly container = new Container();
  onPress: (() => void) | null = null;
  private bg!: Graphics;
  private ring!: Graphics;
  private label!: Text;
  private accentColor: number;
  private spinColor: number;

  constructor(accentColor: number = 0xf5c842, spinColor: number = 0xc8172b) {
    this.accentColor = accentColor;
    this.spinColor   = spinColor;
    this.build();
  }

  private build(): void {
    const R = 58;

    // Outer glow
    const glow = new Graphics().circle(0, 0, R + 16).fill({ color: this.spinColor, alpha: 0.2 });
    this.container.addChild(glow);

    // Button body
    this.bg = new Graphics().circle(0, 0, R).fill({ color: this.spinColor });
    this.container.addChild(this.bg);

    // Gold ring
    this.ring = new Graphics().circle(0, 0, R).stroke({ color: this.accentColor, width: 3 });
    this.container.addChild(this.ring);

    // Label
    const style = new TextStyle({
      fontFamily: 'Impact, sans-serif',
      fontSize: 22,
      fontWeight: 'bold',
      fill: 0xffffff,
      letterSpacing: 4,
      dropShadow: { color: 0x000000, blur: 6, distance: 2 },
    });
    this.label = new Text({ text: 'SPIN', style });
    this.label.anchor.set(0.5);
    this.container.addChild(this.label);

    // Idle pulse on glow
    gsap.to(glow, { alpha: 0.5, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';

    this.container.on('pointerover',  () => { audioManager.play('button_hover'); gsap.to(this.container.scale, { x: 1.05, y: 1.05, duration: 0.15 }); });
    this.container.on('pointerout',   () => gsap.to(this.container.scale, { x: 1, y: 1, duration: 0.15 }));
    this.container.on('pointerdown',  () => { audioManager.play('button_press'); gsap.to(this.container.scale, { x: 0.94, y: 0.94, duration: 0.08 }); });
    this.container.on('pointerup',    () => { gsap.to(this.container.scale, { x: 1, y: 1, duration: 0.12 }); this.onPress?.(); });
  }

  setSpinning(spinning: boolean): void {
    this.label.text = spinning ? 'STOP' : 'SPIN';
    this.bg.clear().circle(0, 0, 58).fill({ color: spinning ? 0x1a55a0 : this.spinColor });
    this.ring.clear().circle(0, 0, 58).stroke({ color: this.accentColor, width: spinning ? 2 : 3 });
    this.container.eventMode = spinning ? 'none' : 'static';
  }
}
