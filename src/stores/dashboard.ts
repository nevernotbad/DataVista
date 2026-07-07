import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { DashboardData, SalesData, TrafficData, EfficiencyData, DeviceData, RegionData, YoYData, AlertData } from '@/types/dashboard';
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
      data.value = await fetchDashboardData();
      logger.info('Dashboard data loaded');
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Dashboard load failed', error.value);
    } finally {
      loading.value = false;
    }
  }

  const salesData = computed<SalesData[]>(() => data.value?.sales ?? []);
  const trafficData = computed<TrafficData[]>(() => data.value?.traffic ?? []);
  const efficiencyData = computed<EfficiencyData[]>(() => data.value?.efficiency ?? []);
  const devicesData = computed<DeviceData[]>(() => data.value?.devices ?? []);
  const regionsData = computed<RegionData[]>(() => data.value?.regions ?? []);
  const yoyData = computed<YoYData[]>(() => data.value?.yoy ?? []);
  const alertsData = computed<AlertData[]>(() => data.value?.alerts ?? []);

  const totalRevenue = computed(() => salesData.value.reduce((s, v) => s + v.revenue, 0));

  return {
    data, loading, error, fetchDashboard,
    salesData, trafficData, efficiencyData,
    devicesData, regionsData, yoyData, alertsData,
    totalRevenue,
  };
});
