export class Random {
  private seed: number;
  private m = 2147483647;
  private a = 16807;
  private c = 0;
  private state: number;

  constructor(seed?: string | number) {
    this.seed = this.generateSeed(seed);
    this.state = this.seed;
  }

  private generateSeed(seed?: string | number): number {
    if (seed === undefined) return Math.floor(Math.random() * this.m);
    if (typeof seed === 'number') return seed;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  reset(): void {
    this.state = this.seed;
  }

  next(): number {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state / this.m;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  nextBoolean(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  nextElement<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}
