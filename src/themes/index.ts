export interface ThemeColors {
  name: string; label: string; icon: string;
  bgDeep: string; bgDark: string; bgMid: string; bgLight: string;
  colorPrimary: string; colorSecondary: string; colorTertiary: string;
  colorAccent: string; colorAccent2: string;
  glassBg: string; glassBgHover: string; glassBgLight: string;
  glassBorder: string; glassBorderHover: string;
  glowSm: string; glowMd: string;
  textPrimary: string; textSecondary: string; textMuted: string;
  /** 主题特色描述 */
  description?: string;
  /** 背景装饰类型 */
  bgDecoration?: 'cloud' | 'aurora' | 'star' | 'ink' | 'warm' | 'celadon';
}

export type ThemeId = 'chinese-blue' | 'aurora-green' | 'purple-star' | 'ink-gold' | 'sunrise-warm' | 'celadon-light';

export const themes: Record<ThemeId, ThemeColors> = {

  // ========================================
  // 国风科技蓝 — 深蓝 + 青蓝高亮 + 鎏金 + 云纹
  // ========================================
  'chinese-blue': {
    name: 'chinese-blue', label: '国风科技蓝', icon: '🌊',
    description: '云纹水墨 · 科技青蓝 · 鎏金点缀',
    bgDecoration: 'cloud',
    bgDeep: '#070e1a', bgDark: '#0a1628', bgMid: '#0d1f3c', bgLight: '#112240',
    colorPrimary: '#00b4d8', colorSecondary: '#48cae4', colorTertiary: '#90e0ef',
    colorAccent: '#c9a96e', colorAccent2: '#7ec8a0',
    glassBg: 'rgba(13,31,60,0.55)', glassBgHover: 'rgba(13,31,60,0.75)', glassBgLight: 'rgba(17,34,64,0.4)',
    glassBorder: 'rgba(0,180,216,0.2)', glassBorderHover: 'rgba(0,180,216,0.45)',
    glowSm: '0 0 8px rgba(0,180,216,0.2)', glowMd: '0 0 16px rgba(0,180,216,0.3)',
    textPrimary: '#d0d8e8', textSecondary: 'rgba(208,216,232,0.7)', textMuted: 'rgba(208,216,232,0.4)',
  },

  // ========================================
  // 极光翠 — 墨绿深海 + 翡翠高亮 + 暖金
  // ========================================
  'aurora-green': {
    name: 'aurora-green', label: '极光翠', icon: '🌿',
    description: '深海墨绿 · 翡翠极光 · 自然呼吸',
    bgDecoration: 'aurora',
    bgDeep: '#061210', bgDark: '#091c18', bgMid: '#0c2822', bgLight: '#10332c',
    colorPrimary: '#00d68f', colorSecondary: '#3de8a8', colorTertiary: '#7cf0c8',
    colorAccent: '#d4a850', colorAccent2: '#50d4b8',
    glassBg: 'rgba(12,40,34,0.55)', glassBgHover: 'rgba(12,40,34,0.75)', glassBgLight: 'rgba(16,51,44,0.4)',
    glassBorder: 'rgba(0,214,143,0.2)', glassBorderHover: 'rgba(0,214,143,0.45)',
    glowSm: '0 0 8px rgba(0,214,143,0.2)', glowMd: '0 0 16px rgba(0,214,143,0.3)',
    textPrimary: '#d8ece0', textSecondary: 'rgba(216,236,224,0.7)', textMuted: 'rgba(216,236,224,0.4)',
  },

  // ========================================
  // 紫韵星辰 — 深空紫蓝 + 紫罗兰高亮 + 星光
  // ========================================
  'purple-star': {
    name: 'purple-star', label: '紫韵星辰', icon: '✨',
    description: '深空紫蓝 · 星光璀璨 · 银白描边',
    bgDecoration: 'star',
    bgDeep: '#0d0818', bgDark: '#120e24', bgMid: '#181430', bgLight: '#1e1a3c',
    colorPrimary: '#a78bfa', colorSecondary: '#c4b5fd', colorTertiary: '#ddd6fe',
    colorAccent: '#e2e8f0', colorAccent2: '#f472b6',
    glassBg: 'rgba(24,20,48,0.55)', glassBgHover: 'rgba(24,20,48,0.75)', glassBgLight: 'rgba(30,26,60,0.4)',
    glassBorder: 'rgba(167,139,250,0.2)', glassBorderHover: 'rgba(167,139,250,0.45)',
    glowSm: '0 0 8px rgba(167,139,250,0.2)', glowMd: '0 0 16px rgba(167,139,250,0.3)',
    textPrimary: '#e8e4f0', textSecondary: 'rgba(232,228,240,0.7)', textMuted: 'rgba(232,228,240,0.4)',
  },

  // ========================================
  // 墨金雅韵 — 墨黑底色 + 暖金高亮 + 水墨
  // ========================================
  'ink-gold': {
    name: 'ink-gold', label: '墨金雅韵', icon: '🖋️',
    description: '水墨晕染 · 暖金流光 · 文人雅韵',
    bgDecoration: 'ink',
    bgDeep: '#0a0a0a', bgDark: '#111111', bgMid: '#1a1a1a', bgLight: '#242424',
    colorPrimary: '#d4a850', colorSecondary: '#e0c878', colorTertiary: '#ecd898',
    colorAccent: '#c0c0c0', colorAccent2: '#d47850',
    glassBg: 'rgba(26,26,26,0.55)', glassBgHover: 'rgba(26,26,26,0.75)', glassBgLight: 'rgba(36,36,36,0.4)',
    glassBorder: 'rgba(212,168,80,0.2)', glassBorderHover: 'rgba(212,168,80,0.45)',
    glowSm: '0 0 8px rgba(212,168,80,0.2)', glowMd: '0 0 16px rgba(212,168,80,0.3)',
    textPrimary: '#e8e0d0', textSecondary: 'rgba(232,224,208,0.7)', textMuted: 'rgba(232,224,208,0.4)',
  },

  // ========================================
  // 晨曦暖阳 ☀️ — 奶油米白底 + 琥珀暖橙 + 咖啡棕
  // ========================================
  'sunrise-warm': {
    name: 'sunrise-warm', label: '晨曦暖阳', icon: '☀️',
    description: '奶油暖白 · 琥珀晨光 · 柔和温暖',
    bgDecoration: 'warm',
    bgDeep: '#f5f0e8', bgDark: '#faf7f0', bgMid: '#fffcf7', bgLight: '#ffffff',
    colorPrimary: '#d45a1a', colorSecondary: '#e87830', colorTertiary: '#f09850',
    colorAccent: '#8a5030', colorAccent2: '#3a8858',
    glassBg: 'rgba(255,252,247,0.8)', glassBgHover: 'rgba(255,255,255,0.92)', glassBgLight: 'rgba(250,247,240,0.65)',
    glassBorder: 'rgba(180,100,50,0.3)', glassBorderHover: 'rgba(210,90,26,0.5)',
    glowSm: '0 0 8px rgba(232,120,48,0.2)', glowMd: '0 0 16px rgba(232,120,48,0.3)',
    textPrimary: '#2a1810', textSecondary: 'rgba(42,24,16,0.78)', textMuted: 'rgba(42,24,16,0.52)',
  },

  // ========================================
  // 云白天青 🍃 — 象牙白底 + 天青绿 + 浅灰蓝
  // ========================================
  'celadon-light': {
    name: 'celadon-light', label: '云白天青', icon: '🍃',
    description: '天青云白 · 淡雅青绿 · 清透如瓷',
    bgDecoration: 'celadon',
    bgDeep: '#e8f0ea', bgDark: '#f0f6f2', bgMid: '#f8fcf9', bgLight: '#ffffff',
    colorPrimary: '#2a7a5a', colorSecondary: '#4a9e7e', colorTertiary: '#6cb898',
    colorAccent: '#4a6a82', colorAccent2: '#b87850',
    glassBg: 'rgba(248,252,249,0.82)', glassBgHover: 'rgba(255,255,255,0.93)', glassBgLight: 'rgba(240,246,242,0.68)',
    glassBorder: 'rgba(42,122,90,0.25)', glassBorderHover: 'rgba(42,122,90,0.45)',
    glowSm: '0 0 8px rgba(42,122,90,0.18)', glowMd: '0 0 16px rgba(42,122,90,0.25)',
    textPrimary: '#12281e', textSecondary: 'rgba(18,40,30,0.78)', textMuted: 'rgba(18,40,30,0.5)',
  },
};

export const defaultTheme: ThemeId = 'chinese-blue';
export const themeList = Object.values(themes);
