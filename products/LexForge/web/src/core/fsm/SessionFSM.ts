export type SessionState = 
  | 'UNINITIALIZED'
  | 'AUTHENTICATING'
  | 'ACTIVE'
  | 'IDLE'
  | 'EXPIRED';

export type SessionEvent =
  | 'START_AUTH'
  | 'AUTH_SUCCESS'
  | 'AUTH_FAIL'
  | 'ACTIVITY_DETECTED'
  | 'TIMEOUT'
  | 'LOGOUT';

export const sessionTransitions: Record<SessionState, Partial<Record<SessionEvent, SessionState>>> = {
  UNINITIALIZED: {
    START_AUTH: 'AUTHENTICATING'
  },
  AUTHENTICATING: {
    AUTH_SUCCESS: 'ACTIVE',
    AUTH_FAIL: 'UNINITIALIZED'
  },
  ACTIVE: {
    ACTIVITY_DETECTED: 'ACTIVE',
    TIMEOUT: 'IDLE',
    LOGOUT: 'UNINITIALIZED'
  },
  IDLE: {
    ACTIVITY_DETECTED: 'ACTIVE',
    TIMEOUT: 'EXPIRED',
    LOGOUT: 'UNINITIALIZED'
  },
  EXPIRED: {
    START_AUTH: 'AUTHENTICATING'
  }
};

export class SessionFSM {
  private currentState: SessionState = 'UNINITIALIZED';

  public transition(event: SessionEvent): SessionState {
    const nextState = sessionTransitions[this.currentState][event];
    if (nextState) {
      this.currentState = nextState;
    }
    return this.currentState;
  }

  public getState(): SessionState {
    return this.currentState;
  }
}
