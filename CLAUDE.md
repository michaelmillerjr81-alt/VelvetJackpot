# Sweepstakes Slots App — Claude Code Instructions

## Project Overview
This is a casino-quality sweepstakes slots application built for the web using PixiJS (or Phaser) with TypeScript. The app must look and feel indistinguishable from a real casino floor machine — polished, flashy, and satisfying to play.

---

## Tech Stack
- **Renderer**: PixiJS v8+ (preferred) or Phaser 3 for 2D WebGL rendering
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Audio**: Howler.js for cross-browser sound management
- **Animation**: GSAP for complex tweening, PixiJS built-in ticker for frame-based animation
- **Spine**: @pixi-spine for skeletal character/symbol animations (if assets available)
- **State Management**: Zustand or lightweight custom event bus
- **Backend**: Node.js + Express or Fastify with WebSocket support for real-time updates
- **RNG**: Server-side ONLY — never generate outcomes on the client

---

## Design Philosophy
- Every frame should feel like a $50,000 cabinet machine, not a web page.
- Animations are king — the spin, the anticipation, the reveal, and the celebration are what make players come back.
- Sound and visuals must be perfectly synchronized. A win without fanfare feels broken.
- The UI should disappear — players should feel immersed in the machine, not navigating a website.
- Performance is non-negotiable: locked 60fps on mid-range mobile devices.

---

## Visual Design System

### Color Palette
- **Background**: Deep, rich darks — not flat black. Use radial gradients:
  ```
  Center: #1a0a2e (deep purple-black)
  Edge: #0a0612 (near-black)
  ```
- **Gold/Accent**: Rich golds for wins and highlights — `#FFD700`, `#FFA500`, `#F4C430`
- **Reel Frame**: Metallic gradients simulating brushed steel or chrome:
  ```
  Top: #8a8a8a
  Mid: #d4d4d4
  Bottom: #6a6a6a
  ```
- **Win Tiers**:
  - Small win: Gold shimmer `#FFD700`
  - Big win: Electric blue `#00BFFF` + gold
  - Mega win: Purple + magenta `#FF00FF` + gold particle explosion
  - Jackpot: Full-screen rainbow + white flash + gold rain

### Typography
- **Primary Display Font**: Bold, condensed, all-caps for win amounts — use fonts like Oswald, Bebas Neue, or Anton
- **Win counters**: Large (72–120px), with animated number counting (odometer style)
- **UI Text**: Clean sans-serif (Inter, Roboto) at 14–16px for balance/bet displays
- **Apply text effects**: Stroke outlines, drop shadows, and gradient fills on win text using PixiJS text styles:
  ```typescript
  new PIXI.TextStyle({
    fontFamily: 'Anton',
    fontSize: 96,
    fontWeight: 'bold',
    fill: ['#FFD700', '#FF8C00'], // gradient
    stroke: '#000000',
    strokeThickness: 6,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 8,
    dropShadowDistance: 4,
  })
  ```

### Lighting & Atmosphere
- Use additive blend mode sprites for glow effects behind winning symbols
- Simulate ambient light with a soft vignette overlay (darker edges, lighter center)
- Winning paylines should glow and pulse — use a bloom-like effect with blurred, brightened duplicates
- Background should have subtle animated elements: floating particles, slow-moving light rays, or gentle parallax

---

## Reel Mechanics

### Reel Structure
- Standard configuration: 5 reels × 3 visible rows (5×3 grid)
- Each reel is a vertically scrolling strip of symbols rendered as a masked container
- Reel strip length: 30–60 symbols per reel with weighted distribution
- Symbol size: 180×180px to 220×220px depending on screen size

### Spin Behavior
Spin animation must have **five distinct phases** — this is what separates casino quality from amateur:

1. **Start/Windup** (0.15s): Reels nudge UP slightly (opposite direction) with ease-out, like pulling back a spring. Use `GSAP.to(reel, { y: -30, duration: 0.15, ease: 'power2.out' })`

2. **Acceleration** (0.2s): Reels snap downward and rapidly accelerate. Symbols blur (apply a vertical motion blur shader or swap to blurred symbol textures).

