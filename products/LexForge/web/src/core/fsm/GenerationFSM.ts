export type GenerationState = 
  | 'IDLE'
  | 'TYPING'
  | 'VALIDATING'
  | 'GENERATING'
  | 'STREAMING'
  | 'COMPLETED'
  | 'RECOVERABLE_ERROR'
  | 'FATAL_ERROR';

export type GenerationEvent =
  | 'INPUT_CHANGE'
  | 'SUBMIT'
  | 'VALIDATION_SUCCESS'
  | 'VALIDATION_FAIL'
  | 'STREAM_START'
  | 'STREAM_END'
  | 'RETRY'
  | 'RESET';

export const generationTransitions: Record<GenerationState, Partial<Record<GenerationEvent, GenerationState>>> = {
  IDLE: {
    INPUT_CHANGE: 'TYPING',
    SUBMIT: 'VALIDATING'
  },
  TYPING: {
    INPUT_CHANGE: 'TYPING',
    SUBMIT: 'VALIDATING',
    RESET: 'IDLE'
  },
  VALIDATING: {
    VALIDATION_SUCCESS: 'GENERATING',
    VALIDATION_FAIL: 'RECOVERABLE_ERROR'
  },
  GENERATING: {
    STREAM_START: 'STREAMING',
    VALIDATION_FAIL: 'FATAL_ERROR'
  },
  STREAMING: {
    STREAM_END: 'COMPLETED'
  },
  COMPLETED: {
    RESET: 'IDLE',
    INPUT_CHANGE: 'TYPING'
  },
  RECOVERABLE_ERROR: {
    RETRY: 'VALIDATING',
    RESET: 'IDLE',
    INPUT_CHANGE: 'TYPING'
  },
  FATAL_ERROR: {
    RESET: 'IDLE'
  }
};

export class GenerationFSM {
  private currentState: GenerationState = 'IDLE';

  public transition(event: GenerationEvent): GenerationState {
    const nextState = generationTransitions[this.currentState][event];
    if (nextState) {
      this.currentState = nextState;
    }
    return this.currentState;
  }

  public getState(): GenerationState {
    return this.currentState;
  }
}
