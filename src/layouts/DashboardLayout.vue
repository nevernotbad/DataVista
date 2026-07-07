<template>
  <div class="dashboard-wrapper" ref="wrapperRef">
    <!-- 背景装饰层 -->
    <div class="bg-layer">
      <div class="bg-glow bg-glow-1"></div>
      <div class="bg-glow bg-glow-2"></div>
      <div class="bg-grid"></div>
      <div class="bg-pattern"></div>
    </div>

    <!-- 内容层 -->
    <div class="dashboard-grid">

      <!-- ====== TOP HEADER ====== -->
      <div class="grid-header">
        <PageHeader />
      </div>

      <!-- ====== LEFT COLUMN (3/12) ====== -->
      <div class="grid-left-top">
        <BorderBox title="流量渠道分布">
          <PieChart :data="trafficData" />
        </BorderBox>
      </div>
      <div class="grid-left-mid">
        <BorderBox title="区域访问排行">
          <div class="region-list">
            <div class="region-item" v-for="(r, i) in regionsData.slice(0,5)" :key="i">
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
        <BorderBox title="设备类型分布">
          <PieChart :data="devicesData" />
        </BorderBox>
      </div>

      <!-- ====== CENTER COLUMN (6/12) ====== -->
      <div class="grid-center-top">
        <BorderBox title="销售趋势总览">
          <LineChart :data="salesData" />
        </BorderBox>
      </div>
      <div class="grid-center-bottom">
        <BorderBox title="销售额对比分析">
          <BarChart :data="salesData" />
        </BorderBox>
      </div>

      <!-- ====== RIGHT COLUMN (3/12) ====== -->
      <div class="grid-right-top">
        <BorderBox title="核心指标">
          <div class="stat-cards-grid">
            <StatCard
              v-for="y in yoyData" :key="y.label"
              :label="y.label" :value="y.current" :unit="'channel' in y ? undefined : '万'"
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

      <!-- ====== BOTTOM BAR (FULL) ====== -->
      <div class="grid-bottom">
        <div class="bottom-bar">
          <BorderBox :padding="false">
            <div class="bottom-content">
              <div class="bottom-left">
                <span class="bottom-label">实时数据流</span>
                <span class="bottom-divider">|</span>
              </div>
              <div class="bottom-center">
                <DataFlow :items="flowItems" :speed="20" />
              </div>
              <div class="bottom-right">
                <span class="bottom-stat" v-for="s in quickStats" :key="s.label">
                  <span class="bs-label">{{ s.label }}</span>
                  <span class="bs-value" :class="s.trend">{{ s.value }}</span>
                </span>
              </div>
            </div>
          </BorderBox>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
useAutoResize(wrapperRef, 1920, 1080);

const flowItems = [
  { label: '华东区', value: '实时 1,285 单', trend: 'up' as const },
  { label: '华南区', value: '实时 963 单', trend: 'up' as const },
  { label: '华北区', value: '实时 752 单', trend: 'stable' as const },
  { label: '西南区', value: '实时 541 单', trend: 'down' as const },
  { label: 'CDN', value: '86.4 GB/s', trend: 'up' as const },
  { label: 'API', value: '12,580/min', trend: 'stable' as const },
  { label: 'DB-QPS', value: '3,240', trend: 'up' as const },
  { label: 'MQ', value: '8,120 条', trend: 'stable' as const },
];

const quickStats = [
  { label: 'CPU', value: '34%', trend: 'stable' as const },
  { label: '内存', value: '62%', trend: 'up' as const },
  { label: '磁盘', value: '41%', trend: 'stable' as const },
  { label: '带宽', value: '2.4G', trend: 'up' as const },
];
</script>

<style scoped lang="scss">
.dashboard-wrapper {
  width: 1920px;
  height: 1080px;
  position: absolute;
  left: 0;
  top: 0;
  background: $bg-deep;
  overflow: hidden;
  font-family: $font-family;
}

// ====== BACKGROUND LAYERS ======
.bg-layer {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
}

