export type ThemeName = 'lexforge-dark' | 'lexforge-midnight' | 'lexforge-ancient' | 'lexforge-crimson';

export interface ThemeDefinition {
  name: ThemeName;
  colors: Record<string, string>;
  radius: string;
}

export const themes: Record<ThemeName, ThemeDefinition> = {
  'lexforge-dark': {
    name: 'lexforge-dark',
    colors: {
      '--color-background': '#090909',
      '--color-surface': '#101010',
      '--color-surface-elevated': '#161616',
      '--color-surface-hover': '#1D1D1D',
      '--color-border': '#262626',
      '--color-border-hover': '#333333',
      '--color-accent': '#D4AF37',
      '--color-accent-hover': '#E8C45A',
      '--color-accent-muted': 'rgba(212, 175, 55, 0.2)',
      '--color-danger': '#8B1E2D',
      '--color-danger-hover': '#A82537',
      '--color-danger-muted': 'rgba(139, 30, 45, 0.2)',
      '--color-text-primary': '#F5F5F5',
      '--color-text-secondary': '#A0A0A0',
      '--color-text-muted': '#6B6B6B',
    },
    radius: '16px',
  },
  'lexforge-midnight': {
    name: 'lexforge-midnight',
    colors: {
      '--color-background': '#05050A',
      '--color-surface': '#0A0A12',
      '--color-surface-elevated': '#10101A',
      '--color-surface-hover': '#181824',
      '--color-border': '#1E1E2D',
      '--color-border-hover': '#2B2B3D',
      '--color-accent': '#5A8BE8',
      '--color-accent-hover': '#7FA9F2',
      '--color-accent-muted': 'rgba(90, 139, 232, 0.2)',
      '--color-danger': '#E85A71',
      '--color-danger-hover': '#F27F91',
      '--color-danger-muted': 'rgba(232, 90, 113, 0.2)',
      '--color-text-primary': '#F0F4FA',
      '--color-text-secondary': '#8A99B3',
      '--color-text-muted': '#5C6B8A',
    },
    radius: '14px',
  },
  'lexforge-ancient': {
    name: 'lexforge-ancient',
    colors: {
      '--color-background': '#121110',
      '--color-surface': '#1A1817',
      '--color-surface-elevated': '#24211F',
      '--color-surface-hover': '#2E2B29',
      '--color-border': '#3D3835',
      '--color-border-hover': '#4D4743',
      '--color-accent': '#C2A370',
      '--color-accent-hover': '#D6B985',
      '--color-accent-muted': 'rgba(194, 163, 112, 0.2)',
      '--color-danger': '#9C3D35',
      '--color-danger-hover': '#B54F45',
      '--color-danger-muted': 'rgba(156, 61, 53, 0.2)',
      '--color-text-primary': '#EBE6E0',
      '--color-text-secondary': '#B3ABA3',
      '--color-text-muted': '#7A736E',
    },
    radius: '14px',
  },
  'lexforge-crimson': {
    name: 'lexforge-crimson',
    colors: {
      '--color-background': '#0A0505',
      '--color-surface': '#120A0A',
      '--color-surface-elevated': '#1C1010',
      '--color-surface-hover': '#291818',
      '--color-border': '#3D2424',
      '--color-border-hover': '#523030',
      '--color-accent': '#D4AF37', // Gold remains the accent
      '--color-accent-hover': '#E8C45A',
      '--color-accent-muted': 'rgba(212, 175, 55, 0.2)',
      '--color-danger': '#D4374A',
      '--color-danger-hover': '#E85A6A',
      '--color-danger-muted': 'rgba(212, 55, 74, 0.2)',
      '--color-text-primary': '#FAEEEE',
      '--color-text-secondary': '#B39191',
      '--color-text-muted': '#7A5C5C',
    },
    radius: '18px',
  }
};
