<template>
  <div class="dashboard-page">
    <Loading :visible="loading" />
    <div v-if="error" class="error-state">
      <p>数据加载失败</p>
      <p class="error-msg">{{ error }}</p>
      <button @click="retry">重试</button>
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

onMounted(() => { store.fetchDashboard(); });
</script>

<style scoped>
.dashboard-page { width: 100%; height: 100%; position: relative; }
.error-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #ff4d4f; gap: 12px; }
.error-msg { font-size: 14px; color: rgba(255,77,79,0.7); }
.error-state button { background: rgba(0,212,255,0.2); border: 1px solid #00d4ff; color: #00d4ff; padding: 8px 24px; border-radius: 4px; cursor: pointer; }
</style>