.bg-glow {
  position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.12;
  &-1 { width: 900px; height: 600px; top: -100px; left: 50%; transform: translateX(-50%); background: radial-gradient(circle, $color-primary, transparent); }
  &-2 { width: 600px; height: 400px; bottom: -50px; right: 10%; background: radial-gradient(circle, $color-secondary, transparent); opacity: 0.08; }
}

.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(0,180,216,0.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,180,216,0.012) 1px, transparent 1px);
  background-size: 48px 48px;
}

.bg-pattern {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(201,169,110,0.015) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(201,169,110,0.01) 0%, transparent 50%);
  opacity: 0.5;
}

// ====== GRID ======
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 54px 1fr 1fr 1fr 46px;
  gap: 6px;
  padding: 0 10px 8px;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  box-sizing: border-box;

  > div { min-height: 0; min-width: 0; }
}

// HEADER
.grid-header { grid-column: 1 / -1; grid-row: 1; z-index: 10; overflow: visible; }

// LEFT (3 cols)
.grid-left-top    { grid-column: 1 / 4; grid-row: 2; }
.grid-left-mid    { grid-column: 1 / 4; grid-row: 3; }
.grid-left-bottom { grid-column: 1 / 4; grid-row: 4; }

// CENTER (6 cols) — bigger for focal charts
.grid-center-top    { grid-column: 4 / 10; grid-row: 2 / 4; }
.grid-center-bottom { grid-column: 4 / 10; grid-row: 4; }

// RIGHT (3 cols)
.grid-right-top    { grid-column: 10 / -1; grid-row: 2; }
.grid-right-mid    { grid-column: 10 / -1; grid-row: 3; }
.grid-right-bottom { grid-column: 10 / -1; grid-row: 4; }

// BOTTOM
.grid-bottom { grid-column: 1 / -1; grid-row: 5; }

// ====== REGION LIST ======
.region-list { display: flex; flex-direction: column; gap: 5px; padding: 2px 0; }
.region-item { display: flex; align-items: center; gap: 8px; font-size: $font-size-sm; }
.region-rank {
  width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
  border-radius: 2px; font-size: $font-size-xs; font-weight: 700; flex-shrink: 0;
  background: rgba(0,180,216,0.12); color: rgba(208,216,232,0.5);
  &.rank-1 { background: $color-gold; color: #0a1628; }
  &.rank-2 { background: rgba(201,169,110,0.55); color: #f0e8d0; }
  &.rank-3 { background: rgba(201,169,110,0.3); color: #e0d8c0; }
}
.region-name { width: 60px; flex-shrink: 0; color: rgba(208,216,232,0.7); font-size: $font-size-xs; }
.region-bar-bg { flex: 1; height: 6px; background: rgba(0,180,216,0.06); border-radius: 3px; overflow: hidden; }
.region-bar-fill { height: 100%; background: linear-gradient(90deg, $color-primary, $color-secondary); border-radius: 3px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); min-width: 2px; }
.region-visits { font-family: $font-mono; font-size: $font-size-xs; color: rgba(0,180,216,0.7); flex-shrink: 0; }

// ====== STAT CARDS ======
.stat-cards-grid { display: flex; flex-direction: column; gap: 5px; }

// ====== BOTTOM BAR ======
.bottom-bar { height: 100%; }
.bottom-content {
  display: flex; align-items: center; height: 100%; padding: 0 12px; gap: 16px;
}
.bottom-left { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.bottom-label { color: $color-gold; font-size: $font-size-sm; font-weight: 600; letter-spacing: 2px; }
.bottom-divider { color: rgba(201,169,110,0.3); }
.bottom-center { flex: 1; overflow: hidden; }
.bottom-right { display: flex; gap: 20px; flex-shrink: 0; }
.bottom-stat { display: flex; align-items: center; gap: 6px; }
.bs-label { color: rgba(208,216,232,0.4); font-size: $font-size-xs; }
.bs-value { font-family: $font-mono; font-size: $font-size-sm; color: $color-tertiary;
  &.up { color: $color-jade; }
  &.down { color: $color-danger; }
}
</style>
