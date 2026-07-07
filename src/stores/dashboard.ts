import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { DashboardData, SalesData, TrafficData, EfficiencyData, DeviceData, RegionData, YoYData, AlertData } from '@/types/dashboard';
import { fetchDashboardData } from '@/services/dashboard';
import { createLogger } from '@/services/logger';

const logger = createLogger('DashboardStore');

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<DashboardData | null>(null);
  const initialLoading = ref(true);  // 仅首次加载显示 loading
  const refreshing = ref(false);     // 后续刷新不卸载组件
  const error = ref<string | null>(null);
  const lastUpdated = ref<Date | null>(null);
  const refreshCount = ref(0);

  async function fetchDashboard() {
    error.value = null;
    // 首次加载才有 loading 遮罩，后续只标记 refreshing
    if (!data.value) {
      initialLoading.value = true;
    } else {
      refreshing.value = true;
    }
    try {
      const newData = await fetchDashboardData();
      data.value = newData;
      lastUpdated.value = new Date();
      refreshCount.value++;
      logger.info('Data loaded', { refreshCount: refreshCount.value });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Dashboard load failed', error.value);
    } finally {
      initialLoading.value = false;
      refreshing.value = false;
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
  const totalOrders = computed(() => yoyData.value.find(y => y.label === '订单量')?.current ?? 0);
  const freshness = computed(() => data.value?.freshness ?? 100);

  return {
    data, initialLoading, refreshing, error, lastUpdated, refreshCount,
    fetchDashboard,
    salesData, trafficData, efficiencyData,
    devicesData, regionsData, yoyData, alertsData,
    totalRevenue, totalOrders, freshness,
  };
});
