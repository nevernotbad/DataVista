<template>
  <div class="stat-card">
    <div class="stat-icon" v-if="icon">{{ icon }}</div>
    <div class="stat-info">
      <span class="stat-label">{{ label }}</span>
      <span class="stat-value" :class="trendClass">
        <span class="stat-number">{{ displayValue }}</span>
        <span class="stat-unit" v-if="unit">{{ unit }}</span>
      </span>
      <span class="stat-change" v-if="change !== undefined">
        <span class="change-arrow">{{ change >= 0 ? '↑' : '↓' }}</span>
        {{ Math.abs(change) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
const props = defineProps<{ label: string; value: number; unit?: string; icon?: string; change?: number; duration?: number }>();
const displayValue = ref(0);
const dur = props.duration ?? 1200;

function animate() {
  const start = performance.now();
  const from = displayValue.value;
  const to = props.value;
  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / dur, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    displayValue.value = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

onMounted(() => { if (props.value > 0) animate(); });
watch(() => props.value, () => animate());

const trendClass = computed(() => {
  if (props.change === undefined) return '';
  return props.change >= 0 ? 'trend-up' : 'trend-down';
});

import { computed } from 'vue';
</script>

<style scoped lang="scss">
.stat-card {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  background: $glass-bg-light;
  border-radius: $radius-md;
  border: 1px solid rgba(0,180,216,0.08);
  transition: all $transition-normal;
  &:hover { border-color: $glass-border; background: $glass-bg; }
}
.stat-icon { font-size: 24px; flex-shrink: 0; }
.stat-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.stat-label { font-size: $font-size-xs; color: rgba(208,216,232,0.5); }
.stat-value { display: flex; align-items: baseline; gap: 4px; }
.stat-number { font-size: $font-size-xl; font-weight: 700; font-family: $font-mono; color: $color-primary; @include text-glow; }
.stat-unit { font-size: $font-size-sm; color: rgba(0,180,216,0.5); }
.stat-change { font-size: $font-size-xs; color: $color-jade; &.trend-down { color: $color-danger; } }
.trend-up .stat-number { color: $color-jade; }
.trend-down .stat-number { color: $color-danger; }
</style>