3. **Full Speed** (0.4–1.5s): Reels spin at constant max velocity. Symbols are barely distinguishable — use simplified/blurred versions for performance. Each reel has a different duration (left to right: 0.4s, 0.6s, 0.8s, 1.0s, 1.2s) to create the signature cascading stop effect.

4. **Deceleration + Landing** (0.3s): Reel slows with `ease: 'power2.out'`. The target symbol overshoots by ~15px past its final position.

5. **Bounce/Settle** (0.2s): Reel bounces back with `ease: 'elastic.out(1, 0.3)'` to snap into place. Play a satisfying mechanical "click" sound on each reel stop.

### Anticipation/Near-Miss Reels
- If reel 3, 4, or 5 could complete a big win, slow that reel dramatically
- Add a suspenseful delay (0.5–1.5s) with a pulsing glow on the reel frame
- Play a rising tension sound effect (ascending pitch)
- Shake/vibrate the reel frame subtly during anticipation

### Turbo/Quick Spin
- Offer a turbo mode that compresses the full animation to ~0.5s total
- Skip anticipation delays in turbo mode
- Still preserve the bounce-settle on landing (just faster)

---

## Symbol Design

### Symbol Hierarchy (Low to High Value)
```
Low:    10, J, Q, K, A (playing card values)
Mid:    Themed symbols (gems, fruits, characters — 3-4 unique)
High:   Premium themed symbols (2-3 unique, more elaborate)
Wild:   Substitutes for all except scatter — visually distinct, animated idle
Scatter: Triggers bonus/free spins — animated, glowing, always eye-catching
Bonus:  Triggers bonus game — distinct shape/color from other symbols
```

### Symbol Rendering
- Each symbol should have multiple visual states:
  - **Static**: Default resting appearance on the reel
  - **Blurred**: Motion blur version shown during high-speed spin
  - **Dim**: Darkened version for non-winning symbols after a win
  - **Win/Highlight**: Enlarged, glowing, with animated border or particle effect
  - **Animated**: Spine or spritesheet animation triggered on win (e.g., gem sparkles, character celebrates)
- Winning symbols should pop off the reel: scale up to 1.15x with glow backdrop
- Non-winning symbols dim to 40% brightness when a payline is shown

---

## Payline & Win Display

### Payline Rendering
- Draw paylines using `PIXI.Graphics` with smooth curves (quadratic bezier between symbol centers)
- Each payline has a unique color from a predefined palette (gold, red, blue, green, purple, cyan, etc.)
- Paylines animate in sequence: draw on → hold 1.5s → fade → next payline
- Winning symbols along the payline pulse/bounce in sync

### Win Presentation Tiers

| Win Tier | Threshold | Duration | Effects |
|----------|-----------|----------|---------|
| Small | < 5x bet | 1.5s | Payline highlight, coin sound, number tick-up |
| Medium | 5–15x bet | 3s | Symbol animations play, particles along payline, celebratory sound |
| Big Win | 15–50x bet | 5s | Full-screen "BIG WIN" banner, gold coin shower, dramatic music sting, number counter rolls up |
| Mega Win | 50–100x bet | 8s | Screen shake, flashing lights overlay, escalating music, rapid counter, confetti explosion |
| Jackpot | >100x bet or progressive | 12s+ | Full cinematic sequence — screen flash white, dramatic pause, reveal animation, coin waterfall, fireworks particles, looping celebration until player taps |

### Win Counter Animation
- Numbers should rapidly count up from 0 to win amount (odometer/slot counter style)
- Counter speed follows a curve: fast start → decelerate near final amount → snap to exact value
- Each digit change triggers a subtle tick sound
- Final amount lands with a satisfying "cha-ching" and a gold flash

---

## Particle Systems

### Must-Have Particle Effects
Build a reusable particle emitter system with these presets:

1. **Coin Shower**: Gold coins falling with rotation and slight horizontal drift. Use spritesheet animation for spinning coin. Emit from top of screen, fall with gravity + random wobble.

2. **Sparkle Burst**: Small diamond/star particles radiating outward from a point. Used on symbol wins. Short lifespan (0.3–0.5s), random scale and rotation, additive blend mode.

