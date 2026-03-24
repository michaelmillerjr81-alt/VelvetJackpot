import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { ReelSet } from '../components/ReelSet.ts';
import { SpinButton } from '../components/SpinButton.ts';
import { BetPanel } from '../components/BetPanel.ts';
import { BalanceDisplay } from '../components/BalanceDisplay.ts';
import { WinPresentation } from '../components/WinPresentation.ts';
import { PaylineRenderer } from '../components/PaylineRenderer.ts';
import { gameState } from '../state/GameState.ts';
import { apiClient } from '../network/ApiClient.ts';
import { audioManager } from '../audio/AudioManager.ts';
import { REFERENCE_WIDTH, REFERENCE_HEIGHT, SYMBOL_SIZE, GAME_CONFIG } from '../config/gameConfig.ts';
import type { SpinResult } from '../types/index.ts';

export class BaseGameScene {
  readonly container = new Container();
  private app: Application;
  private reelSet!: ReelSet;
  private spinButton!: SpinButton;
  private betPanel!: BetPanel;
  private balanceDisplay!: BalanceDisplay;
  private winPresentation!: WinPresentation;
  private paylineRenderer!: PaylineRenderer;

  constructor(app: Application) {
    this.app = app;
    this.build();
  }

  private build(): void {
    const W = REFERENCE_WIDTH;
    const H = REFERENCE_HEIGHT;

    // Background gradient via layered graphics
    const bg = new Graphics()
      .rect(0, 0, W, H)
      .fill({ color: 0x0a0005 });
    this.container.addChild(bg);

    // Radial center glow
    const glow = new Graphics()
      .circle(W / 2, H * 0.38, 420)
      .fill({ color: 0x1a0a2e, alpha: 0.8 });
    this.container.addChild(glow);

    // Logo
    const logoStyle = new TextStyle({
      fontFamily: 'Georgia, serif',
      fontSize: 52,
      fontWeight: 'bold',
      fill: 0xf5c842,
      dropShadow: { color: 0x000000, blur: 12, distance: 4 },
      letterSpacing: 6,
    });
    const logo = new Text({ text: 'VELVET JACKPOT', style: logoStyle });
    logo.anchor.set(0.5);
    logo.x = W / 2;
    logo.y = H * 0.06;
    this.container.addChild(logo);

    // Decorative gold separator lines
    const sep = new Graphics()
      .rect(W * 0.1, H * 0.105, W * 0.8, 1)
      .fill({ color: 0xf5c842, alpha: 0.3 });
    this.container.addChild(sep);

    // Reel frame border
    const reelCols = GAME_CONFIG.reelCount;
    const reelRows = GAME_CONFIG.rowCount;
    const frameW = (SYMBOL_SIZE + 8) * reelCols + 24;
    const frameH = SYMBOL_SIZE * reelRows + 24;
    const frameX = W / 2 - frameW / 2;
    const frameY = H * 0.17;

    const outerFrame = new Graphics()
      .roundRect(frameX - 6, frameY - 6, frameW + 12, frameH + 12, 12)
      .fill({ color: 0xf5c842, alpha: 0.15 })
      .roundRect(frameX - 6, frameY - 6, frameW + 12, frameH + 12, 12)
      .stroke({ color: 0xf5c842, width: 3, alpha: 0.7 });
    this.container.addChild(outerFrame);

    const innerFrame = new Graphics()
      .roundRect(frameX, frameY, frameW, frameH, 8)
      .fill({ color: 0x0d0010 });
    this.container.addChild(innerFrame);

    // Reel set (centered inside frame)
    this.reelSet = new ReelSet();
    this.reelSet.container.x = W / 2;
    this.reelSet.container.y = frameY + frameH / 2;
    this.container.addChild(this.reelSet.container);

    // Payline overlay
    this.paylineRenderer = new PaylineRenderer();
    this.paylineRenderer.container.x = this.reelSet.container.x;
    this.paylineRenderer.container.y = this.reelSet.container.y;
    this.container.addChild(this.paylineRenderer.container);

    // Control bar background
    const ctrlBarY = H * 0.82;
    const ctrlBar = new Graphics()
      .rect(0, ctrlBarY, W, H - ctrlBarY)
      .fill({ color: 0x0d0010 })
      .rect(0, ctrlBarY, W, 2)
      .fill({ color: 0xf5c842, alpha: 0.4 });
    this.container.addChild(ctrlBar);

    // Balance display
    this.balanceDisplay = new BalanceDisplay(W);
    this.balanceDisplay.container.y = ctrlBarY + 38;
    this.container.addChild(this.balanceDisplay.container);

    // Bet label
    const betCapStyle = new TextStyle({ fontFamily: 'monospace', fontSize: 13, fill: 0x888888 });
    const betCap = new Text({ text: 'PLAY AMOUNT', style: betCapStyle });
    betCap.anchor.set(0.5);
    betCap.x = W * 0.3;
    betCap.y = ctrlBarY + 100;
    this.container.addChild(betCap);

    // Bet panel
    this.betPanel = new BetPanel();
    this.betPanel.container.x = W * 0.3;
    this.betPanel.container.y = ctrlBarY + 130;
    this.container.addChild(this.betPanel.container);

    // Spin button
    this.spinButton = new SpinButton();
    this.spinButton.container.x = W * 0.72;
    this.spinButton.container.y = ctrlBarY + 120;
    this.spinButton.onPress = () => this.handleSpin();
    this.container.addChild(this.spinButton.container);

    // Sweep label
    const sweepStyle = new TextStyle({ fontFamily: 'sans-serif', fontSize: 11, fill: 0x444444 });
    const sweepText = new Text({ text: 'For entertainment only. No purchase necessary to play.', style: sweepStyle });
    sweepText.anchor.set(0.5);
    sweepText.x = W / 2;
    sweepText.y = H - 18;
    this.container.addChild(sweepText);

    // Win presentation (topmost layer)
    this.winPresentation = new WinPresentation(W, H);
    this.container.addChild(this.winPresentation.container);

    // Suppress unused warning — app used for future scene transitions
    void this.app;
  }

  private async handleSpin(): Promise<void> {
    if (gameState.isSpinning) return;
    if (!gameState.deductBet()) return;

    gameState.setSpinning(true);
    this.spinButton.setSpinning(true);
    audioManager.play('spin_start');
    this.reelSet.beginSpin();

    let result: SpinResult;
    try {
      result = await apiClient.spin({
        bet: gameState.currentBet,
        currency: gameState.currencyMode,
      });
    } catch (err) {
      console.error('[SPIN] API error:', err);
      this.reelSet.abortSpin();
      gameState.setSpinning(false);
      this.spinButton.setSpinning(false);
      return;
    }

    await this.reelSet.stopSpin(result.grid);

    if (result.totalWin > 0) {
      gameState.applyWin(result.totalWin);
      await this.paylineRenderer.show(result.winLines);
      await this.winPresentation.show(result.totalWin, gameState.currentBet);
    }

    gameState.setSpinning(false);
    this.spinButton.setSpinning(false);
  }
}
