export class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private reset: (item: T) => void;

  constructor(factory: () => T, reset: (item: T) => void, prewarm = 0) {
    this.factory = factory;
    this.reset = reset;
    for (let i = 0; i < prewarm; i++) this.pool.push(factory());
  }

  get(): T {
    return this.pool.pop() ?? this.factory();
  }

  release(item: T): void {
    this.reset(item);
    this.pool.push(item);
  }

  get size(): number {
    return this.pool.length;
  }
}
