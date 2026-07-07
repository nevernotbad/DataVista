<template>
  <header class="page-header">
    <!-- Left decoration -->
    <div class="header-deco deco-left">
      <span class="deco-line l1"></span>
      <span class="deco-diamond"></span>
      <span class="deco-line l2"></span>
    </div>

    <!-- Left: title -->
    <div class="header-left">
      <h1 class="header-title">
        <span class="title-cn">数据视界</span>
        <span class="title-divider">·</span>
        <span class="title-en">DataVista</span>
      </h1>
    </div>

    <!-- Center: time + status -->
    <div class="header-center">
      <div class="status-panel">
        <span class="status-dot ok"></span>
        <span class="status-text">系统正常</span>
        <span class="status-uptime">运行 128h</span>
      </div>
      <span class="header-time">{{ currentTime }}</span>
    </div>

    <!-- Right: actions -->
    <div class="header-right">
      <button class="header-btn" title="刷新数据">
        <span>⟳</span>
      </button>
      <button class="header-btn" @click="toggleFullscreen" title="全屏">
        <span>⛶</span>
      </button>
      <button class="header-btn" @click="toggleTheme" title="主题">
        <span>◐</span>
      </button>
    </div>

    <!-- Right decoration -->
    <div class="header-deco deco-right">
      <span class="deco-line l1"></span>
      <span class="deco-diamond"></span>
      <span class="deco-line l2"></span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { isDark, toggle: toggleTheme } = useTheme();
const isFullscreen = ref(false);

const currentTime = ref('');
let timer: ReturnType<typeof setInterval>;

function updateTime() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const week = ['日','一','二','三','四','五','六'][now.getDay()];
  currentTime.value = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} 周${week} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
  position: relative;
  background: linear-gradient(180deg, rgba(0,180,216,0.07) 0%, rgba(0,180,216,0.01) 80%, transparent 100%);
  border-bottom: 1px solid rgba(0,180,216,0.1);

  &::after {
    content: '';
    position: absolute; bottom: -1px; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent);
  }
}

.header-deco {
  display: flex; align-items: center; gap: 10px; opacity: 0.4;
  flex-shrink: 0;
  .deco-line { height: 1px;
    &.l1 { width: 32px; background: linear-gradient(90deg, transparent, $color-gold); }
    &.l2 { width: 32px; background: linear-gradient(90deg, $color-gold, transparent); }
  }
  .deco-diamond { width: 5px; height: 5px; background: $color-gold; transform: rotate(45deg); }
}

.header-left { display: flex; align-items: center; }
.header-title { display: flex; align-items: baseline; gap: 8px;
  .title-cn { font-size: 24px; font-weight: 700; color: #e0e8f8; letter-spacing: 6px; @include text-glow; }
  .title-divider { font-size: 16px; color: $color-gold; margin: 0 4px; }
  .title-en { font-size: 12px; font-weight: 400; color: rgba(0,180,216,0.45); letter-spacing: 2px; }
}

.header-center { display: flex; align-items: center; gap: 20px; }
.status-panel {
  display: flex; align-items: center; gap: 8px;
  background: rgba(0,180,216,0.05); border: 1px solid rgba(0,180,216,0.1);
  border-radius: $radius-sm; padding: 4px 10px;
}
.status-dot { width: 6px; height: 6px; border-radius: 50%;
  &.ok { background: $color-jade; box-shadow: 0 0 6px $color-jade; animation: pulse-dot 2s ease-in-out infinite; }
}
.status-text { font-size: $font-size-xs; color: $color-jade; }
.status-uptime { font-size: $font-size-xs; color: rgba(208,216,232,0.3); }
.header-time { font-family: $font-mono; font-size: $font-size-lg; color: rgba(0,180,216,0.8); letter-spacing: 1px; }

.header-right { display: flex; gap: 6px; }
.header-btn {
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
  background: rgba(0,180,216,0.06); border: 1px solid rgba(0,180,216,0.15);
  color: rgba(0,180,216,0.6); font-size: 14px; border-radius: $radius-sm;
  cursor: pointer; transition: all $transition-normal;
  &:hover { border-color: $color-primary; color: $color-primary; background: rgba(0,180,216,0.12); box-shadow: $glow-sm; }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
