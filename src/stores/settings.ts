import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export interface UserSettings {
  /** 全局字号缩放 0.8 ~ 1.5 */
  fontSizeScale: number;
  /** 数据刷新间隔(秒)，0 表示停止自动刷新 */
  refreshInterval: number;
  /** 是否启用动画 */
  enableAnimations: boolean;
  /** 是否显示底部数据流 */
  showDataFlow: boolean;
  /** 是否显示装饰边框 */
  showDecorations: boolean;
  /** 是否显示背景效果（网格、光晕） */
  showBgEffects: boolean;
  /** 缩放比例 0.5 ~ 2.0 */
  zoomLevel: number;
  /** 是否自动全屏 */
  autoFullscreen: boolean;
  /** 自定义主色调 (null = 使用主题默认) */
  customPrimary: string | null;
  /** 自定义强调色 */
  customAccent: string | null;
}

const DEFAULTS: UserSettings = {
  fontSizeScale: 1,
  refreshInterval: 30,
  enableAnimations: true,
  showDataFlow: true,
  showDecorations: true,
  showBgEffects: true,
  zoomLevel: 1,
  autoFullscreen: false,
  customPrimary: null,
  customAccent: null,
};

const STORAGE_KEY = 'datavista-settings';

function load(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

function save(settings: UserSettings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<UserSettings>(load());

  // 自动持久化（同步写入，确保测试可验证）
  watch(settings, (v) => save(v), { deep: true, flush: 'sync' });

  function update<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    settings.value[key] = value;
  }

  function reset() {
    settings.value = { ...DEFAULTS };
    save(settings.value);
  }

  function resetKey<K extends keyof UserSettings>(key: K) {
    settings.value[key] = DEFAULTS[key];
  }

  // 应用字号缩放到 DOM
  watch(() => settings.value.fontSizeScale, (scale) => {
    document.documentElement.style.setProperty('--font-scale', String(scale));
  }, { immediate: true });

  // 应用动画开关
  watch(() => settings.value.enableAnimations, (on) => {
    document.documentElement.style.setProperty('--anim-duration-global', on ? '1' : '0');
  }, { immediate: true });

  // 应用缩放
  watch(() => settings.value.zoomLevel, (z) => {
    document.documentElement.style.setProperty('--user-zoom', String(z));
  }, { immediate: true });

  return {
    settings,
    update,
    reset,
    resetKey,
    DEFAULTS,
  };
});
