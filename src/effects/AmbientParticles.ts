import { Application, Container, Graphics } from 'pixi.js';

interface Particle {
  gfx: Graphics;
  x: number;
  y: number;
  vy: number;
  vx: number;
  alpha: number;
  phase: number;
  radius: number;
}

export class AmbientParticles {
  readonly container = new Container();
  private particles: Particle[] = [];
  private ticker: ((ticker: { deltaTime: number }) => void) | null = null;
  private W: number;
  private H: number;

  constructor(W: number, H: number) {
    this.W = W;
    this.H = H;
  }

  init(app: Application, color: number = 0xf5c842): void {
    const isMobile = (navigator.hardwareConcurrency ?? 4) < 4;
    const count = isMobile ? 25 : 60;

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 2.5 + 1;
      const alpha = Math.random() * 0.18 + 0.04;
      const gfx = new Graphics().circle(0, 0, radius).fill({ color, alpha });
      gfx.blendMode = 'add';
      gfx.x = Math.random() * this.W;
      gfx.y = Math.random() * this.H;
      this.container.addChild(gfx);

      this.particles.push({
        gfx,
        x: gfx.x,
        y: gfx.y,
        vy: -(Math.random() * 0.4 + 0.1),
        vx: (Math.random() - 0.5) * 0.2,
        alpha,
        phase: Math.random() * Math.PI * 2,
        radius,
      });
    }

    this.ticker = ({ deltaTime }) => this.update(deltaTime);
    app.ticker.add(this.ticker);
  }

  private update(dt: number): void {
    for (const p of this.particles) {
      p.phase += 0.02 * dt;
      p.y += p.vy * dt;
      p.x += p.vx * dt + Math.sin(p.phase) * 0.3;

      // Wrap around
      if (p.y < -10) { p.y = this.H + 10; p.x = Math.random() * this.W; }
      if (p.x < -10) p.x = this.W + 10;
      if (p.x > this.W + 10) p.x = -10;

      p.gfx.x = p.x;
      p.gfx.y = p.y;
      // Subtle twinkle
      p.gfx.alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.phase * 1.5));
    }
  }

  destroy(app: Application): void {
    if (this.ticker) app.ticker.remove(this.ticker);
    this.container.destroy({ children: true });
  }
}
