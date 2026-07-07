export interface ThemeColors {
  name: string; label: string; icon: string;
  bgDeep: string; bgDark: string; bgMid: string; bgLight: string;
  colorPrimary: string; colorSecondary: string; colorTertiary: string;
  colorAccent: string; colorAccent2: string;
  glassBg: string; glassBgHover: string; glassBgLight: string;
  glassBorder: string; glassBorderHover: string;
  glowSm: string; glowMd: string;
  textPrimary: string; textSecondary: string; textMuted: string;
}

export type ThemeId = 'chinese-blue' | 'aurora-green' | 'purple-star' | 'ink-gold';

export const themes: Record<ThemeId, ThemeColors> = {
  'chinese-blue': {
    name: 'chinese-blue', label: '国风科技蓝', icon: '🌊',
    bgDeep: '#070e1a', bgDark: '#0a1628', bgMid: '#0d1f3c', bgLight: '#112240',
    colorPrimary: '#00b4d8', colorSecondary: '#48cae4', colorTertiary: '#90e0ef',
    colorAccent: '#c9a96e', colorAccent2: '#7ec8a0',
    glassBg: 'rgba(13,31,60,0.55)', glassBgHover: 'rgba(13,31,60,0.75)', glassBgLight: 'rgba(17,34,64,0.4)',
    glassBorder: 'rgba(0,180,216,0.2)', glassBorderHover: 'rgba(0,180,216,0.45)',
    glowSm: '0 0 8px rgba(0,180,216,0.2)', glowMd: '0 0 16px rgba(0,180,216,0.3)',
    textPrimary: '#d0d8e8', textSecondary: 'rgba(208,216,232,0.7)', textMuted: 'rgba(208,216,232,0.4)',
  },
  'aurora-green': {
    name: 'aurora-green', label: '极光翠', icon: '🌿',
    bgDeep: '#061210', bgDark: '#091c18', bgMid: '#0c2822', bgLight: '#10332c',
    colorPrimary: '#00d68f', colorSecondary: '#3de8a8', colorTertiary: '#7cf0c8',
    colorAccent: '#d4a850', colorAccent2: '#50d4b8',
    glassBg: 'rgba(12,40,34,0.55)', glassBgHover: 'rgba(12,40,34,0.75)', glassBgLight: 'rgba(16,51,44,0.4)',
    glassBorder: 'rgba(0,214,143,0.2)', glassBorderHover: 'rgba(0,214,143,0.45)',
    glowSm: '0 0 8px rgba(0,214,143,0.2)', glowMd: '0 0 16px rgba(0,214,143,0.3)',
    textPrimary: '#d8ece0', textSecondary: 'rgba(216,236,224,0.7)', textMuted: 'rgba(216,236,224,0.4)',
  },
  'purple-star': {
    name: 'purple-star', label: '紫韵星辰', icon: '✨',
    bgDeep: '#0d0818', bgDark: '#120e24', bgMid: '#181430', bgLight: '#1e1a3c',
    colorPrimary: '#a78bfa', colorSecondary: '#c4b5fd', colorTertiary: '#ddd6fe',
    colorAccent: '#e2e8f0', colorAccent2: '#f472b6',
    glassBg: 'rgba(24,20,48,0.55)', glassBgHover: 'rgba(24,20,48,0.75)', glassBgLight: 'rgba(30,26,60,0.4)',
    glassBorder: 'rgba(167,139,250,0.2)', glassBorderHover: 'rgba(167,139,250,0.45)',
    glowSm: '0 0 8px rgba(167,139,250,0.2)', glowMd: '0 0 16px rgba(167,139,250,0.3)',
    textPrimary: '#e8e4f0', textSecondary: 'rgba(232,228,240,0.7)', textMuted: 'rgba(232,228,240,0.4)',
  },
  'ink-gold': {
    name: 'ink-gold', label: '墨金雅韵', icon: '🖋️',
    bgDeep: '#0a0a0a', bgDark: '#111111', bgMid: '#1a1a1a', bgLight: '#242424',
    colorPrimary: '#d4a850', colorSecondary: '#e0c878', colorTertiary: '#ecd898',
    colorAccent: '#c0c0c0', colorAccent2: '#d47850',
    glassBg: 'rgba(26,26,26,0.55)', glassBgHover: 'rgba(26,26,26,0.75)', glassBgLight: 'rgba(36,36,36,0.4)',
    glassBorder: 'rgba(212,168,80,0.2)', glassBorderHover: 'rgba(212,168,80,0.45)',
    glowSm: '0 0 8px rgba(212,168,80,0.2)', glowMd: '0 0 16px rgba(212,168,80,0.3)',
    textPrimary: '#e8e0d0', textSecondary: 'rgba(232,224,208,0.7)', textMuted: 'rgba(232,224,208,0.4)',
  },
};

export const defaultTheme: ThemeId = 'chinese-blue';
export const themeList = Object.values(themes);