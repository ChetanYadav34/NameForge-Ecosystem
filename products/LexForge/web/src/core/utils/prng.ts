export function createPRNG(seed: number) {
  let a = seed;
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function shuffleArray<T>(array: T[], prng: () => number): T[] {
  const result = [...array];
  let currentIndex = result.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(prng() * currentIndex);
    currentIndex--;
    [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
  }
  return result;
}
