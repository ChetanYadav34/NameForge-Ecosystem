export type CompareState = 
  | 'EMPTY'
  | 'SINGLE_ITEM'
  | 'COMPARING'
  | 'MAX_CAPACITY';

export type CompareEvent =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'CLEAR_ALL';

export const compareTransitions: Record<CompareState, Partial<Record<CompareEvent, CompareState>>> = {
  EMPTY: {
    ADD_ITEM: 'SINGLE_ITEM'
  },
  SINGLE_ITEM: {
    ADD_ITEM: 'COMPARING',
    REMOVE_ITEM: 'EMPTY',
    CLEAR_ALL: 'EMPTY'
  },
  COMPARING: {
    ADD_ITEM: 'MAX_CAPACITY',
    REMOVE_ITEM: 'SINGLE_ITEM',
    CLEAR_ALL: 'EMPTY'
  },
  MAX_CAPACITY: {
    REMOVE_ITEM: 'COMPARING',
    CLEAR_ALL: 'EMPTY'
  }
};

export class CompareFSM {
  private currentState: CompareState = 'EMPTY';

  public transition(event: CompareEvent): CompareState {
    const nextState = compareTransitions[this.currentState][event];
    if (nextState) {
      this.currentState = nextState;
    }
    return this.currentState;
  }

  public getState(): CompareState {
    return this.currentState;
  }
}
