import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { gsap } from 'gsap';
import { ReelSet } from '../components/ReelSet.ts';
import { SpinButton } from '../components/SpinButton.ts';
import { BetPanel } from '../components/BetPanel.ts';
import { BalanceDisplay } from '../components/BalanceDisplay.ts';
import { WinPresentation } from '../components/WinPresentation.ts';
import { PaylineRenderer } from '../components/PaylineRenderer.ts';
import { AmbientParticles } from '../effects/AmbientParticles.ts';
import { FlashOverlay } from '../effects/FlashOverlay.ts';
import { gameState } from '../state/GameState.ts';
import { apiClient } from '../network/ApiClient.ts';
import { audioManager } from '../audio/AudioManager.ts';
import { REFERENCE_WIDTH, REFERENCE_HEIGHT, SYMBOL_SIZE, GAME_CONFIG } from '../config/gameConfig.ts';
import { velvetTheme } from '../config/themes/index.ts';
import type { SpinResult, ThemeDefinition } from '../types/index.ts';

export class BaseGameScene {
  readonly container = new Container();
  private app: Application;
  private theme: ThemeDefinition;
  private reelSet!: ReelSet;
  private spinButton!: SpinButton;
  private betPanel!: BetPanel;
  private balanceDisplay!: BalanceDisplay;
  private winPresentation!: WinPresentation;
  private paylineRenderer!: PaylineRenderer;
  private ambientParticles!: AmbientParticles;
  private flashOverlay!: FlashOverlay;

  constructor(app: Application, theme: ThemeDefinition = velvetTheme) {
    this.app = app;
    this.theme = theme;
    this.build();
  }

