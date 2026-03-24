export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Animate a number from `from` to `to` over `duration` ms, calling `onUpdate` each frame. */
export function animateNumber(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void,
): void {
  const start = performance.now();
  const tick = (now: number) => {
    const t = clamp((now - start) / duration, 0, 1);
    onUpdate(Math.round(lerp(from, to, easeOut(t))));
    if (t < 1) requestAnimationFrame(tick);
    else onComplete?.();
  };
  requestAnimationFrame(tick);
}
