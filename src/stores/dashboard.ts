import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { DashboardData, SalesData, TrafficData, DistributionData, EfficiencyData } from '@/types/dashboard';
import { fetchDashboardData } from '@/services/dashboard';
import { createLogger } from '@/services/logger';

const logger = createLogger('DashboardStore');

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<DashboardData | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchDashboard() {
    loading.value = true;
    error.value = null;
    try {
      logger.info('Loading dashboard data...');
      data.value = await fetchDashboardData();
      logger.info('Dashboard data loaded');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      error.value = msg;
      logger.error('Dashboard load failed', msg);
    } finally {
      loading.value = false;
    }
  }

  const salesData = computed<SalesData[]>(() => data.value?.sales ?? []);
  const trafficData = computed<TrafficData[]>(() => data.value?.traffic ?? []);
  const distributionData = computed<DistributionData[]>(() => data.value?.distribution ?? []);
  const efficiencyData = computed<EfficiencyData[]>(() => data.value?.efficiency ?? []);

  return { data, loading, error, fetchDashboard, salesData, trafficData, distributionData, efficiencyData };
});
