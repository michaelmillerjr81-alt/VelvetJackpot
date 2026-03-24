import type { Application } from 'pixi.js';
import { REFERENCE_WIDTH, REFERENCE_HEIGHT } from '../config/gameConfig.ts';

export function getScale(appWidth: number, appHeight: number): number {
  return Math.min(appWidth / REFERENCE_WIDTH, appHeight / REFERENCE_HEIGHT);
}

export function setupResponsiveScale(app: Application): void {
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    app.renderer.resize(w, h);
    const scale = getScale(w, h);
    app.stage.scale.set(scale);
    app.stage.x = (w - REFERENCE_WIDTH * scale) / 2;
    app.stage.y = (h - REFERENCE_HEIGHT * scale) / 2;
  };

  let debounceTimer: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(resize, 100);
  });

  resize();
}
