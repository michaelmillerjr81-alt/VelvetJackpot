import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

// ── Types ──────────────────────────────────────────────────────────────────

interface Balance { gc: number; sc: number }

interface WinLine {
  lineIndex: number;
  symbolName: string;
  count: number;
  positions: { reel: number; row: number }[];
  payout: number;
}

interface SpinResult {
  grid: string[][];
  winLines: WinLine[];
  totalWin: number;
  currency: 'GC' | 'SC';
  freeSpinsAwarded?: number;
  bonusTriggered?: boolean;
}

// ── In-memory state ────────────────────────────────────────────────────────

const balances = new Map<string, Balance>();
function getBalance(playerId: string): Balance {
  if (!balances.has(playerId)) balances.set(playerId, { gc: 10000, sc: 5 });
  return balances.get(playerId)!;
}

// ── Game config ────────────────────────────────────────────────────────────

const SYMBOLS = ['Ten', 'J', 'Q', 'K', 'A', 'Gem', 'Crown', 'Diamond'];
const WILD    = 'Wild';
const SCATTER = 'Scatter';
const BONUS   = 'Bonus';

// Weighted reel strip — lower-value symbols appear more often
const REEL_STRIP = [
  ...Array(12).fill('Ten'),
  ...Array(10).fill('J'),
  ...Array(9).fill('Q'),
  ...Array(8).fill('K'),
  ...Array(7).fill('A'),
  ...Array(5).fill('Gem'),
  ...Array(4).fill('Crown'),
  ...Array(3).fill('Diamond'),
  ...Array(3).fill(WILD),
  ...Array(3).fill(SCATTER),
  ...Array(2).fill(BONUS),
];

const PAYTABLE: Record<string, number[]> = {
  Diamond: [0, 0, 100, 500, 2500],
  Crown:   [0, 0,  50, 200,  750],
  Gem:     [0, 0,  25, 100,  400],
  A:       [0, 0,  10,  40,  150],
  K:       [0, 0,   8,  30,  100],
  Q:       [0, 0,   6,  20,   80],
  J:       [0, 0,   4,  15,   60],
  Ten:     [0, 0,   3,  10,   40],
  Wild:    [0, 0,  20,  80,  300],
};

// 12 standard paylines for a 5×3 grid
const PAYLINES: { reel: number; row: number }[][] = [
  [{ reel:0,row:1},{reel:1,row:1},{reel:2,row:1},{reel:3,row:1},{reel:4,row:1}], // middle row
  [{ reel:0,row:0},{reel:1,row:0},{reel:2,row:0},{reel:3,row:0},{reel:4,row:0}], // top row
  [{ reel:0,row:2},{reel:1,row:2},{reel:2,row:2},{reel:3,row:2},{reel:4,row:2}], // bottom row
  [{ reel:0,row:0},{reel:1,row:1},{reel:2,row:2},{reel:3,row:1},{reel:4,row:0}], // V shape
  [{ reel:0,row:2},{reel:1,row:1},{reel:2,row:0},{reel:3,row:1},{reel:4,row:2}], // inverted V
  [{ reel:0,row:0},{reel:1,row:0},{reel:2,row:1},{reel:3,row:2},{reel:4,row:2}], // diagonal down
  [{ reel:0,row:2},{reel:1,row:2},{reel:2,row:1},{reel:3,row:0},{reel:4,row:0}], // diagonal up
  [{ reel:0,row:1},{reel:1,row:0},{reel:2,row:0},{reel:3,row:0},{reel:4,row:1}], // top bump
  [{ reel:0,row:1},{reel:1,row:2},{reel:2,row:2},{reel:3,row:2},{reel:4,row:1}], // bottom bump
  [{ reel:0,row:0},{reel:1,row:1},{reel:2,row:0},{reel:3,row:1},{reel:4,row:0}], // zigzag top
  [{ reel:0,row:2},{reel:1,row:1},{reel:2,row:2},{reel:3,row:1},{reel:4,row:2}], // zigzag bot
  [{ reel:0,row:1},{reel:1,row:0},{reel:2,row:1},{reel:3,row:2},{reel:4,row:1}], // wave
];

