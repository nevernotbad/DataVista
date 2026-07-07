<template>
  <header class="page-header">
    <div class="header-deco deco-left">
      <span class="deco-line l1"></span><span class="deco-diamond"></span><span class="deco-line l2"></span>
    </div>

    <div class="header-left">
      <h1 class="header-title">
        <span class="title-cn">数据视界</span>
        <span class="title-divider">·</span>
        <span class="title-en">DataVista</span>
      </h1>
    </div>

    <div class="header-center">
      <div class="status-panel">
        <span class="status-dot ok"></span>
        <span class="status-text">系统正常</span>
        <span class="status-uptime">运行 128h</span>
      </div>
      <span class="header-time">{{ currentTime }}</span>
    </div>

    <div class="header-right">
      <!-- Theme switcher -->
      <div class="theme-dropdown">
        <button class="header-btn theme-btn" @click="showThemes = !showThemes" title="切换主题">
          <span class="theme-icon">{{ currentTheme.icon }}</span>
          <span class="theme-label">{{ currentTheme.label }}</span>
        </button>
        <div class="theme-menu" v-if="showThemes" @mouseleave="showThemes = false">
          <button
            v-for="t in themeList"
            :key="t.name"
            class="theme-option"
            :class="{ active: t.name === activeTheme }"
            @click="selectTheme(t.name)"
          >
            <span class="tm-icon">{{ t.icon }}</span>
            <span class="tm-label">{{ t.label }}</span>
            <span class="tm-check" v-if="t.name === activeTheme">✓</span>
          </button>
        </div>
      </div>

      <button class="header-btn" @click="toggleFullscreen" title="全屏">
        <span>⛶</span>
      </button>
    </div>

    <div class="header-deco deco-right">
      <span class="deco-line l1"></span><span class="deco-diamond"></span><span class="deco-line l2"></span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useThemeSwitch } from '@/composables/useTheme';
import { themeList, type ThemeId } from '@/themes';

const { switchTo, getCurrent, getCurrentTheme } = useThemeSwitch();
const activeTheme = ref<ThemeId>(getCurrent());
const currentTheme = ref(getCurrentTheme());
const showThemes = ref(false);

function selectTheme(id: ThemeId) {
  switchTo(id);
  activeTheme.value = id;
  currentTheme.value = getCurrentTheme();
  showThemes.value = false;
}

const currentTime = ref('');
let timer: ReturnType<typeof setInterval>;

function updateTime() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const week = ['日','一','二','三','四','五','六'][now.getDay()];
  currentTime.value = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} 周${week} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

const isFullscreen = ref(false);
function toggleFullscreen() {
  if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(()=>{}); isFullscreen.value = true; }
  else { document.exitFullscreen(); isFullscreen.value = false; }
}

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
  document.addEventListener('fullscreenchange', () => { isFullscreen.value = !!document.fullscreenElement; });
});
onUnmounted(() => clearInterval(timer));
</script>

<style scoped lang="scss">
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  height: 100%; padding: 0 16px; position: relative;
  background: linear-gradient(180deg, rgba(var(--color-primary-rgb, 0,180,216), 0.07) 0%, transparent 100%);
  border-bottom: 1px solid rgba(var(--color-primary-rgb, 0,180,216), 0.1);
  &::after {
    content: ''; position: absolute; bottom: -1px; left: 10%; right: 10%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(var(--color-accent-rgb, 201,169,110), 0.3), transparent);
  }
}
.header-deco { display: flex; align-items: center; gap: 10px; opacity: 0.4; flex-shrink: 0;
  .deco-line { height: 1px;
    &.l1 { width: 32px; background: linear-gradient(90deg, transparent, $color-accent); }
    &.l2 { width: 32px; background: linear-gradient(90deg, $color-accent, transparent); }
  }
  .deco-diamond { width: 5px; height: 5px; background: $color-accent; transform: rotate(45deg); }
}
.header-left { display: flex; align-items: center; }
.header-title { display: flex; align-items: baseline; gap: 8px;
  .title-cn { font-size: 24px; font-weight: 700; color: $text-primary; letter-spacing: 6px; @include text-glow; }
  .title-divider { font-size: 16px; color: $color-accent; margin: 0 4px; }
  .title-en { font-size: 12px; font-weight: 400; color: rgba(var(--color-primary-rgb, 0,180,216), 0.45); letter-spacing: 2px; }
}
.header-center { display: flex; align-items: center; gap: 20px; }
.status-panel {
  display: flex; align-items: center; gap: 8px;
  background: rgba(var(--color-primary-rgb, 0,180,216), 0.05);
  border: 1px solid rgba(var(--color-primary-rgb, 0,180,216), 0.1);
  border-radius: $radius-sm; padding: 4px 10px;
}
.status-dot { width: 6px; height: 6px; border-radius: 50%;
  &.ok { background: $color-accent2; box-shadow: 0 0 6px $color-accent2; animation: pulse-dot 2s ease-in-out infinite; }
}
.status-text { font-size: $font-size-xs; color: $color-accent2; }
.status-uptime { font-size: $font-size-xs; color: $text-muted; }
.header-time { font-family: $font-mono; font-size: $font-size-lg; color: $color-primary; letter-spacing: 1px; }
.header-right { display: flex; gap: 8px; align-items: center; }
.header-btn {
  height: 30px; display: flex; align-items: center; justify-content: center;
  background: rgba(var(--color-primary-rgb, 0,180,216), 0.06);
  border: 1px solid rgba(var(--color-primary-rgb, 0,180,216), 0.15);
  color: $color-primary; font-size: 14px; border-radius: $radius-sm;
  cursor: pointer; transition: all $transition-normal; padding: 0 10px;
  &:hover { border-color: $color-primary; background: rgba(var(--color-primary-rgb, 0,180,216), 0.12); box-shadow: var(--glow-sm, $glow-sm); }
}
.theme-dropdown { position: relative; }
.theme-btn { gap: 6px; .theme-icon { font-size: 13px; } .theme-label { font-size: 11px; } }
.theme-menu {
  position: absolute; top: calc(100% + 4px); right: 0;
  background: $bg-mid; border: 1px solid $glass-border; border-radius: $radius-md;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5); z-index: 100; overflow: hidden; min-width: 160px;
}
.theme-option {
  display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px 14px;
  border: none; background: transparent; color: $text-secondary; cursor: pointer;
  font-size: 13px; transition: all $transition-fast;
  &:hover { background: $glass-bg-light; color: $text-primary; }
  &.active { color: $color-primary; background: rgba(var(--color-primary-rgb, 0,180,216), 0.08); }
  .tm-icon { font-size: 14px; }
  .tm-label { flex: 1; text-align: left; }
  .tm-check { font-size: 12px; }
}
@keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
</style>