3. **Confetti**: Multi-colored rectangular particles with tumbling rotation on all axes. Used for big wins. Emit from top corners, float down slowly with sine-wave horizontal drift.

4. **Light Rays**: Long, thin, semi-transparent white/gold wedges radiating from center. Slow rotation. Used as background accent during wins.

5. **Fireworks**: Multi-stage: rocket trail upward → explosion burst of colored particles → fade with gravity. Used for jackpots.

6. **Ambient Dust/Bokeh**: Always-on subtle floating particles in the background. Very slow movement, low opacity (0.1–0.3), varying sizes. Adds depth and atmosphere.

### Particle Performance Rules
- Object-pool all particles — never allocate during gameplay
- Cap total active particles at 500 on mobile, 2000 on desktop
- Use GPU-friendly rendering (particle container in PixiJS)
- Kill off-screen particles immediately

---

## Sound Design

### Audio Architecture
- Use Howler.js with Web Audio API backend (HTML5 fallback for iOS Safari)
- Maintain separate volume channels: Master, Music, SFX, Ambient
- All sounds must be preloaded before first spin

### Required Sound Effects
```
Reel Spin:
  - spin_start.mp3       — mechanical click + whoosh on spin initiation
  - spin_loop.mp3        — looping whir during reel motion (pitched per reel speed)
  - reel_stop_1-5.mp3    — 5 variations of mechanical click/thud for reel landing
  - reel_anticipation.mp3 — rising tension tone for near-miss slowing reel

Wins:
  - win_small.mp3        — subtle coin clink + short positive chime
  - win_medium.mp3       — escalating coin sounds + fanfare sting
  - win_big.mp3          — dramatic orchestral hit + coin shower sound
  - win_mega.mp3         — full orchestral swell + crowd cheer + coins
  - win_jackpot.mp3      — extended cinematic reveal + celebration loop
  - counter_tick.mp3     — rapid soft click for win counter incrementing
  - counter_end.mp3      — satisfying "cha-ching" register sound

UI:
  - button_hover.mp3     — subtle soft click
  - button_press.mp3     — satisfying mechanical press
  - bet_change.mp3       — subtle blip (pitched up for increase, down for decrease)
  - balance_update.mp3   — soft coin sound when balance changes

Ambient:
  - background_music.mp3 — looping casino floor ambiance or themed music (low volume)
  - bonus_music.mp3      — distinct music loop for free spins/bonus rounds
```

### Sound Sync Rules
- Reel stop sounds must fire on the EXACT frame the reel settles (not on the overshoot)
- Win sounds start AFTER all reels have stopped and payline begins drawing
- Layer sounds — don't cut one to play another. Multiple SFX should overlap naturally
- Music should duck (reduce volume 50%) during big win fanfares, then restore

---

## UI Layout

### Screen Composition (Portrait Mobile Priority)
```
┌─────────────────────────────┐
│         LOGO / THEME        │  ~8% height
├─────────────────────────────┤
│    WIN DISPLAY / BANNER     │  ~7% height
├─────────────────────────────┤
│                             │
│         REEL AREA           │  ~50% height
│        (5×3 grid)           │
│                             │
├─────────────────────────────┤
│      PAYLINE INDICATOR      │  ~5% height
├─────────────────────────────┤
│  BALANCE  │  BET  │  WIN    │  ~8% height
├─────────────────────────────┤
│  [-] BET [+]  │  [SPIN]    │  ~12% height
├─────────────────────────────┤
│  AUTO │ TURBO │ MENU │ INFO │  ~5% height
└─────────────────────────────┘
```

### Spin Button
- The spin button is the most pressed element — make it feel incredible
- Large (80–100px), circular, with a gradient fill and metallic border
- States:
  - **Idle**: Soft pulsing glow inviting the player to press
  - **Hover**: Brighten + scale to 1.05x
  - **Pressed**: Scale to 0.95x + darken + inset shadow
  - **Spinning** (becomes Stop button): Change color/icon, reduce glow
  - **Disabled** (insufficient balance): Grayed out, no glow, no interaction
