import { themes, type ThemeId, defaultTheme } from '@/themes';

const STORAGE_KEY = 'datavista-theme';

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function loadTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in themes) return stored as ThemeId;
  } catch { /* noop */ }
  return defaultTheme;
}

let current: ThemeId = loadTheme();

export function useThemeSwitch() {
  function applyThemeVars(id: ThemeId, customPrimary?: string | null, customAccent?: string | null) {
    const t = themes[id];
    const root = document.documentElement;
    root.setAttribute('data-theme', id);

    const setVar = (k: string, v: string) => root.style.setProperty(k, v);

    setVar('--bg-deep', t.bgDeep);
    setVar('--bg-dark', t.bgDark);
    setVar('--bg-mid', t.bgMid);
    setVar('--bg-light', t.bgLight);

    const primary = customPrimary || t.colorPrimary;
    const accent = customAccent || t.colorAccent;

    setVar('--color-primary', primary);
    setVar('--color-primary-rgb', hexToRgb(primary));
    setVar('--color-secondary', t.colorSecondary);
    setVar('--color-tertiary', t.colorTertiary);
    setVar('--color-accent', accent);
    setVar('--color-accent-rgb', hexToRgb(accent));
    setVar('--color-accent2', t.colorAccent2);
    setVar('--color-accent2-rgb', hexToRgb(t.colorAccent2));
    setVar('--glass-bg', t.glassBg);
    setVar('--glass-bg-hover', t.glassBgHover);
    setVar('--glass-bg-light', t.glassBgLight);
    setVar('--glass-border', t.glassBorder);
    setVar('--glass-border-hover', t.glassBorderHover);
    setVar('--glow-sm', t.glowSm);
    setVar('--glow-md', t.glowMd);
    setVar('--text-primary', t.textPrimary);
    setVar('--text-secondary', t.textSecondary);
    setVar('--text-muted', t.textMuted);

    current = id;
    try { localStorage.setItem(STORAGE_KEY, id); } catch { /* noop */ }
  }

  function switchTo(id: ThemeId, customPrimary?: string | null, customAccent?: string | null) {
    applyThemeVars(id, customPrimary, customAccent);
  }

  function getCurrent() { return current; }
  function getCurrentTheme() { return themes[current]; }

  // 初始化
  applyThemeVars(current);

  return { switchTo, getCurrent, getCurrentTheme };
}
