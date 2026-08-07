/**
 * Deterministic Seeded Pseudo-Random Number Generator.
 * Used to completely eliminate Math.random() from the generation pipeline.
 * Ensures that Job(seed, config) always produces identical Candidates.
 */
export class SeededRNG {
  private state: number;

  constructor(seed: string | number) {
    this.state = this.hashString(seed.toString());
  }

  /**
   * Generates a deterministic pseudo-random float between [0, 1).
   * Mulberry32 implementation.
   */
  public next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generates an integer between [min, max] inclusive.
   */
  public nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Selects a random element from an array.
   */
  public select<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Shuffles an array in place using Fisher-Yates and the deterministic seed.
   */
  public shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    // Mix it to avoid zero seeds
    return hash + 0x6d2b79f5;
  }
}
