export type HistoryState = 
  | 'CLOSED'
  | 'OPEN_IDLE'
  | 'OPEN_SCROLLING'
  | 'ITEM_SELECTED';

export type HistoryEvent =
  | 'TOGGLE_OPEN'
  | 'TOGGLE_CLOSE'
  | 'SCROLL_START'
  | 'SCROLL_END'
  | 'SELECT_ITEM'
  | 'DESELECT_ITEM';

export const historyTransitions: Record<HistoryState, Partial<Record<HistoryEvent, HistoryState>>> = {
  CLOSED: {
    TOGGLE_OPEN: 'OPEN_IDLE'
  },
  OPEN_IDLE: {
    TOGGLE_CLOSE: 'CLOSED',
    SCROLL_START: 'OPEN_SCROLLING',
    SELECT_ITEM: 'ITEM_SELECTED'
  },
  OPEN_SCROLLING: {
    SCROLL_END: 'OPEN_IDLE',
    TOGGLE_CLOSE: 'CLOSED'
  },
  ITEM_SELECTED: {
    DESELECT_ITEM: 'OPEN_IDLE',
    TOGGLE_CLOSE: 'CLOSED'
  }
};

export class HistoryFSM {
  private currentState: HistoryState = 'CLOSED';

  public transition(event: HistoryEvent): HistoryState {
    const nextState = historyTransitions[this.currentState][event];
    if (nextState) {
      this.currentState = nextState;
    }
    return this.currentState;
  }

  public getState(): HistoryState {
    return this.currentState;
  }
}
