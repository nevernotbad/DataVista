import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';

export interface RefreshState {
  /** 是否正在刷新 */
  refreshing: boolean;
  /** 最后刷新时间 */
  lastRefresh: Date | null;
  /** 下次刷新倒计时(秒) */
  countdown: number;
  /** 是否暂停 */
  paused: boolean;
  /** 刷新倍速 */
  speed: number;
  /** 刷新计数 */
  refreshCount: number;
}

export function useDataRefresh() {
  const settingsStore = useSettingsStore();
  const state = ref<RefreshState>({
    refreshing: false,
    lastRefresh: null,
    countdown: 0,
    paused: false,
    speed: 1,
    refreshCount: 0,
  });

  let timer: ReturnType<typeof setInterval> | null = null;
  let countdownTimer: ReturnType<typeof setInterval> | null = null;
  const callbacks: Array<() => void | Promise<void>> = [];

  /** 注册刷新回调 */
  function onRefresh(cb: () => void | Promise<void>) {
    callbacks.push(cb);
    return () => {
      const idx = callbacks.indexOf(cb);
      if (idx >= 0) callbacks.splice(idx, 1);
    };
  }

  /** 执行刷新 */
  async function refresh() {
    if (state.value.refreshing) return;
    state.value.refreshing = true;
    try {
      await Promise.all(callbacks.map(cb => cb()));
      state.value.lastRefresh = new Date();
      state.value.refreshCount++;
    } finally {
      state.value.refreshing = false;
    }
  }

  /** 更新倒计时 */
  function updateCountdown() {
    const interval = settingsStore.settings.refreshInterval;
    if (interval <= 0 || state.value.paused) {
      state.value.countdown = 0;
      return;
    }
    if (!state.value.lastRefresh) {
      state.value.countdown = Math.ceil(interval / state.value.speed);
      return;
    }
    const elapsed = (Date.now() - state.value.lastRefresh.getTime()) / 1000;
    const remaining = Math.max(0, interval / state.value.speed - elapsed);
    state.value.countdown = Math.ceil(remaining);
  }

  function startAutoRefresh() {
    stopAutoRefresh();
    const interval = settingsStore.settings.refreshInterval;
    if (interval <= 0) return;

    const effectiveInterval = (interval * 1000) / state.value.speed;

    // 倒计时每秒更新
    countdownTimer = setInterval(updateCountdown, 200);

    // 刷新定时器
    timer = setInterval(() => {
      if (!state.value.paused && !state.value.refreshing) {
        refresh();
      }
      updateCountdown();
    }, effectiveInterval);

    updateCountdown();
  }

  function stopAutoRefresh() {
    if (timer) { clearInterval(timer); timer = null; }
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
    state.value.countdown = 0;
  }

  function pause() {
    state.value.paused = true;
    updateCountdown();
  }

  function resume() {
    state.value.paused = false;
    updateCountdown();
  }

  function togglePause() {
    if (state.value.paused) resume();
    else pause();
  }

  function setSpeed(s: number) {
    state.value.speed = s;
    startAutoRefresh();
  }

  // 监听刷新间隔变化
  watch(() => settingsStore.settings.refreshInterval, () => {
    startAutoRefresh();
  });

  // 监听页面可见性
  function onVisibilityChange() {
    if (document.hidden) {
      // 后台降频：暂停刷新
      stopAutoRefresh();
    } else {
      // 回到前台：立即刷新 + 恢复
      refresh();
      startAutoRefresh();
    }
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibilityChange);
    startAutoRefresh();
  });

  onUnmounted(() => {
    stopAutoRefresh();
    document.removeEventListener('visibilitychange', onVisibilityChange);
  });

  return {
    state,
    refresh,
    pause,
    resume,
    togglePause,
    setSpeed,
    onRefresh,
    startAutoRefresh,
    stopAutoRefresh,
  };
}
