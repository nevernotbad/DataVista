<template>
  <div class="dashboard-wrapper" ref="wrapperRef">
    <div class="dashboard-grid" :style="gridStyle">

      <!-- ==================== TOP: Header ==================== -->
      <div class="grid-header">
        <PageHeader />
      </div>

      <!-- ==================== LEFT COLUMN ==================== -->
      <div class="grid-left-top">
        <BorderBox title="流量渠道分布">
          <PieChart :data="trafficData" />
        </BorderBox>
      </div>
      <div class="grid-left-mid">
        <BorderBox title="区域访问排行">
          <div class="region-list">
            <div class="region-item" v-for="(r, i) in regionsData" :key="i">
              <span class="region-rank" :class="'rank-' + (i + 1)">{{ i + 1 }}</span>
              <span class="region-name">{{ r.region }}</span>
              <div class="region-bar-bg">
                <div class="region-bar-fill" :style="{ width: r.percentage }"></div>
              </div>
              <span class="region-visits">{{ (r.visits / 1000).toFixed(1) }}k</span>
            </div>
          </div>
        </BorderBox>
      </div>
      <div class="grid-left-bottom">
        <BorderBox title="设备类型占比">
          <PieChart :data="devicesData" />
        </BorderBox>
      </div>

      <!-- ==================== CENTER COLUMN ==================== -->
      <div class="grid-center-top">
        <BorderBox title="月度销售趋势">
          <LineChart :data="salesData" />
        </BorderBox>
      </div>
      <div class="grid-center-bottom">
        <BorderBox title="销售额对比分析">
          <BarChart :data="salesData" />
        </BorderBox>
      </div>

      <!-- ==================== RIGHT COLUMN ==================== -->
      <div class="grid-right-top">
        <BorderBox title="核心指标概览">
          <div class="stat-cards-grid">
            <StatCard
              v-for="y in yoyData" :key="y.label"
              :label="y.label" :value="y.current" unit="万"
              :change="y.change" :duration="1500"
            />
          </div>
        </BorderBox>
      </div>
      <div class="grid-right-mid">
        <BorderBox title="生产效率仪表">
          <GaugeChart :data="efficiencyData" />
        </BorderBox>
      </div>
      <div class="grid-right-bottom">
        <BorderBox title="实时告警">
          <AlertList :alerts="alertsData" />
        </BorderBox>
      </div>

      <!-- ==================== BOTTOM BAR ==================== -->
      <div class="grid-bottom">
        <BorderBox :padding="false" title="实时数据流">
          <DataFlow :items="flowItems" :speed="25" />
        </BorderBox>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@/stores/dashboard';
import { useAutoResize } from '@/composables/useAutoResize';
import PageHeader from '@/components/PageHeader/PageHeader.vue';
import BorderBox from '@/components/BorderBox/BorderBox.vue';
import StatCard from '@/components/StatCard/StatCard.vue';
import AlertList from '@/components/AlertList/AlertList.vue';
import DataFlow from '@/components/DataFlow/DataFlow.vue';
import PieChart from '@/charts/PieChart/PieChart.vue';
import LineChart from '@/charts/LineChart/LineChart.vue';
import BarChart from '@/charts/BarChart/BarChart.vue';
import GaugeChart from '@/charts/GaugeChart/GaugeChart.vue';

const store = useDashboardStore();
const { trafficData, salesData, efficiencyData, devicesData, regionsData, yoyData, alertsData } = storeToRefs(store);

const wrapperRef = ref<HTMLElement>();
const { scale } = useAutoResize(wrapperRef, 1920, 1080);

const gridStyle = computed(() => ({
  width: '1920px',
  height: '1080px',
  transform: `scale(${scale.value})`,
  transformOrigin: 'left top',
}));

const flowItems = [
  { label: '华东区', value: '实时订单 1,285', trend: 'up' as const },
  { label: '华南区', value: '实时订单 963', trend: 'up' as const },
  { label: '华北区', value: '实时订单 752', trend: 'stable' as const },
  { label: '西南区', value: '实时订单 541', trend: 'down' as const },
  { label: 'CDN流量', value: '86.4 GB/s', trend: 'up' as const },
  { label: 'API调用', value: '12,580/min', trend: 'stable' as const },
  { label: '数据库QPS', value: '3,240', trend: 'up' as const },
  { label: '消息队列', value: '8,120条', trend: 'stable' as const },
];
</script>

<style scoped lang="scss">
.dashboard-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: $bg-deep;
  position: relative;

  // 径向光效
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 30%, rgba(0,180,216,0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 70%, rgba(0,180,216,0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  // 网格纹理
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,180,216,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,180,216,0.015) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 56px 1fr 1fr 1fr 52px;
  gap: 8px;
  padding: 0 12px 10px;
  position: relative;
  z-index: 1;

  > div { min-height: 0; }
}

// Header
.grid-header { grid-column: 1 / -1; grid-row: 1; }

// Left: col 1-3, rows 2-4
.grid-left-top    { grid-column: 1 / 4; grid-row: 2; }
.grid-left-mid    { grid-column: 1 / 4; grid-row: 3; }
.grid-left-bottom  { grid-column: 1 / 4; grid-row: 4; }

// Center: col 4-9, rows 2-4
.grid-center-top    { grid-column: 4 / 10; grid-row: 2 / 4; }
.grid-center-bottom  { grid-column: 4 / 10; grid-row: 4; }

// Right: col 10-12, rows 2-4
.grid-right-top    { grid-column: 10 / -1; grid-row: 2; }
.grid-right-mid    { grid-column: 10 / -1; grid-row: 3; }
.grid-right-bottom   { grid-column: 10 / -1; grid-row: 4; }

// Bottom bar
.grid-bottom { grid-column: 1 / -1; grid-row: 5; }

// Region list
.region-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 0;
}

.region-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: $font-size-sm;
}

.region-rank {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  font-size: $font-size-xs;
  font-weight: 700;
  background: rgba(0,180,216,0.15);
  color: rgba(208,216,232,0.5);
  flex-shrink: 0;
  &.rank-1 { background: $color-gold; color: #0a1628; }
  &.rank-2 { background: rgba(201,169,110,0.5); color: #e0dcc8; }
  &.rank-3 { background: rgba(201,169,110,0.3); color: #d0c8a8; }
}

.region-name {
  width: 64px;
  flex-shrink: 0;
  color: rgba(208,216,232,0.7);
}

.region-bar-bg {
  flex: 1;
  height: 6px;
  background: rgba(0,180,216,0.06);
  border-radius: 3px;
  overflow: hidden;
}

.region-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, $color-primary, $color-secondary);
  border-radius: 3px;
  transition: width $transition-slow;
  min-width: 2px;
}

.region-visits {
  font-family: $font-mono;
  font-size: $font-size-xs;
  color: rgba(0,180,216,0.7);
  flex-shrink: 0;
}

// Stat cards grid
.stat-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
