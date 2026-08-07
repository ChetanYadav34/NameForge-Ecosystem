export type LoadingState = 
  | 'IDLE'
  | 'LOADING'
  | 'SUCCESS'
  | 'ERROR';

export type LoadingEvent =
  | 'START_LOAD'
  | 'LOAD_SUCCESS'
  | 'LOAD_FAIL'
  | 'RESET';

export const loadingTransitions: Record<LoadingState, Partial<Record<LoadingEvent, LoadingState>>> = {
  IDLE: {
    START_LOAD: 'LOADING'
  },
  LOADING: {
    LOAD_SUCCESS: 'SUCCESS',
    LOAD_FAIL: 'ERROR'
  },
  SUCCESS: {
    RESET: 'IDLE',
    START_LOAD: 'LOADING'
  },
  ERROR: {
    RESET: 'IDLE',
    START_LOAD: 'LOADING'
  }
};

export class LoadingFSM {
  private currentState: LoadingState = 'IDLE';

  public transition(event: LoadingEvent): LoadingState {
    const nextState = loadingTransitions[this.currentState][event];
    if (nextState) {
      this.currentState = nextState;
    }
    return this.currentState;
  }

  public getState(): LoadingState {
    return this.currentState;
  }
}
