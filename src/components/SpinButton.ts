import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { gsap } from 'gsap';
import { audioManager } from '../audio/AudioManager.ts';

export class SpinButton {
  readonly container = new Container();
  onPress: (() => void) | null = null;
  private bg!: Graphics;
  private label!: Text;
  private glowTween?: gsap.core.Tween;

  constructor() {
    this.build();
  }

  private build(): void {
    const R = 56;

    // Glow circle (behind button)
    const glow = new Graphics().circle(0, 0, R + 12).fill({ color: 0xf5c842, alpha: 0.25 });
    this.container.addChild(glow);

    // Button body
    this.bg = new Graphics().circle(0, 0, R).fill({ color: 0xc8172b });
    this.container.addChild(this.bg);

    // Gold ring
    new Graphics().circle(0, 0, R).stroke({ color: 0xf5c842, width: 3 });
    const ring = new Graphics().circle(0, 0, R).stroke({ color: 0xf5c842, width: 3 });
    this.container.addChild(ring);

    // Label
    const style = new TextStyle({
      fontFamily: 'Impact, sans-serif',
      fontSize: 22,
      fontWeight: 'bold',
      fill: 0xffffff,
      letterSpacing: 3,
    });
    this.label = new Text({ text: 'SPIN', style });
    this.label.anchor.set(0.5);
    this.container.addChild(this.label);

    // Idle pulse
    this.glowTween = gsap.to(glow, { alpha: 0.55, duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // Interactivity
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';

    this.container.on('pointerover',  () => { audioManager.play('button_hover'); gsap.to(this.container.scale, { x: 1.05, y: 1.05, duration: 0.15 }); });
    this.container.on('pointerout',   () => gsap.to(this.container.scale, { x: 1, y: 1, duration: 0.15 }));
    this.container.on('pointerdown',  () => { audioManager.play('button_press'); gsap.to(this.container.scale, { x: 0.95, y: 0.95, duration: 0.08 }); });
    this.container.on('pointerup',    () => { gsap.to(this.container.scale, { x: 1, y: 1, duration: 0.12 }); this.onPress?.(); });
  }

  setSpinning(spinning: boolean): void {
    this.label.text = spinning ? 'STOP' : 'SPIN';
    this.bg.clear();
    this.bg.circle(0, 0, 56).fill({ color: spinning ? 0x2a6ac8 : 0xc8172b });
    this.container.eventMode = spinning ? 'none' : 'static';
  }
}