- Add a ripple effect emanating from the button on press

### Balance/Bet Display
- Use a faux-LED or digital display aesthetic (segmented font or monospace with glow)
- Balance updates should animate (count up/down smoothly)
- Bet selector: [-] and [+] buttons with current bet displayed between them
- Show both Gold Coins (GC) and Sweeps Coins (SC) balances clearly
- Active currency toggle must be prominent and unambiguous

---

## Sweepstakes Compliance Architecture

### Dual Currency System
This is LEGALLY CRITICAL — the app operates as a sweepstakes, not gambling:

- **Gold Coins (GC)**: Purchased currency, used for entertainment play, cannot be redeemed
- **Sweeps Coins (SC)**: Earned free (via daily login, mail-in, social media, GC purchase bonus), CAN be redeemed for prizes

### Implementation Rules
- GC and SC must be tracked completely separately — different balances, different bet amounts, different win calculations
- Player must always see which currency mode they are in
- SC must be obtainable without purchase (AMOE — Alternate Method of Entry):
  - Free daily login bonus
  - Mail-in request (physical mail)
  - Social media promotions
- Purchase flow: Player buys GC packages → receives bonus SC as a free promotional item
- SC redemption: Convert to prizes/cash equivalent at a fixed rate (e.g., 1 SC = $1)
- NEVER use the words "bet", "gamble", "casino" in user-facing UI. Use "play", "spin", "entry" instead
- Display legal disclaimers and terms of service links in the footer/menu
- All outcomes determined server-side by certified RNG

### RNG & Fairness
- **ALL spin outcomes must be generated server-side** — the client is purely a display layer
- Use a cryptographically secure PRNG (e.g., `crypto.randomBytes` in Node.js)
- Server sends outcome to client → client animates to match the result
- Return-to-player (RTP) must be configurable per game (typically 92–96% for sweepstakes)
- Log every spin for audit trail: timestamp, player ID, bet amount, currency type, outcome, payout
- Implement provably fair verification (optional but builds trust): hash-based commit-reveal scheme

---

## Bonus Features

### Free Spins Round
- Triggered by 3+ Scatter symbols landing anywhere on the reels
- Scatter landing triggers an animated reveal sequence:
  1. Each scatter symbol zooms and glows
  2. Screen transitions (dark overlay + spotlight on scatters)
  3. Free spins count awarded with dramatic number reveal (e.g., "10 FREE SPINS!")
  4. Background changes to bonus theme (different color palette, different music)
- During free spins:
  - Display remaining spins counter prominently
  - Spin button changes to "FREE SPIN" label
  - Wins may have a multiplier (show multiplier badge on screen)
  - Re-triggering scatters adds more free spins with a celebratory animation
- End of free spins:
  - Show total win summary screen with all wins listed
  - Dramatic total reveal animation
  - Transition back to base game

### Pick Bonus Game
- Triggered by 3+ Bonus symbols
- Full-screen overlay mini-game:
  - Present 12–16 hidden items (treasure chests, doors, cards, etc.)
  - Player taps to reveal prizes (coin amounts, multipliers, or "collect" to end)
  - Each reveal has a satisfying open/flip animation
  - Running total displayed at top
  - "Collect All" grand prize hidden among the items

### Progressive Jackpot Display
- Show 2–3 jackpot tiers (Mini, Major, Grand) at top of screen
- Each is a live-updating counter that ticks up by small random amounts every few seconds
- Counters use the LED/digital display style matching the bet display
- Jackpot win triggers the maximum celebration tier (full cinematic sequence)

---

## Responsive Design

### Breakpoints & Orientation
- **Primary target**: Mobile portrait (375×812 to 430×932)
- **Secondary**: Mobile landscape, Tablet portrait, Desktop
- Detect orientation and adjust layout:
  - Portrait: Stack UI vertically (layout above)
  - Landscape: Reels fill center, UI panels on left/right sides
  - Desktop: Centered machine with decorative background

