<template>
  <div class="dashboard-page">
    <Loading :visible="loading" />
    <div v-if="error" class="error-state">
      <p class="error-title">数据加载失败</p>
      <p class="error-msg">{{ error }}</p>
      <button class="error-btn" @click="retry">重新加载</button>
    </div>
    <DashboardLayout v-if="!loading && !error" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@/stores/dashboard';
import Loading from '@/components/Loading/Loading.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';

const store = useDashboardStore();
const { loading, error } = storeToRefs(store);
function retry() { store.fetchDashboard(); }
onMounted(() => store.fetchDashboard());
</script>

<style scoped lang="scss">
.dashboard-page { width: 100%; height: 100%; position: relative; }
.error-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; gap: 16px;
}
.error-title { font-size: $font-size-xl; color: $color-danger; }
.error-msg { font-size: $font-size-sm; color: rgba(224,80,80,0.6); }
.error-btn {
  background: rgba(0,180,216,0.15); border: 1px solid rgba(0,180,216,0.3);
  color: $color-primary; padding: 8px 28px; border-radius: $radius-sm;
  cursor: pointer; transition: all $transition-normal;
  &:hover { background: rgba(0,180,216,0.25); box-shadow: $glow-sm; }
}
</style>
