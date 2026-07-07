<template>
  <header class="page-header">
    <div class="header-deco deco-left">
      <span class="deco-line l1" /><span class="deco-diamond" /><span class="deco-line l2" />
    </div>

    <div class="header-left">
      <h1 class="header-title">
        <span class="title-cn">数据视界</span>
        <span class="title-divider">·</span>
        <span class="title-en">DataVista</span>
      </h1>
    </div>

    <div class="header-center">
      <!-- System status panel -->
      <div class="status-panel">
        <span class="status-dot ok" />
        <span class="status-text">系统正常</span>
        <span class="status-uptime">{{ uptimeDisplay }}</span>
      </div>

      <!-- Speed indicator badge -->
      <span class="speed-badge">{{ speedLabel }}</span>

      <!-- Last refresh time -->
      <span v-if="lastRefresh" class="last-refresh">更新于 {{ formatLastRefresh }}</span>

      <!-- Countdown timer -->
      <span v-if="!paused && countdown > 0" class="countdown-timer">下次刷新: {{ countdown }}s</span>

      <span class="header-time">{{ currentTime }}</span>
    </div>

    <div class="header-right">
      <!-- Refresh button -->
      <button
        class="header-btn"
        :class="{ 'btn-refreshing': refreshing }"
        :disabled="refreshing"
        title="刷新数据"
        @click="emit('refresh')"
      >
        <span class="btn-icon" :class="{ 'icon-spin': refreshing }">🔄</span>
        <span class="btn-label">刷新</span>
      </button>

      <!-- Play / Pause button -->
      <button
        class="header-btn"
        :title="paused ? '恢复自动刷新' : '暂停自动刷新'"
        @click="emit('toggle-pause')"
      >
        <span class="btn-icon">{{ paused ? '▶' : '⏸' }}</span>
      </button>

      <!-- Fullscreen button -->
      <button class="header-btn" title="全屏" @click="toggleFullscreen">
        <span class="btn-icon">⛶</span>
      </button>

      <!-- Theme switcher -->
      <div class="theme-dropdown">
        <button ref="themeBtnRef" class="header-btn theme-btn" title="切换主题" @click="toggleThemes">
          <span class="theme-icon">{{ currentTheme.icon }}</span>
          <span class="theme-label">{{ currentTheme.label }}</span>
        </button>
        <Teleport to="body">
          <div v-if="showThemes" class="theme-menu" :style="menuStyle" @mouseleave="showThemes = false">
            <button
              v-for="t in themeList" :key="t.name"
              class="theme-option" :class="{ active: t.name === activeTheme }"
              @click="selectTheme(t.name)"
            >
              <span class="tm-icon">{{ t.icon }}</span>
              <span class="tm-label">{{ t.label }}</span>
              <span v-if="t.name === activeTheme" class="tm-check">✓</span>
            </button>
          </div>
        </Teleport>
      </div>

      <!-- Settings button -->
      <button class="header-btn btn-settings" title="设置" @click="emit('open-settings')">
        <span class="btn-icon">⚙</span>
      </button>
    </div>

    <div class="header-deco deco-right">
      <span class="deco-line l1" /><span class="deco-diamond" /><span class="deco-line l2" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useThemeSwitch } from '@/composables/useTheme';
import { themeList, type ThemeId } from '@/themes';

// ── Props ────────────────────────────────────────────
const props = withDefaults(defineProps<{
  refreshing?: boolean;
  lastRefresh?: Date | null;
  countdown?: number;
  paused?: boolean;
  speed?: number;
}>(), {
  refreshing: false,
  lastRefresh: null,
  countdown: 0,
  paused: false,
  speed: 1,
});

// ── Emits ────────────────────────────────────────────
const emit = defineEmits<{
  refresh: [];
  'toggle-pause': [];
  'open-settings': [];
}>();

// ── Theme ─────────────────────────────────────────────
const { switchTo, getCurrent, getCurrentTheme } = useThemeSwitch();
const activeTheme = ref<ThemeId>(getCurrent());
const currentTheme = ref(getCurrentTheme());
const showThemes = ref(false);
const themeBtnRef = ref<HTMLElement>();
const menuStyle = ref<Record<string, string>>({});

function toggleThemes() {
  if (!showThemes.value && themeBtnRef.value) {
    const rect = themeBtnRef.value.getBoundingClientRect();
    menuStyle.value = {
      position: 'fixed',
      top: (rect.bottom + 4) + 'px',
      right: (window.innerWidth - rect.right) + 'px',
    };
  }
  showThemes.value = !showThemes.value;
}

function selectTheme(id: ThemeId) {
  switchTo(id);
  activeTheme.value = id;
  currentTheme.value = getCurrentTheme();
  showThemes.value = false;
}

// ── Clock ─────────────────────────────────────────────
const currentTime = ref('');
let clockTimer: ReturnType<typeof setInterval>;

function updateTime() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const week = ['日','一','二','三','四','五','六'][now.getDay()];
  currentTime.value = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} 周${week} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// ── Uptime ────────────────────────────────────────────
const uptimeSeconds = ref(0);
let uptimeTimer: ReturnType<typeof setInterval>;

const uptimeDisplay = computed(() => {
  const s = uptimeSeconds.value;
  if (s < 60) return `运行 ${s}s`;
  if (s < 3600) return `运行 ${Math.floor(s / 60)}m`;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `运行 ${h}h${m > 0 ? m + 'm' : ''}`;
});

// ── Last refresh ──────────────────────────────────────
const formatLastRefresh = computed(() => {
  if (!props.lastRefresh) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  const d = props.lastRefresh;
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
});

// ── Speed label ───────────────────────────────────────
const speedLabel = computed(() => {
  const s = props.speed;
  if (s >= 1) return `${s}x`;
  return `${s}x`;
});

