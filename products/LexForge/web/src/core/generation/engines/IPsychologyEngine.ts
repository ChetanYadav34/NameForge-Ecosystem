export interface EmotionProfile {
  trust: number;
  innovation: number;
  energy: number;
  luxury: number;
  playfulness: number;
}

export interface IPsychologyEngine {
  getEmotionProfile(word: string): EmotionProfile;
  getBrandArchetype(word: string): string;
}