  private build(): void {
    const W = REFERENCE_WIDTH;
    const H = REFERENCE_HEIGHT;
    const p = this.theme.palette;
    const f = this.theme.frameStyle;

    // ── Background ──────────────────────────────────────────────────────
    const bg = new Graphics().rect(0, 0, W, H).fill({ color: p.bgDark });
    this.container.addChild(bg);

    // Ambient particles (bokeh layer, sits above bg)
    this.ambientParticles = new AmbientParticles(W, H);
    this.ambientParticles.init(this.app, p.accentPrimary);
    this.container.addChild(this.ambientParticles.container);

    // Radial center glow
    const glow = new Graphics().circle(W / 2, H * 0.36, 460).fill({ color: p.bgMid, alpha: 0.85 });
    this.container.addChild(glow);

    // Secondary off-center light
    const glow2 = new Graphics().ellipse(W * 0.15, H * 0.2, 240, 160).fill({ color: p.bgGlow, alpha: 0.35 });
    this.container.addChild(glow2);

    // Slow-rotating light ray
    const ray = new Graphics()
      .moveTo(W / 2, H * 0.35)
      .lineTo(W / 2 - 500, H)
      .lineTo(W / 2 + 500, H)
      .fill({ color: p.accentPrimary, alpha: 0.025 });
    this.container.addChild(ray);
    this.app.ticker.add((t) => { ray.rotation += 0.0003 * t.deltaTime; });

    // ── Logo ──────────────────────────────────────────────────────────
    const logoStyle = new TextStyle({
      fontFamily: this.theme.logoFontFamily,
      fontSize: 54,
      fontWeight: 'bold',
      fill: p.accentPrimary,
      dropShadow: { color: 0x000000, blur: 16, distance: 4 },
      letterSpacing: 5,
    });
    const logo = new Text({ text: this.theme.displayName, style: logoStyle });
    logo.anchor.set(0.5);
    logo.x = W / 2;
    logo.y = H * 0.06;
    this.container.addChild(logo);

    // Tagline
    const tagStyle = new TextStyle({ fontFamily: 'sans-serif', fontSize: 16, fill: p.textDim, letterSpacing: 6 });
    const tag = new Text({ text: this.theme.tagline, style: tagStyle });
    tag.anchor.set(0.5);
    tag.x = W / 2;
    tag.y = H * 0.105;
    this.container.addChild(tag);

    // Gold separator
    const sep = new Graphics().rect(W * 0.12, H * 0.127, W * 0.76, 1).fill({ color: p.accentPrimary, alpha: 0.25 });
    this.container.addChild(sep);

    // ── Reel Frame ────────────────────────────────────────────────────
    const reelCols = GAME_CONFIG.reelCount;
    const reelRows = GAME_CONFIG.rowCount;
    const frameW = (SYMBOL_SIZE + 8) * reelCols + 24;
    const frameH = SYMBOL_SIZE * reelRows + 24;
    const frameX = W / 2 - frameW / 2;
    const frameY = H * 0.155;

    // Outer glow border
    const outerFrame = new Graphics()
      .roundRect(frameX - 8, frameY - 8, frameW + 16, frameH + 16, f.cornerRadius + 4)
      .fill({ color: f.strokeColor, alpha: f.fillAlpha })
      .roundRect(frameX - 8, frameY - 8, frameW + 16, frameH + 16, f.cornerRadius + 4)
      .stroke({ color: f.strokeColor, width: f.strokeWidth + 1, alpha: f.strokeAlpha * 0.4 });
    this.container.addChild(outerFrame);

    // Main border
    const mainFrame = new Graphics()
      .roundRect(frameX - 4, frameY - 4, frameW + 8, frameH + 8, f.cornerRadius)
      .fill({ color: f.fillColor, alpha: f.fillAlpha * 0.5 })
      .roundRect(frameX - 4, frameY - 4, frameW + 8, frameH + 8, f.cornerRadius)
      .stroke({ color: f.strokeColor, width: f.strokeWidth, alpha: f.strokeAlpha });
    this.container.addChild(mainFrame);

    // Inner background
    const innerFrame = new Graphics()
      .roundRect(frameX, frameY, frameW, frameH, f.cornerRadius - 2)
      .fill({ color: f.innerFill });
    this.container.addChild(innerFrame);

    // Corner accents
    this.buildCornerAccents(frameX, frameY, frameW, frameH, p.accentPrimary);

    // ── Reels ─────────────────────────────────────────────────────────
    this.reelSet = new ReelSet(this.theme.symbolStyles, f.strokeColor);
    this.reelSet.container.x = W / 2;
    this.reelSet.container.y = frameY + frameH / 2;
    this.container.addChild(this.reelSet.container);

    // Payline overlay
    this.paylineRenderer = new PaylineRenderer();
    this.paylineRenderer.container.x = this.reelSet.container.x;
    this.paylineRenderer.container.y = this.reelSet.container.y;
    this.container.addChild(this.paylineRenderer.container);

    // ── Control bar ───────────────────────────────────────────────────
    const ctrlBarY = H * 0.81;
    const ctrlBar = new Graphics()
      .rect(0, ctrlBarY, W, H - ctrlBarY)
      .fill({ color: p.ctrlBar });
    this.container.addChild(ctrlBar);

    // Gold top edge on ctrl bar
    const ctrlEdge = new Graphics()
      .rect(0, ctrlBarY, W, 2)
      .fill({ color: p.accentPrimary, alpha: 0.5 });
    this.container.addChild(ctrlEdge);

    // Balance display
    this.balanceDisplay = new BalanceDisplay(W, p.accentPrimary, p.textDim, p.ctrlBar);
    this.balanceDisplay.container.y = ctrlBarY + 40;
    this.container.addChild(this.balanceDisplay.container);

    // Horizontal rule between balance and controls
    const midRule = new Graphics()
      .rect(W * 0.05, ctrlBarY + 78, W * 0.9, 1)
      .fill({ color: p.accentPrimary, alpha: 0.12 });
    this.container.addChild(midRule);

    // Bet panel
    this.betPanel = new BetPanel(p.accentPrimary, p.ctrlBar);
    this.betPanel.container.x = W * 0.28;
    this.betPanel.container.y = ctrlBarY + 130;
    this.container.addChild(this.betPanel.container);

    // Spin button
    this.spinButton = new SpinButton(p.accentPrimary, p.accentSecondary);
    this.spinButton.container.x = W * 0.72;
    this.spinButton.container.y = ctrlBarY + 120;
    this.spinButton.onPress = () => this.handleSpin();
    this.container.addChild(this.spinButton.container);

    // Legal disclaimer
    const legalStyle = new TextStyle({ fontFamily: 'sans-serif', fontSize: 11, fill: 0x333333 });
    const legal = new Text({ text: 'For entertainment only. No purchase necessary to play.', style: legalStyle });
    legal.anchor.set(0.5);
    legal.x = W / 2;
    legal.y = H - 16;
    this.container.addChild(legal);

    // Win presentation and flash — topmost layers
    this.winPresentation = new WinPresentation(W, H);
    this.container.addChild(this.winPresentation.container);

    this.flashOverlay = new FlashOverlay(W, H);
    this.container.addChild(this.flashOverlay.container);
  }

  private buildCornerAccents(fx: number, fy: number, fw: number, fh: number, color: number): void {
    const sz = 20;
    const corners = [
      [fx, fy],
      [fx + fw, fy],
      [fx, fy + fh],
      [fx + fw, fy + fh],
    ] as [number, number][];

    for (const [cx, cy] of corners) {
      const g = new Graphics()
        .circle(cx, cy, sz)
        .fill({ color, alpha: 0.25 })
        .circle(cx, cy, sz)
        .stroke({ color, width: 2, alpha: 0.6 });
      this.container.addChild(g);
    }
  }

  private async handleSpin(): Promise<void> {
    if (gameState.isSpinning) return;
    if (!gameState.deductBet()) return;

    gameState.setSpinning(true);
    this.spinButton.setSpinning(true);
    this.reelSet.resetHighlights();
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

      // Highlight winning tiles
      this.reelSet.applyWinHighlights(result.winLines);

      // Flash on big wins
      const mult = result.totalWin / gameState.currentBet;
      if (mult >= 100) {
        void this.flashOverlay.flash(0xffffff, 0.9, 300);
      } else if (mult >= 50) {
        void this.flashOverlay.flash(this.theme.palette.accentPrimary, 0.5, 200);
      }

      await this.paylineRenderer.show(result.winLines);
      await this.winPresentation.show(result.totalWin, gameState.currentBet);

      // Animate reset of highlights
      await gsap.to({}, { duration: 0.3 }).then();
      this.reelSet.resetHighlights();
    }

    gameState.setSpinning(false);
    this.spinButton.setSpinning(false);
  }
}
