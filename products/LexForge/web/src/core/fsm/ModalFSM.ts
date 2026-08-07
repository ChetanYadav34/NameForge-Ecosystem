export type ModalState = 
  | 'CLOSED'
  | 'OPENING'
  | 'OPEN'
  | 'CLOSING';

export type ModalEvent =
  | 'OPEN'
  | 'ANIMATION_END'
  | 'CLOSE';

export const modalTransitions: Record<ModalState, Partial<Record<ModalEvent, ModalState>>> = {
  CLOSED: {
    OPEN: 'OPENING'
  },
  OPENING: {
    ANIMATION_END: 'OPEN',
    CLOSE: 'CLOSING'
  },
  OPEN: {
    CLOSE: 'CLOSING'
  },
  CLOSING: {
    ANIMATION_END: 'CLOSED',
    OPEN: 'OPENING'
  }
};

export class ModalFSM {
  private currentState: ModalState = 'CLOSED';

  public transition(event: ModalEvent): ModalState {
    const nextState = modalTransitions[this.currentState][event];
    if (nextState) {
      this.currentState = nextState;
    }
    return this.currentState;
  }

  public getState(): ModalState {
    return this.currentState;
  }
}
