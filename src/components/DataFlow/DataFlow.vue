<template>
  <div class="data-flow">
    <div class="flow-track">
      <div class="flow-items" :style="flowStyle">
        <span v-for="(item, i) in items" :key="i" class="flow-item">
          <span class="flow-label">{{ item.label }}</span>
          <span class="flow-value" :class="item.trend">{{ item.value }}</span>
        </span>
        <span v-for="(item, i) in items" :key="'r'+i" class="flow-item">
          <span class="flow-label">{{ item.label }}</span>
          <span class="flow-value" :class="item.trend">{{ item.value }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface FlowItem { label: string; value: string; trend?: 'up' | 'down' | 'stable'; }

const props = defineProps<{ items: FlowItem[]; speed?: number }>();
const dur = props.speed ?? 30;

const flowStyle = computed(() => ({
  animationDuration: `${dur}s`,
}));
</script>

<style scoped lang="scss">
.data-flow { width: 100%; overflow: hidden; }
.flow-track { width: 100%; overflow: hidden; }
.flow-items {
  display: flex; gap: 40px; white-space: nowrap;
  animation: flow-scroll var(--flow-speed, 30s) linear infinite;
  &:hover { animation-play-state: paused; }
}
.flow-item {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  padding: 2px 8px; border-radius: 3px;
  transition: all 0.3s;
}
.flow-label {
  color: var(--text-muted, rgba(208,216,232,0.5));
  font-size: $font-size-sm;
}
.flow-value {
  font-family: $font-mono; font-size: $font-size-base;
  padding: 1px 6px; border-radius: 3px;
  transition: all 0.3s;
  color: $color-primary;
  &.up {
    color: $color-jade;
    text-shadow: 0 0 8px rgba(126,200,160,0.4);
    background: rgba(126,200,160,0.08);
  }
  &.down {
    color: $color-danger;
    text-shadow: 0 0 8px rgba(224,80,80,0.4);
    background: rgba(224,80,80,0.08);
  }
  &.stable {
    color: $color-tertiary;
    text-shadow: 0 0 6px rgba(var(--color-primary-rgb, 0,180,216), 0.3);
  }
}
@keyframes flow-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
