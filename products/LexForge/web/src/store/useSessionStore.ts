import { create } from 'zustand';

export interface SessionState {
  sessionId: string | null;
  startTime: number;
  lastActive: number;
  
  // Actions
  initializeSession: () => void;
  pingActivity: () => void;
  endSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  startTime: 0,
  lastActive: 0,

  initializeSession: () => set({ 
    sessionId: crypto.randomUUID(),
    startTime: Date.now(),
    lastActive: Date.now()
  }),
  pingActivity: () => set({ lastActive: Date.now() }),
  endSession: () => set({ sessionId: null, startTime: 0, lastActive: 0 })
}));
