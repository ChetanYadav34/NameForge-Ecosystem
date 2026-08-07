import { GenerationService } from '../src/core/services/GenerationService';
import { InteractionEventBus } from '../src/core/events/EventBus';

async function run() {
  console.log("=== STARTING TEST ===");
  
  InteractionEventBus.on('STREAM_CHUNK', ({ chunk }) => {
    const obj = JSON.parse(chunk);
    console.log(`[UI Received Chunk] ${obj.name} (Score: ${obj.confidence})`);
  });

  InteractionEventBus.on('STREAM_FINISHED', () => {
    console.log("=== STREAM FINISHED ===");
  });

  InteractionEventBus.on('FSM_STATE_CHANGE', ({ state }) => {
    console.log(`[FSM State] -> ${state}`);
  });

  await GenerationService.generate('A sleek cyberpunk bike', [
    { type: 'industry', value: 'tech' },
    { type: 'tone', value: 'aggressive' }
  ]);
}

run().catch(console.error);
