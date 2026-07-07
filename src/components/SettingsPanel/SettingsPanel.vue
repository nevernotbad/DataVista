<template>
  <Teleport to="body">
    <Transition name="panel-slide">
      <div v-if="visible" class="settings-overlay" @click.self="close">
        <div class="settings-panel">
          <div class="sp-header">
            <span class="sp-title">⚙ 设置</span>
            <button class="sp-close" @click="close">✕</button>
          </div>

          <div class="sp-body">
            <!-- 主题 -->
            <section class="sp-section">
              <h4 class="sp-section-title">主题</h4>
              <div class="sp-theme-grid">
                <button
                  v-for="t in themeList" :key="t.name"
                  class="sp-theme-btn" :class="{ active: t.name === activeTheme }"
                  :style="{ borderColor: t.name === activeTheme ? t.colorPrimary : 'transparent' }"
                  @click="selectTheme(t.name)"
                >
                  <span class="sp-theme-icon">{{ t.icon }}</span>
                  <span class="sp-theme-label">{{ t.label }}</span>
                </button>
              </div>
            </section>

            <!-- 自定义颜色 -->
            <section class="sp-section">
              <h4 class="sp-section-title">自定义颜色</h4>
              <div class="sp-color-row">
                <label class="sp-color-label">主色调</label>
                <input
                  type="color" class="sp-color-input"
                  :value="settings.customPrimary ?? currentTheme.colorPrimary"
                  @input="onPrimaryChange"
                >
                <button v-if="settings.customPrimary" class="sp-reset-btn" @click="store.update('customPrimary', null)">重置</button>
              </div>
              <div class="sp-color-row">
                <label class="sp-color-label">强调色</label>
                <input
                  type="color" class="sp-color-input"
                  :value="settings.customAccent ?? currentTheme.colorAccent"
                  @input="onAccentChange"
                >
                <button v-if="settings.customAccent" class="sp-reset-btn" @click="store.update('customAccent', null)">重置</button>
              </div>
            </section>

            <!-- 显示 -->
            <section class="sp-section">
              <h4 class="sp-section-title">显示</h4>
              <div class="sp-row">
                <span>字号缩放</span>
                <input
                  type="range" class="sp-slider" min="0.8" max="1.5" step="0.05"
                  :value="settings.fontSizeScale" @input="store.update('fontSizeScale', +($event.target as HTMLInputElement).value)"
                >
                <span class="sp-val">{{ (settings.fontSizeScale * 100).toFixed(0) }}%</span>
              </div>
              <div class="sp-row">
                <span>视图缩放</span>
                <input
                  type="range" class="sp-slider" min="0.5" max="2.0" step="0.05"
                  :value="settings.zoomLevel" @input="store.update('zoomLevel', +($event.target as HTMLInputElement).value)"
                >
                <span class="sp-val">{{ (settings.zoomLevel * 100).toFixed(0) }}%</span>
              </div>
              <div class="sp-toggle-row">
                <span>显示数据流</span>
                <button class="sp-toggle" :class="{ on: settings.showDataFlow }" @click="store.update('showDataFlow', !settings.showDataFlow)" />
              </div>
              <div class="sp-toggle-row">
                <span>显示装饰元素</span>
                <button class="sp-toggle" :class="{ on: settings.showDecorations }" @click="store.update('showDecorations', !settings.showDecorations)" />
              </div>
              <div class="sp-toggle-row">
                <span>显示背景效果</span>
                <button class="sp-toggle" :class="{ on: settings.showBgEffects }" @click="store.update('showBgEffects', !settings.showBgEffects)" />
              </div>
            </section>

            <!-- 数据刷新 -->
            <section class="sp-section">
              <h4 class="sp-section-title">数据刷新</h4>
              <div class="sp-btn-group">
                <button
                  v-for="opt in refreshOptions" :key="opt.value"
                  class="sp-opt-btn" :class="{ active: settings.refreshInterval === opt.value }"
                  @click="store.update('refreshInterval', opt.value)"
                >
                  {{ opt.label }}
                </button>
              </div>
            </section>

            <!-- 动画 -->
            <section class="sp-section">
              <h4 class="sp-section-title">动效</h4>
              <div class="sp-toggle-row">
                <span>启用动画</span>
                <button class="sp-toggle" :class="{ on: settings.enableAnimations }" @click="store.update('enableAnimations', !settings.enableAnimations)" />
              </div>
            </section>

            <!-- 重置 -->
            <div class="sp-footer">
              <button class="sp-reset-all" @click="store.reset()">恢复默认设置</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useThemeSwitch } from '@/composables/useTheme';
import { themeList, type ThemeId } from '@/themes';

defineProps<{ visible: boolean }>();
const emit = defineEmits<{ close: [] }>();

const store = useSettingsStore();
const { switchTo, getCurrent, getCurrentTheme } = useThemeSwitch();
const settings = computed(() => store.settings);
const activeTheme = computed(() => getCurrent());
const currentTheme = computed(() => getCurrentTheme());

