import { InteractionEventBus } from '../events/EventBus';

export interface IGenerationService {
  generate(input: string, seeds?: any[], strategy?: string): Promise<void>;
  sendFeedback?(selectedCandidate: string, input: string): Promise<void>;
}

export class RealGenerationService implements IGenerationService {
  public async generate(input: string, seeds: any[] = [], strategy: string = 'hybrid'): Promise<void> {
    const industry = seeds.find(s => s.type === 'industry')?.value || 'tech';
    const tone = seeds.find(s => s.type === 'tone')?.value || 'modern';
    const requestSeed = seeds.find(s => s.type === 'seed')?.value || Math.floor(Math.random() * 1000000);

    try {
      InteractionEventBus.emit('VALIDATION_STARTED', { timestamp: Date.now() });
      
      const response = await fetch('http://localhost:4000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, industry, tone, requestSeed, strategy })
      });

      if (!response.ok) {
        InteractionEventBus.emit('VALIDATION_FAILED', { reason: 'Failed to start generation', timestamp: Date.now() });
        return;
      }

      InteractionEventBus.emit('GENERATION_STARTED', { timestamp: Date.now() });
      InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'GENERATING' });
      InteractionEventBus.emit('STREAM_STARTED', { timestamp: Date.now() });

      const data = await response.json();
      const candidates = data.candidates || [];

      // Artificially stream chunks to UI to maintain the visual effect
      for (const candidate of candidates) {
        InteractionEventBus.emit('STREAM_CHUNK', { chunk: JSON.stringify(candidate), timestamp: Date.now() });
        // small delay to make it look like it's streaming
        await new Promise(r => setTimeout(r, 50));
      }

      InteractionEventBus.emit('STREAM_FINISHED', { resultId: 'batch-complete', timestamp: Date.now() });

    } catch (e) {
      console.error(e);
      InteractionEventBus.emit('VALIDATION_FAILED', { reason: 'Network error', timestamp: Date.now() });
    }
  }

  public async sendFeedback(selectedCandidate: string, input: string): Promise<void> {
    try {
      const intent = input.split(' ');
      await fetch('http://localhost:4000/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedCandidate, intent })
      });
    } catch (e) {
      console.error('Feedback error:', e);
    }
  }
}

export const GenerationService = new RealGenerationService();
