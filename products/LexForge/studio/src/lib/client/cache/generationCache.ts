export class GenerationCache {
  private cache = new Map<string, { value: any; expiresAt: number }>();

  set(key: string, value: any, ttlMs: number = 60000) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  invalidate(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const generationCache = new GenerationCache();