const refreshOptions = [
  { label: '关闭', value: 0 },
  { label: '5秒', value: 5 },
  { label: '10秒', value: 10 },
  { label: '30秒', value: 30 },
  { label: '60秒', value: 60 },
];

function selectTheme(id: ThemeId) {
  switchTo(id);
}

function onPrimaryChange(e: Event) {
  store.update('customPrimary', (e.target as HTMLInputElement).value);
}
function onAccentChange(e: Event) {
  store.update('customAccent', (e.target as HTMLInputElement).value);
}

function close() {
  emit('close');
}
</script>

<style scoped lang="scss">
.settings-overlay {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: flex-end;
}
.settings-panel {
  width: 340px; height: 100%;
  background: var(--bg-dark, #0a1628);
  border-left: 1px solid var(--glass-border);
  display: flex; flex-direction: column;
  box-shadow: -4px 0 24px rgba(0,0,0,0.5);
  backdrop-filter: blur(16px);
}
.sp-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--glass-border);
}
.sp-title { font-size: 16px; font-weight: 600; color: var(--text-primary); letter-spacing: 2px; }
.sp-close {
  width: 28px; height: 28px; border: 1px solid var(--glass-border); border-radius: 4px;
  background: transparent; color: var(--text-secondary); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  &:hover { border-color: var(--color-primary); color: var(--color-primary); }
}
.sp-body { flex: 1; overflow-y: auto; padding: 16px 20px; @include scrollbar; }
.sp-section { margin-bottom: 20px; }
.sp-section-title {
  font-size: 12px; font-weight: 600; color: var(--color-primary);
  letter-spacing: 2px; margin-bottom: 10px;
  padding-bottom: 6px; border-bottom: 1px solid rgba(var(--color-primary-rgb, 0,180,216), 0.1);
}
.sp-theme-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.sp-theme-btn {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  border: 1px solid transparent; border-radius: 4px;
  background: var(--glass-bg-light); color: var(--text-secondary);
  cursor: pointer; font-size: 12px; transition: all 0.2s;
  &:hover { background: var(--glass-bg-hover); }
  &.active { background: rgba(var(--color-primary-rgb, 0,180,216), 0.1); }
}
.sp-theme-icon { font-size: 16px; }
.sp-theme-label { font-size: 11px; }

.sp-color-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.sp-color-label { font-size: 12px; color: var(--text-secondary); width: 50px; flex-shrink: 0; }
.sp-color-input { width: 36px; height: 28px; border: 1px solid var(--glass-border); border-radius: 4px; cursor: pointer; background: transparent; padding: 2px; }
.sp-reset-btn {
  font-size: 11px; color: var(--text-muted); background: transparent; border: 1px solid var(--glass-border);
  border-radius: 3px; padding: 2px 8px; cursor: pointer;
  &:hover { color: var(--color-danger); border-color: var(--color-danger); }
}

.sp-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 12px; color: var(--text-secondary); }
.sp-slider { flex: 1; accent-color: var(--color-primary); }
.sp-val { width: 36px; text-align: right; font-family: var(--font-mono); font-size: 11px; color: var(--color-primary); }

.sp-toggle-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: var(--text-secondary); }
.sp-toggle {
  width: 40px; height: 22px; border-radius: 11px; border: 1px solid var(--glass-border);
  background: rgba(255,255,255,0.08); cursor: pointer; position: relative; transition: all 0.2s;
  &::after { content: ''; width: 16px; height: 16px; border-radius: 50%; background: var(--text-muted); position: absolute; top: 2px; left: 2px; transition: all 0.2s; }
  &.on { background: rgba(var(--color-primary-rgb, 0,180,216), 0.3); border-color: var(--color-primary); }
  &.on::after { left: 20px; background: var(--color-primary); }
}

.sp-btn-group { display: flex; gap: 4px; flex-wrap: wrap; }
.sp-opt-btn {
  padding: 5px 12px; border: 1px solid var(--glass-border); border-radius: 3px;
  background: transparent; color: var(--text-secondary); cursor: pointer; font-size: 11px; transition: all 0.2s;
  &:hover { border-color: var(--color-primary); }
  &.active { background: rgba(var(--color-primary-rgb, 0,180,216), 0.2); border-color: var(--color-primary); color: var(--color-primary); }
}

.sp-footer { padding: 16px 0; border-top: 1px solid var(--glass-border); }
.sp-reset-all {
  width: 100%; padding: 8px; border: 1px solid var(--color-danger); border-radius: 4px;
  background: transparent; color: var(--color-danger); cursor: pointer; font-size: 12px;
  &:hover { background: rgba(224,80,80,0.1); }
}

// Transition
.panel-slide-enter-active, .panel-slide-leave-active { transition: all 0.3s ease; }
.panel-slide-enter-from, .panel-slide-leave-to { opacity: 0;
  .settings-panel { transform: translateX(100%); }
}
.panel-slide-enter-active .settings-panel { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
.panel-slide-leave-active .settings-panel { transition: transform 0.25s ease-in; }
</style>
