<template>
  <header class="page-header">
    <div class="header-deco left-deco">
      <span class="deco-line"></span>
      <span class="deco-diamond"></span>
      <span class="deco-line"></span>
    </div>
    <div class="header-left">
      <h1 class="header-title">
        <span class="title-cn">数据视界</span>
        <span class="title-divider">|</span>
        <span class="title-en">DataVista</span>
      </h1>
    </div>
    <div class="header-center">
      <div class="status-dot" :class="statusClass"></div>
      <span class="header-time">{{ currentTime }}</span>
      <span class="header-status">系统运行正常</span>
    </div>
    <div class="header-right">
      <button class="header-btn" @click="toggleFullscreen" title="全屏">
        <span class="btn-icon">{{ isFullscreen ? '⛶' : '⛶' }}</span>
      </button>
      <button class="header-btn" @click="toggleTheme" title="主题切换">
        <span class="btn-icon">{{ isDark ? '🌙' : '☀️' }}</span>
      </button>
    </div>
    <div class="header-deco right-deco">
      <span class="deco-line"></span>
      <span class="deco-diamond"></span>
      <span class="deco-line"></span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { isDark, toggle: toggleTheme } = useTheme();
const isFullscreen = ref(false);

const currentTime = ref('');
let timer: ReturnType<typeof setInterval>;

function updateTime() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  currentTime.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
}

const statusClass = computed(() => 'status-ok');

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
});

onUnmounted(() => clearInterval(timer));
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  position: relative;
  background: linear-gradient(180deg, rgba(0,180,216,0.06) 0%, transparent 100%);
  border-bottom: 1px solid rgba(0,180,216,0.12);
}

.header-deco {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.5;
  .deco-line {
    width: 40px;
    height: 1px;
    background: linear-gradient(90deg, transparent, $color-gold, transparent);
  }
  .deco-diamond {
    width: 6px;
    height: 6px;
    background: $color-gold;
    transform: rotate(45deg);
  }
  &.right-deco .deco-line {
    background: linear-gradient(90deg, transparent, $color-gold, transparent);
  }
}

.header-left { display: flex; align-items: center; }

.header-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  .title-cn {
    font-size: 26px;
    font-weight: 700;
    color: #e0e8f8;
    letter-spacing: 6px;
    @include text-glow;
  }
  .title-divider {
    font-size: 20px;
    color: $color-gold;
    font-weight: 200;
  }
  .title-en {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0,180,216,0.5);
    letter-spacing: 2px;
  }
}

.header-center {
  display: flex;
  align-items: center;
  gap: 12px;
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    box-shadow: 0 0 8px;
    &.status-ok { background: $color-success; box-shadow: 0 0 8px $color-success; }
  }
  .header-time {
    font-family: $font-mono;
    font-size: $font-size-lg;
    color: rgba(0,180,216,0.85);
    letter-spacing: 1px;
  }
  .header-status {
    font-size: $font-size-sm;
    color: rgba(0,180,216,0.5);
  }
}

.header-right { display: flex; gap: 8px; }

.header-btn {
  background: $glass-bg-light;
  border: 1px solid rgba(0,180,216,0.2);
  color: $color-primary;
  padding: 6px 12px;
  border-radius: $radius-sm;
  cursor: pointer;
  font-size: 14px;
  transition: all $transition-normal;
  &:hover {
    border-color: $color-primary;
    box-shadow: $glow-sm;
    background: $glass-bg-hover;
  }
}
</style>
