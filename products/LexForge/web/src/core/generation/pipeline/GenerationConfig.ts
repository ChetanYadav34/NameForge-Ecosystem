export interface GenerationConfig {
  maxCandidates: number;
  minScoreThreshold: number;
  enabledStrategies: string[];
  enabledProviders: string[];
  rankingWeights: {
    semantic: number;
    phonetic: number;
    psychology: number;
    brandability: number;
    originality: number;
    length: number;
  };
  strategyWeights: Record<string, number>;
  filteringThresholds: {
    minLength: number;
    maxLength: number;
    maxDuplicates: number;
  };
  loggingOptions: {
    enableConsole: boolean;
    enableRemote: boolean;
    traceAllSteps: boolean;
  };
  debugMode: boolean;
}

export const defaultGenerationConfig: GenerationConfig = {
  maxCandidates: 50,
  minScoreThreshold: 70,
  enabledStrategies: [
    'LatinStrategy',
    'GreekStrategy',
    'SanskritStrategy',
    'RootMergeStrategy',
    'BlendStrategy',
    'TechnologyStrategy',
    'LuxuryStrategy',
    'MedicalStrategy'
  ],
  enabledProviders: [
    'DictionaryProvider',
    'SemanticProvider',
    'PhoneticProvider',
    'PsychologyProvider',
    'OntologyProvider',
    'RankingProvider'
  ],
  rankingWeights: {
    semantic: 1.5,
    phonetic: 1.2,
    psychology: 1.0,
    brandability: 2.0,
    originality: 1.3,
    length: 0.8
  },
  strategyWeights: {
    'LatinStrategy': 1.0,
    'GreekStrategy': 1.0,
    'SanskritStrategy': 1.0,
    'RootMergeStrategy': 1.2,
    'BlendStrategy': 1.5,
    'TechnologyStrategy': 1.0,
    'LuxuryStrategy': 1.0,
    'MedicalStrategy': 1.0
  },
  filteringThresholds: {
    minLength: 3,
    maxLength: 12,
    maxDuplicates: 0
  },
  loggingOptions: {
    enableConsole: true,
    enableRemote: false,
    traceAllSteps: false
  },
  debugMode: false
};
