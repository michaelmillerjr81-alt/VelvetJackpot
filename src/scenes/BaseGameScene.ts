import { Application, Container } from 'pixi.js';
import { ReelSet } from '../components/ReelSet.ts';
import { SpinButton } from '../components/SpinButton.ts';
import { BetPanel } from '../components/BetPanel.ts';
import { BalanceDisplay } from '../components/BalanceDisplay.ts';
import { WinPresentation } from '../components/WinPresentation.ts';
import { PaylineRenderer } from '../components/PaylineRenderer.ts';
import { gameState } from '../state/GameState.ts';
import { apiClient } from '../network/ApiClient.ts';
import { audioManager } from '../audio/AudioManager.ts';
import { REFERENCE_WIDTH, REFERENCE_HEIGHT } from '../config/gameConfig.ts';
import type { SpinResult } from '../types/index.ts';

export class BaseGameScene {
  readonly container = new Container();
  private reelSet!: ReelSet;
  private spinButton!: SpinButton;
  private betPanel!: BetPanel;
  private balanceDisplay!: BalanceDisplay;
  private winPresentation!: WinPresentation;
  private paylineRenderer!: PaylineRenderer;

  constructor(private app: Application) {
    this.build();
    audioManager.play('background_music');
  }

  private build(): void {
    const W = REFERENCE_WIDTH;
    const H = REFERENCE_HEIGHT;

    // Reel area (centered, takes ~50% of height)
    this.reelSet = new ReelSet();
    this.reelSet.container.x = W / 2;
    this.reelSet.container.y = H * 0.35;
    this.container.addChild(this.reelSet.container);

    // Payline overlay (sits on top of reels)
    this.paylineRenderer = new PaylineRenderer();
    this.paylineRenderer.container.x = this.reelSet.container.x;
    this.paylineRenderer.container.y = this.reelSet.container.y;
    this.container.addChild(this.paylineRenderer.container);

    // Win presentation (full-screen overlay)
    this.winPresentation = new WinPresentation(W, H);
    this.container.addChild(this.winPresentation.container);

    // Balance display (top bar)
    this.balanceDisplay = new BalanceDisplay(W);
    this.balanceDisplay.container.y = H * 0.87;
    this.container.addChild(this.balanceDisplay.container);

    // Bet panel
    this.betPanel = new BetPanel();
    this.betPanel.container.x = W / 2 - 160;
    this.betPanel.container.y = H * 0.92;
    this.container.addChild(this.betPanel.container);

    // Spin button
    this.spinButton = new SpinButton();
    this.spinButton.container.x = W / 2 + 180;
    this.spinButton.container.y = H * 0.92;
    this.spinButton.onPress = () => this.handleSpin();
    this.container.addChild(this.spinButton.container);
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

    // Stop reels sequentially with server result
    await this.reelSet.stopSpin(result.grid);

    // Show paylines and win
    if (result.totalWin > 0) {
      gameState.applyWin(result.totalWin);
      await this.paylineRenderer.show(result.winLines);
      await this.winPresentation.show(result.totalWin, gameState.currentBet);
    }

    gameState.setSpinning(false);
    this.spinButton.setSpinning(false);
  }
}
