import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSettingsStore } from '../settings';

describe('useSettingsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('初始化为默认值', () => {
    const store = useSettingsStore();
    expect(store.settings.fontSizeScale).toBe(1);
    expect(store.settings.refreshInterval).toBe(30);
    expect(store.settings.enableAnimations).toBe(true);
    expect(store.settings.showDataFlow).toBe(true);
    expect(store.settings.zoomLevel).toBe(1);
  });

  it('update 修改设置项', () => {
    const store = useSettingsStore();
    store.update('fontSizeScale', 1.2);
    expect(store.settings.fontSizeScale).toBe(1.2);
  });

  it('update 修改刷新间隔', () => {
    const store = useSettingsStore();
    store.update('refreshInterval', 5);
    expect(store.settings.refreshInterval).toBe(5);
  });

  it('toggle 开关项', () => {
    const store = useSettingsStore();
    store.update('showDataFlow', false);
    expect(store.settings.showDataFlow).toBe(false);
  });

  it('reset 恢复默认值', () => {
    const store = useSettingsStore();
    store.update('fontSizeScale', 1.5);
    store.update('refreshInterval', 60);
    store.reset();
    expect(store.settings.fontSizeScale).toBe(1);
    expect(store.settings.refreshInterval).toBe(30);
  });

  it('持久化到 localStorage', () => {
    const store = useSettingsStore();
    store.update('fontSizeScale', 1.3);
    const raw = localStorage.getItem('datavista-settings');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.fontSizeScale).toBe(1.3);
  });
});
