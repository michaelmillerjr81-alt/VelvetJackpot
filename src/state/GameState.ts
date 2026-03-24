import type { CurrencyMode, GameMode, PlayerBalance } from '../types/index.ts';
import { GAME_CONFIG } from '../config/gameConfig.ts';

type Listener = () => void;

class GameState {
  balance: PlayerBalance = { gc: 10000, sc: 5 };
  currentBet = GAME_CONFIG.defaultBet;
  currencyMode: CurrencyMode = 'GC';
  mode: GameMode = 'BASE';
  isSpinning = false;
  freeSpinsRemaining = 0;
  lastWin = 0;
  turboMode = false;
  autoPlay = false;

  private listeners = new Set<Listener>();

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit(): void {
    for (const fn of this.listeners) fn();
  }

  getBalance(): number {
    return this.currencyMode === 'GC' ? this.balance.gc : this.balance.sc;
  }

  applyWin(amount: number): void {
    if (this.currencyMode === 'GC') this.balance.gc += amount;
    else this.balance.sc += amount;
    this.lastWin = amount;
    this.emit();
  }

  deductBet(): boolean {
    const bal = this.getBalance();
    if (bal < this.currentBet) return false;
    if (this.currencyMode === 'GC') this.balance.gc -= this.currentBet;
    else this.balance.sc -= this.currentBet;
    this.emit();
    return true;
  }

  setBet(amount: number): void {
    this.currentBet = amount;
    this.emit();
  }

  setCurrencyMode(mode: CurrencyMode): void {
    this.currencyMode = mode;
    this.emit();
  }

  setSpinning(spinning: boolean): void {
    this.isSpinning = spinning;
    this.emit();
  }
}

export const gameState = new GameState();
