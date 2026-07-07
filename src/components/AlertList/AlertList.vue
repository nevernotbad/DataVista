<template>
  <div class="alert-list">
    <div class="alert-item" v-for="alert in alerts" :key="alert.id" :class="'level-' + alert.level">
      <span class="alert-dot"></span>
      <span class="alert-msg">{{ alert.message }}</span>
      <span class="alert-time">{{ alert.time }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { AlertData } from '@/types/dashboard';
defineProps<{ alerts: AlertData[] }>();
</script>
<style scoped lang="scss">
.alert-list { display: flex; flex-direction: column; gap: 6px; padding: 4px 0; }
.alert-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: $radius-sm; background: $glass-bg-light; font-size: $font-size-sm; transition: all $transition-fast;
  &:hover { background: $glass-bg-hover; }
  .alert-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .alert-msg { flex: 1; color: rgba(208,216,232,0.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .alert-time { color: rgba(208,216,232,0.4); font-family: $font-mono; font-size: $font-size-xs; flex-shrink: 0; }
  &.level-danger .alert-dot { background: $color-danger; box-shadow: 0 0 6px $color-danger; }
  &.level-danger .alert-msg { color: $color-danger; }
  &.level-warning .alert-dot { background: $color-warning; box-shadow: 0 0 6px $color-warning; }
  &.level-warning .alert-msg { color: $color-warning; }
  &.level-info .alert-dot { background: $color-primary; }
}
</style>
