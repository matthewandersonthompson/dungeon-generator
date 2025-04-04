/**
 * Random number generator class with seed support
 * Provides predictable random number generation for the dungeon generator
 */
export class Random {
    private seed: number;
    private m = 2147483647; // 2^31 - 1
    private a = 16807;      // 7^5
    private c = 0;
    private state: number;
  
    /**
     * Create a new random number generator
     * @param seed String or number seed for the random number generator
     */
    constructor(seed?: string | number) {
      this.seed = this.generateSeed(seed);
      this.state = this.seed;
    }
  
    /**
     * Generate a numerical seed from a string or number
     * @param seed String or number seed
     * @returns Numerical seed
     */
    private generateSeed(seed?: string | number): number {
      if (seed === undefined) {
        return Math.floor(Math.random() * this.m);
      }
  
      if (typeof seed === 'number') {
        return seed;
      }
  
      // Convert string to a number
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash);
    }
  
    /**
     * Reset the random number generator to the initial state
     */
    reset(): void {
      this.state = this.seed;
    }
  
    /**
     * Get the next random number between 0 and 1
     * @returns Random number between 0 and 1
     */
    next(): number {
      this.state = (this.a * this.state + this.c) % this.m;
      return this.state / this.m;
    }
  
    /**
     * Get a random integer between min and max (inclusive)
     * @param min Minimum value
     * @param max Maximum value
     * @returns Random integer between min and max
     */
    nextInt(min: number, max: number): number {
      return Math.floor(this.next() * (max - min + 1)) + min;
    }
  
    /**
     * Get a random float between min and max
     * @param min Minimum value
     * @param max Maximum value
     * @returns Random float between min and max
     */
    nextFloat(min: number, max: number): number {
      return this.next() * (max - min) + min;
    }
  
    /**
     * Get a random boolean with the given probability
     * @param probability Probability of returning true (default: 0.5)
     * @returns Random boolean
     */
    nextBoolean(probability: number = 0.5): boolean {
      return this.next() < probability;
    }
  
    /**
     * Get a random element from an array
     * @param array Array to choose from
     * @returns Random element from the array
     */
    nextElement<T>(array: T[]): T {
      return array[this.nextInt(0, array.length - 1)];
    }
  }