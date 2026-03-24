import { Application } from 'pixi.js';
import { setupResponsiveScale } from './utils/scaling.ts';
import { audioManager } from './audio/AudioManager.ts';
import { LoadingScene } from './scenes/LoadingScene.ts';

async function main() {
  const app = new Application();

  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x0a0005,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  document.getElementById('app')!.appendChild(app.canvas);

  setupResponsiveScale(app);

  // Audio must be initialized on first user gesture (browser autoplay policy)
  const initAudio = () => {
    audioManager.init();
    document.removeEventListener('pointerdown', initAudio);
  };
  document.addEventListener('pointerdown', initAudio);

  const loadingScene = new LoadingScene(app);
  app.stage.addChild(loadingScene.container);
  await loadingScene.run();
}

main().catch(console.error);