### Scaling Strategy
- Use a reference resolution (e.g., 1080×1920) and scale the entire PixiJS stage proportionally
- Maintain aspect ratio — letterbox with themed background if needed
- Use `renderer.resize()` on window resize events (debounced)
- Touch targets minimum 48×48px on mobile
- Test on iPhone SE (375px) as the minimum supported width

---

## Performance Targets

### Benchmarks
- **60fps** during idle and spin on iPhone 12+ and equivalent Android
- **First playable**: < 3 seconds on 4G connection
- **Total asset size**: < 15MB initial load, lazy-load bonus game assets
- **Memory**: < 200MB heap on mobile

### Optimization Rules
- Texture atlas all symbols into spritesheets (TexturePacker format)
- Use compressed textures (WebP with PNG fallback) — avoid raw PNGs
- Object-pool everything: particles, symbols, temporary sprites
- Use `PIXI.ParticleContainer` for particle systems (no interactivity needed = faster)
- Destroy textures and sprites when scenes unload — prevent memory leaks
- Throttle particle count and effect complexity on low-end devices (detect via `navigator.hardwareConcurrency` and `deviceMemory`)
- Lazy-load audio files — load base game sounds first, bonus sounds on demand
- Use sprite tinting (`sprite.tint`) instead of separate colored texture variants where possible

---

## Project Structure
```
src/
├── main.ts                  # Entry point, PixiJS app init
├── config/
│   ├── gameConfig.ts        # Reel strips, paytable, RTP settings
│   ├── assetManifest.ts     # Asset paths and loading groups
│   └── soundMap.ts          # Sound file mappings and channel config
├── scenes/
│   ├── LoadingScene.ts      # Animated loading bar with logo
│   ├── BaseGameScene.ts     # Main slot machine gameplay
│   ├── FreeSpinsScene.ts    # Free spins bonus round
│   └── BonusGameScene.ts    # Pick bonus mini-game
├── components/
│   ├── Reel.ts              # Single reel with spin physics
│   ├── ReelSet.ts           # Manages all 5 reels, spin orchestration
│   ├── Symbol.ts            # Individual symbol with animation states
│   ├── SpinButton.ts        # The main spin button with all states
│   ├── PaylineRenderer.ts   # Draws animated paylines
│   ├── WinPresentation.ts   # Tiered win celebration system
│   ├── BetPanel.ts          # Bet controls and display
│   ├── BalanceDisplay.ts    # GC/SC balance with animation
│   └── JackpotTicker.ts     # Progressive jackpot counters
├── effects/
│   ├── ParticlePresets.ts   # Coin shower, sparkle, confetti, etc.
│   ├── ScreenShake.ts       # Camera shake effect
│   ├── FlashOverlay.ts      # Full-screen flash/fade effects
│   └── GlowFilter.ts        # Reusable glow/bloom filter
├── audio/
│   └── AudioManager.ts      # Howler.js wrapper, channel management
├── network/
│   ├── ApiClient.ts         # HTTP/WebSocket communication
│   └── SpinRequest.ts       # Spin request/response types
├── state/
│   ├── GameState.ts         # Current game state (balance, bet, mode)
│   └── PlayerSession.ts     # Session management, auth
├── utils/
│   ├── math.ts              # Easing functions, random helpers
│   ├── scaling.ts           # Responsive scaling utilities
│   └── objectPool.ts        # Generic object pool implementation
└── types/
    └── index.ts             # Shared TypeScript interfaces
```

---

## Anti-Patterns — NEVER Do These
- NEVER calculate spin outcomes on the client — this is a legal and security violation
- NEVER use `Math.random()` for anything outcome-related — use server-side crypto RNG
- NEVER skip the bounce/settle phase of reel animation — it feels broken without it
- NEVER play sounds without user interaction first (browsers block autoplay) — init audio on first tap
- NEVER use DOM elements for game rendering — everything in the PixiJS canvas
- NEVER show a flat, static "YOU WIN" text — always animate with particles and counters
- NEVER allow the spin button to be pressed during win presentation — queue the input
- NEVER hard-code bet amounts — always fetch valid bet levels from the server
- NEVER show real currency symbols ($) — always show GC/SC amounts
- NEVER use the word "gambling", "bet", or "wager" in any user-facing text