// ── Fullscreen ────────────────────────────────────────
const isFullscreen = ref(false);
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
}

// ── Lifecycle ─────────────────────────────────────────
onMounted(() => {
  updateTime();
  clockTimer = setInterval(updateTime, 1000);

  uptimeTimer = setInterval(() => {
    uptimeSeconds.value++;
  }, 1000);

  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
});

onUnmounted(() => {
  clearInterval(clockTimer);
  clearInterval(uptimeTimer);
});
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

// ── Header deco ──────────────────────────────────────
.header-deco { display: flex; align-items: center; gap: 10px; opacity: 0.4; flex-shrink: 0;
  .deco-line { height: 1px;
    &.l1 { width: 32px; background: linear-gradient(90deg, transparent, $color-accent); }
    &.l2 { width: 32px; background: linear-gradient(90deg, $color-accent, transparent); }
  }
  .deco-diamond { width: 5px; height: 5px; background: $color-accent; transform: rotate(45deg); }
}

// ── Left: title ──────────────────────────────────────
.header-left { display: flex; align-items: center; }
.header-title { display: flex; align-items: baseline; gap: 8px;
  .title-cn { font-size: 24px; font-weight: 700; color: $text-primary; letter-spacing: 6px; @include text-glow; animation: title-breath 4s ease-in-out infinite; }
  @keyframes title-breath { 0%, 100% { text-shadow: 0 0 16px rgba(var(--color-primary-rgb, 0,180,216), 0.4); } 50% { text-shadow: 0 0 28px rgba(var(--color-primary-rgb, 0,180,216), 0.7), 0 0 40px rgba(var(--color-accent-rgb, 201,169,110), 0.3); } }
  .title-divider { font-size: 16px; color: $color-accent; margin: 0 4px; }
  .title-en { font-size: 12px; font-weight: 400; color: rgba(var(--color-primary-rgb, 0,180,216), 0.45); letter-spacing: 2px; }
}

// ── Center: status, time, indicators ─────────────────
.header-center { display: flex; align-items: center; gap: 14px; }

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

// Speed badge
.speed-badge {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 28px; height: 20px; padding: 0 6px;
  font-family: $font-mono; font-size: 10px; font-weight: 600;
  color: $color-accent; background: rgba(var(--color-accent-rgb, 201,169,110), 0.1);
  border: 1px solid rgba(var(--color-accent-rgb, 201,169,110), 0.25);
  border-radius: $radius-sm; letter-spacing: 0.5px;
}
// Last refresh time
.last-refresh {
  font-family: $font-mono; font-size: $font-size-xs; color: $text-muted;
  white-space: nowrap;
}

// Countdown
.countdown-timer {
  font-family: $font-mono; font-size: $font-size-xs; color: $color-primary;
  white-space: nowrap;
  background: rgba(var(--color-primary-rgb, 0,180,216), 0.06);
  border: 1px solid rgba(var(--color-primary-rgb, 0,180,216), 0.12);
  border-radius: $radius-sm; padding: 2px 8px;
}

.header-time { font-family: $font-mono; font-size: $font-size-lg; color: $color-primary; letter-spacing: 1px; }

// ── Right: buttons ───────────────────────────────────
.header-right { display: flex; gap: 8px; align-items: center; }

.header-btn {
  height: 30px; display: flex; align-items: center; justify-content: center; gap: 5px;
  background: rgba(var(--color-primary-rgb, 0,180,216), 0.06);
  border: 1px solid rgba(var(--color-primary-rgb, 0,180,216), 0.15);
  color: $color-primary; font-size: 13px; border-radius: $radius-sm;
  cursor: pointer; transition: all $transition-normal; padding: 0 10px;
  white-space: nowrap;

  &:hover {
    border-color: $color-primary;
    background: rgba(var(--color-primary-rgb, 0,180,216), 0.12);
    box-shadow: var(--glow-sm, $glow-sm);
  }

  &:disabled {
    opacity: 0.6; cursor: not-allowed;
  }

  .btn-icon { font-size: 14px; line-height: 1; }
  .btn-label { font-size: 12px; }
}

// Refreshing animation
.btn-refreshing {
  border-color: $color-accent;
  box-shadow: 0 0 10px rgba(var(--color-accent-rgb, 201,169,110), 0.3);
}
.icon-spin { display: inline-block; animation: spin-icon 0.8s linear infinite; }

// Separated settings button
.btn-settings {
  margin-left: 6px;
  border-color: rgba(var(--color-primary-rgb, 0,180,216), 0.1);
  padding: 0 8px;
}

// Theme dropdown
.theme-dropdown { position: relative; }
.theme-btn { gap: 6px; .theme-icon { font-size: 13px; } .theme-label { font-size: 11px; } }

// ── Keyframes ────────────────────────────────────────
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes spin-icon {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

<!-- Non-scoped styles for teleported menu -->
<style lang="scss">
.theme-menu {
  background: var(--bg-mid, #0d1f3c);
  border: 1px solid var(--glass-border, rgba(0,180,216,0.2));
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  overflow: hidden;
  min-width: 170px;
  z-index: 9999;
}
.theme-option {
  display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px 14px;
  border: none; background: transparent; color: var(--text-secondary, rgba(208,216,232,0.7));
  cursor: pointer; font-size: 13px; transition: all 0.15s ease;
  &:hover { background: var(--glass-bg-light, rgba(17,34,64,0.4)); color: var(--text-primary, #d0d8e8); }
  &.active { color: var(--color-primary, #00b4d8); background: rgba(var(--color-primary-rgb, 0,180,216), 0.08); }
  .tm-icon { font-size: 14px; }
  .tm-label { flex: 1; text-align: left; }
  .tm-check { font-size: 12px; }
}
</style>
