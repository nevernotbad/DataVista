<template>
  <div class="stat-card" :class="{ 'highlight-change': isHighlighted }">
    <!-- 变化光晕波纹 -->
    <span v-if="isHighlighted" class="change-ripple" :class="changeDirection" />
    <div v-if="icon" class="stat-icon">{{ icon }}</div>
    <div class="stat-info">
      <span class="stat-label">{{ label }}</span>
      <span class="stat-value" :class="trendClass">
        <span ref="numberRef" class="stat-number">{{ displayValue }}</span>
        <span v-if="unit" class="stat-unit">{{ unit }}</span>
        <!-- 变化差值提示 -->
        <span v-if="changeDelta !== 0" class="change-delta" :class="changeDirection">
          {{ changeDelta > 0 ? '+' : '' }}{{ changeDelta }}
        </span>
      </span>
      <div class="stat-meta">
        <span v-if="change !== undefined" class="stat-change" :class="trendClass">
          <span class="change-arrow">{{ change >= 0 ? '↑' : '↓' }}</span>
          {{ Math.abs(change) }}%
        </span>
        <span v-if="lastValue !== undefined" class="stat-vs">
          环比 {{ formatChangeText() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';

const props = defineProps<{
  label: string;
  value: number;
  unit?: string;
  icon?: string;
  change?: number;
  lastValue?: number;
  duration?: number;
}>();

const displayValue = ref(0);
const isHighlighted = ref(false);
const changeDelta = ref(0);
const prevValue = ref(0);
const changeDirection = ref<'up' | 'down' | ''>('');
const dur = props.duration ?? 1500;

function animate() {
  if (dur <= 0) {
    displayValue.value = props.value;
    return;
  }
  const start = performance.now();
  const from = displayValue.value;
  const to = props.value;

  // 计算变化量
  if (prevValue.value > 0) {
    changeDelta.value = Math.round(to - from);
    changeDirection.value = changeDelta.value > 0 ? 'up' : changeDelta.value < 0 ? 'down' : '';
  }
  prevValue.value = to;

  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / dur, 1);
    // easeOutExpo — 更明显的减速感
    const eased = progress >= 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    displayValue.value = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
    else {
      // 动画结束，清除变化指示
      setTimeout(() => {
        changeDelta.value = 0;
        changeDirection.value = '';
      }, 1800);
    }
  }
  requestAnimationFrame(step);

  // 高亮闪烁 — 多层效果
  if (Math.abs(to - from) > 0.5) {
    isHighlighted.value = true;
    setTimeout(() => { isHighlighted.value = false; }, 2200);
  }
}

function formatChangeText(): string {
  if (props.lastValue === undefined || props.lastValue === 0) return '--';
  const pct = ((props.value - props.lastValue) / props.lastValue * 100);
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

onMounted(() => { if (props.value > 0) animate(); });
watch(() => props.value, () => animate());

const trendClass = computed(() => {
  if (props.change === undefined) return '';
  return props.change >= 0 ? 'trend-up' : 'trend-down';
});
</script>

<style scoped lang="scss">
.stat-card {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  background: $glass-bg-light;
  border-radius: $radius-md;
  border: 1px solid rgba(0,180,216,0.08);
  transition: all $transition-normal;
  position: relative;
  overflow: hidden;

  &::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, transparent 40%, rgba(var(--color-primary-rgb, 0,180,216), 0.03));
    pointer-events: none;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: $glass-border;
    background: $glass-bg;
    box-shadow: $glow-sm;
    transform: translateY(-1px);
  }

  // 变化高亮状态
  &.highlight-change {
    animation: card-flash 2.2s ease-out;
    &::before {
      background: linear-gradient(135deg, transparent 30%, rgba(var(--color-primary-rgb, 0,180,216), 0.08));
    }
  }
}

// 波纹扩散
.change-ripple {
  position: absolute; inset: -2px; z-index: 0; pointer-events: none;
  border-radius: inherit;
  animation: ripple-out 2s ease-out;
  &.up   { border: 2px solid rgba(126,200,160,0.5); }
  &.down { border: 2px solid rgba(224,80,80,0.5); }
}

@keyframes ripple-out {
  0%   { inset: -2px; opacity: 1; border-width: 2px; }
  100% { inset: -20px; opacity: 0; border-width: 0; }
}

@keyframes card-flash {
  0%   { box-shadow: 0 0 24px rgba(var(--color-primary-rgb, 0,180,216), 0.5), inset 0 0 20px rgba(var(--color-primary-rgb, 0,180,216), 0.1); border-color: var(--color-primary); }
  30%  { box-shadow: 0 0 32px rgba(var(--color-primary-rgb, 0,180,216), 0.6), inset 0 0 24px rgba(var(--color-primary-rgb, 0,180,216), 0.15); }
  100% { box-shadow: 0 0 4px rgba(var(--color-primary-rgb, 0,180,216), 0.05); border-color: rgba(0,180,216,0.08); }
}

.stat-icon { font-size: 24px; flex-shrink: 0; }
.stat-info { display: flex; flex-direction: column; gap: 2px; flex: 1; position: relative; z-index: 1; }
.stat-label { font-size: $font-size-xs; color: var(--text-muted, rgba(208,216,232,0.5)); }

.stat-value { display: flex; align-items: baseline; gap: 4px; position: relative; }
.stat-number {
  font-size: $font-size-xl; font-weight: 700; font-family: $font-mono;
  color: $color-primary; @include text-glow;
  min-width: 60px;
  transition: color 0.3s;
}
.stat-unit { font-size: $font-size-sm; color: rgba(0,180,216,0.5); }

// 变化差值浮标
.change-delta {
  font-size: 10px; font-weight: 700; font-family: $font-mono;
  padding: 1px 4px; border-radius: 3px;
  animation: delta-pop 2s ease-out;
  position: relative; top: -6px;
  &.up {
    color: $color-accent2;
    background: rgba(126,200,160,0.15);
    border: 1px solid rgba(126,200,160,0.3);
  }
  &.down {
    color: $color-danger;
    background: rgba(224,80,80,0.15);
    border: 1px solid rgba(224,80,80,0.3);
  }
}

@keyframes delta-pop {
  0%   { opacity: 0; transform: scale(0.5) translateY(6px); }
  20%  { opacity: 1; transform: scale(1.3) translateY(-2px); }
  40%  { transform: scale(1) translateY(0); }
  100% { opacity: 0.6; transform: scale(1) translateY(0); }
}

.trend-arrow { font-size: 11px;
  &.trend-up { color: $color-accent2; }
  &.trend-down { color: $color-danger; }
}
.stat-meta { display: flex; align-items: center; gap: 8px; }
.stat-change { font-size: $font-size-xs; }
.change-arrow { margin-right: 2px; }

.stat-vs {
  font-size: 10px;
  color: var(--text-muted, rgba(208,216,232,0.4));
}

.trend-up .stat-number { color: $color-jade; text-shadow: 0 0 12px rgba(126,200,160,0.4); }
.trend-down .stat-number { color: $color-danger; text-shadow: 0 0 12px rgba(224,80,80,0.4); }
.trend-up .stat-change { color: $color-jade; }
.trend-down .stat-change { color: $color-danger; }
</style>
