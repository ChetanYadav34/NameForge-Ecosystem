import { GenerationPipeline } from '../generation/pipeline/GenerationPipeline';

export interface IGenerationService {
  generate(input: string, seeds?: any[]): Promise<void>;
}

export class RealGenerationService implements IGenerationService {
  private pipeline = new GenerationPipeline();
  private initialized = false;

  public async generate(input: string, seeds: any[] = []): Promise<void> {
    if (!this.initialized) {
      await this.pipeline.initialize();
      this.initialized = true;
    }

    // Extract industry and tone from seeds (from UI)
    const industry = seeds.find(s => s.type === 'industry')?.value || 'tech';
    const tone = seeds.find(s => s.type === 'tone')?.value || 'modern';

    await this.pipeline.run(input, industry, tone);
  }
}

// Singleton export
export const GenerationService = new RealGenerationService();