// ── RNG ────────────────────────────────────────────────────────────────────

function secureRandInt(max: number): number {
  const bytes = crypto.randomBytes(4);
  return bytes.readUInt32BE(0) % max;
}

function spinReel(): string {
  return REEL_STRIP[secureRandInt(REEL_STRIP.length)];
}

function generateGrid(): string[][] {
  const grid: string[][] = [];
  for (let reel = 0; reel < 5; reel++) {
    const col: string[] = [];
    for (let row = 0; row < 3; row++) col.push(spinReel());
    grid.push(col);
  }
  return grid;
}

// ── Evaluation ─────────────────────────────────────────────────────────────

function evaluateGrid(grid: string[][], bet: number): { winLines: WinLine[]; totalWin: number; scatterCount: number; bonusCount: number } {
  const winLines: WinLine[] = [];
  let totalWin = 0;

  for (let li = 0; li < PAYLINES.length; li++) {
    const line = PAYLINES[li];
    const first = grid[line[0].reel][line[0].row];
    const anchor = first === WILD ? (grid[line[1].reel][line[1].row] ?? first) : first;
    if (anchor === SCATTER || anchor === BONUS) continue;

    let count = 0;
    const positions: { reel: number; row: number }[] = [];

    for (const pos of line) {
      const sym = grid[pos.reel][pos.row];
      if (sym === anchor || sym === WILD) {
        count++;
        positions.push(pos);
      } else break;
    }

    if (count >= 3) {
      const payRow = PAYTABLE[anchor];
      const payout = payRow ? (payRow[count - 1] ?? 0) * bet : 0;
      if (payout > 0) {
        winLines.push({ lineIndex: li, symbolName: anchor, count, positions, payout });
        totalWin += payout;
      }
    }
  }

  // Scatter / bonus anywhere on grid
  let scatterCount = 0;
  let bonusCount = 0;
  for (const col of grid) for (const sym of col) {
    if (sym === SCATTER) scatterCount++;
    if (sym === BONUS)   bonusCount++;
  }

  return { winLines, totalWin, scatterCount, bonusCount };
}

// ── Routes ─────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => { res.json({ ok: true }); });

app.get('/api/balance', (req, res) => {
  const playerId = (req.headers['x-player-id'] as string) || 'guest';
  res.json(getBalance(playerId));
});

app.post('/api/spin', (req, res) => {
  const { bet = 1, currency = 'GC' } = req.body as { bet: number; currency: 'GC' | 'SC' };
  const playerId = (req.headers['x-player-id'] as string) || 'guest';

  if (isNaN(bet) || bet <= 0) {
    res.status(400).json({ error: 'Invalid play amount' });
    return;
  }

  const balance = getBalance(playerId);
  const currentBal = currency === 'GC' ? balance.gc : balance.sc;

  if (currentBal < bet) {
    res.status(400).json({ error: 'Insufficient balance' });
    return;
  }

  // Deduct
  if (currency === 'GC') balance.gc -= bet;
  else balance.sc -= bet;

  const grid = generateGrid();
  const { winLines, totalWin, scatterCount, bonusCount } = evaluateGrid(grid, bet);

  // Award
  if (currency === 'GC') balance.gc += totalWin;
  else balance.sc += totalWin;

  // Free spins trigger
  const freeSpinsAwarded = scatterCount >= 3 ? 10 : undefined;
  const bonusTriggered   = bonusCount   >= 3 ? true : undefined;

  const result: SpinResult = {
    grid,
    winLines,
    totalWin,
    currency,
    ...(freeSpinsAwarded ? { freeSpinsAwarded } : {}),
    ...(bonusTriggered   ? { bonusTriggered }   : {}),
  };

  // Log for audit
  console.log(`[SPIN] player=${playerId} bet=${bet} ${currency} win=${totalWin} lines=${winLines.length}`);

  res.json(result);
});

// ── Start ──────────────────────────────────────────────────────────────────

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
app.listen(PORT, () => console.log(`[VelvetJackpot] Backend running on http://localhost:${PORT}`));
