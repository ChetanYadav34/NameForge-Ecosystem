export interface IndustryProfile {
  id: string;
  name: string;
  preferredStrategies: string[];
  bannedStrategies: string[];
  preferredPhonemes?: string[];
  bannedPhonemes?: string[];
  targetLength: {
    min: number;
    max: number;
  };
}

export const industryProfiles: Record<string, IndustryProfile> = {
  tech: {
    id: 'tech',
    name: 'Technology',
    preferredStrategies: ['PortmanteauStrategy', 'RootMergeStrategy'],
    bannedStrategies: [],
    preferredPhonemes: ['v', 'z', 'x', 'k'],
    targetLength: { min: 4, max: 9 }
  },
  medical: {
    id: 'medical',
    name: 'Healthcare & Medical',
    preferredStrategies: ['LatinStrategy', 'GreekStrategy'],
    bannedStrategies: ['PortmanteauStrategy'],
    preferredPhonemes: ['l', 'm', 'n', 's'],
    targetLength: { min: 6, max: 12 }
  },
  automotive: {
    id: 'automotive',
    name: 'Automotive',
    preferredStrategies: ['RootMergeStrategy', 'LatinStrategy'],
    bannedStrategies: [],
    preferredPhonemes: ['r', 't', 'k', 'v'],
    targetLength: { min: 4, max: 8 }
  },
  fashion: {
    id: 'fashion',
    name: 'Fashion & Luxury',
    preferredStrategies: ['LatinStrategy', 'RootMergeStrategy'],
    bannedStrategies: ['PortmanteauStrategy'],
    preferredPhonemes: ['l', 'sh', 'ch', 'v'],
    targetLength: { min: 5, max: 10 }
  },
  finance: {
    id: 'finance',
    name: 'Finance & Banking',
    preferredStrategies: ['RootMergeStrategy', 'LatinStrategy'],
    bannedStrategies: ['PortmanteauStrategy'],
    preferredPhonemes: ['t', 'd', 'k', 'g'],
    targetLength: { min: 6, max: 12 }
  }
};
