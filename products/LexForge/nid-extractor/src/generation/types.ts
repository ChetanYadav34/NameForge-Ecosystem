export type NamingStrategy = 'industry' | 'intent' | 'hybrid';

export interface GenerationRequest {
    requestId: string;
    prompt: string;
    industry: string;
    intent?: string[];
    strategy?: NamingStrategy;
    keywords?: string[];
    styleReferences?: string[]; // e.g., "Apple-like"
    availabilityCheck?: boolean;
}

export interface ArchetypeScore {
    archetype: string;
    confidence: number;
    weight: number;
    rank: number;
}

export interface CandidateScoreComponent {
    semanticRelevance: number;
    industryAffinity: number;
    intentAlignment: number;
    strategyAlignment: number;
    pmiCompatibility: number;
    novelty: number;
    trendVelocity: number;
    structuralSuccess: number;
    semanticPreservation: number;
    mutationQuality: number;
    conceptualDistinctiveness: number;
}

export interface Candidate {
    candidateString: string;
    archetype: string;
    concepts: number[]; // concept_id
    morphemes: number[]; // morpheme_id
    strategySource: 'industry' | 'intent' | 'hybrid';
    mutationHistory: string[];
    scoreComponents: CandidateScoreComponent;
    compositeScore: number;
    availability?: any;
}
