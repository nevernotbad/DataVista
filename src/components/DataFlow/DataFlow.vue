<template>
  <div class="data-flow">
    <div class="flow-track">
      <div class="flow-items" :style="flowStyle">
        <span class="flow-item" v-for="(item, i) in items" :key="i">
          <span class="flow-label">{{ item.label }}</span>
          <span class="flow-value" :class="item.trend">{{ item.value }}</span>
        </span>
        <span class="flow-item" v-for="(item, i) in items" :key="'r'+i">
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
  animation: flow-scroll 30s linear infinite;
  &:hover { animation-play-state: paused; }
}
.flow-item { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.flow-label { color: rgba(208,216,232,0.5); font-size: $font-size-sm; }
.flow-value { font-family: $font-mono; font-size: $font-size-base; color: $color-primary;
  &.up { color: $color-jade; }
  &.down { color: $color-danger; }
  &.stable { color: $color-tertiary; }
}
@keyframes flow-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
