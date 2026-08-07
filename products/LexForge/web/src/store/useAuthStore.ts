import { create } from 'zustand';

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  
  // Actions
  loginPlaceholder: () => void;
  logoutPlaceholder: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  loginPlaceholder: () => set({ 
    isAuthenticated: true, 
    user: { id: 'test-user-1', email: 'test@lexforge.com', name: 'Test User' } 
  }),
  logoutPlaceholder: () => set({ isAuthenticated: false, user: null })
}));
