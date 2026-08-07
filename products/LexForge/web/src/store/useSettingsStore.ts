import { create } from 'zustand';

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'system',
  reducedMotion: false,

  setTheme: (theme) => set({ theme }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced })
}));
