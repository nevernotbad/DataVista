<template>
  <div class="alert-list">
    <div v-if="alerts.length > 0" class="alert-filters">
      <button class="af-btn" :class="{ active: filter === 'all' }" @click="filter = 'all'">全部</button>
      <button class="af-btn af-danger" :class="{ active: filter === 'danger' }" @click="filter = 'danger'">严重</button>
      <button class="af-btn af-warning" :class="{ active: filter === 'warning' }" @click="filter = 'warning'">警告</button>
      <button class="af-btn af-info" :class="{ active: filter === 'info' }" @click="filter = 'info'">信息</button>
    </div>
    <TransitionGroup name="alert-slide" tag="div" class="alert-items">
      <div
        v-for="alert in filteredAlerts" :key="alert.id" class="alert-item"
        :class="'level-' + alert.level"
        @click="$emit('clickAlert', alert)"
      >
        <span class="alert-dot" />
        <span class="alert-msg">{{ alert.message }}</span>
        <span class="alert-time">{{ alert.time }}</span>
      </div>
    </TransitionGroup>
    <div v-if="alerts.length === 0" class="alert-empty">
      <span>暂无告警信息</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { AlertData } from '@/types/dashboard';

const props = defineProps<{ alerts: AlertData[] }>();
defineEmits<{ clickAlert: [alert: AlertData] }>();

const filter = ref<string>('all');

const filteredAlerts = computed(() => {
  if (filter.value === 'all') return props.alerts;
  return props.alerts.filter(a => a.level === filter.value);
});
</script>

<style scoped lang="scss">
.alert-list { display: flex; flex-direction: column; gap: 4px; }
.alert-filters { display: flex; gap: 4px; margin-bottom: 4px; }
.af-btn {
  padding: 2px 8px; border: 1px solid var(--glass-border); border-radius: 3px;
  background: transparent; color: var(--text-muted); cursor: pointer; font-size: 10px;
  transition: all 0.15s;
  &:hover { border-color: var(--color-primary); color: var(--color-primary); }
  &.active { background: rgba(var(--color-primary-rgb, 0,180,216), 0.15); border-color: var(--color-primary); color: var(--color-primary); }
  &.af-danger.active, &.af-danger:hover { border-color: $color-danger; color: $color-danger; background: rgba(224,80,80,0.1); }
  &.af-warning.active, &.af-warning:hover { border-color: $color-warning; color: $color-warning; background: rgba(240,160,64,0.1); }
  &.af-info.active, &.af-info:hover { border-color: $color-primary; color: $color-primary; }
}
.alert-items { display: flex; flex-direction: column; gap: 5px; }
.alert-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 10px; border-radius: $radius-sm;
  background: $glass-bg-light; font-size: $font-size-sm;
  transition: all $transition-fast;
  cursor: pointer;

  &:hover { background: $glass-bg-hover; transform: translateX(2px); border-left: 2px solid var(--color-primary); margin-left: -2px; }

  .alert-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .alert-msg { flex: 1; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .alert-time { color: var(--text-muted); font-family: $font-mono; font-size: $font-size-xs; flex-shrink: 0; }

  &.level-danger .alert-dot { background: $color-danger; box-shadow: 0 0 6px $color-danger; animation: danger-pulse 1.5s ease-in-out infinite; }
  &.level-danger .alert-msg { color: $color-danger; }
  &.level-warning .alert-dot { background: $color-warning; box-shadow: 0 0 6px $color-warning; }
  &.level-warning .alert-msg { color: $color-warning; }
  &.level-info .alert-dot { background: $color-primary; }
}

.alert-empty {
  padding: 24px; text-align: center; color: var(--text-muted); font-size: $font-size-sm;
}

@keyframes danger-pulse {
  0%, 100% { box-shadow: 0 0 6px $color-danger; }
  50% { box-shadow: 0 0 12px $color-danger, 0 0 24px rgba(224,80,80,0.3); }
}

// Transition
.alert-slide-enter-active, .alert-slide-leave-active { transition: all 0.4s ease; }
.alert-slide-enter-from { opacity: 0; transform: translateX(-20px); }
.alert-slide-leave-to { opacity: 0; transform: translateX(20px); }
</style>
