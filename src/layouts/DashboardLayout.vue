<template>
  <div class="dashboard-wrapper" ref="wrapperRef">
    <div class="dashboard-grid" :style="gridStyle">
      <!-- Top: Header -->
      <div class="grid-item grid-header">
        <PageHeader />
      </div>

      <!-- Left Column -->
      <div class="grid-item grid-left-top">
        <BorderBox title="流量渠道分布">
          <PieChart :data="trafficData" />
        </BorderBox>
      </div>
      <div class="grid-item grid-left-bottom">
        <BorderBox title="生产效率指标">
          <GaugeChart :data="efficiencyData" />
        </BorderBox>
      </div>

      <!-- Center Column -->
      <div class="grid-item grid-center-top">
        <BorderBox title="月度销售趋势">
          <LineChart :data="salesData" />
        </BorderBox>
      </div>
      <div class="grid-item grid-center-bottom">
        <BorderBox title="销售额对比">
          <BarChart :data="salesData" />
        </BorderBox>
      </div>

      <!-- Right Column -->
      <div class="grid-item grid-right-top">
        <BorderBox title="核心指标概览">
          <div class="metrics-grid">
            <DigitalScroll label="总销售额" :value="totalRevenue" unit="万元" />
            <DigitalScroll label="订单总量" :value="totalOrders" unit="单" />
            <DigitalScroll label="客户总数" :value="totalCustomers" unit="人" />
            <DigitalScroll label="平均客单" :value="avgOrder" unit="元" />
          </div>
        </BorderBox>
      </div>
      <div class="grid-item grid-right-bottom">
        <BorderBox title="数据洞察">
          <div class="insight-content">
            <Decoration />
            <p class="insight-text">本月销售额 <span class="highlight">2,010万</span>，环比增长 <span class="highlight up">10.4%</span></p>
            <p class="insight-text">年度目标完成率 <span class="highlight">83.7%</span></p>
            <p class="insight-text">核心品类占比超 <span class="highlight">65%</span></p>
            <Decoration />
          </div>
        </BorderBox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import PageHeader from '@/components/PageHeader/PageHeader.vue';
import BorderBox from '@/components/BorderBox/BorderBox.vue';
import Decoration from '@/components/Decoration/Decoration.vue';
import DigitalScroll from '@/components/DigitalScroll/DigitalScroll.vue';
import PieChart from '@/charts/PieChart/PieChart.vue';
import GaugeChart from '@/charts/GaugeChart/GaugeChart.vue';
import LineChart from '@/charts/LineChart/LineChart.vue';
import BarChart from '@/charts/BarChart/BarChart.vue';
import { useAutoResize } from '@/composables/useAutoResize';
import { useDashboardStore } from '@/stores/dashboard';
import { storeToRefs } from 'pinia';

const wrapperRef = ref<HTMLElement>();
const { scale } = useAutoResize(wrapperRef, 1920, 1080);

const store = useDashboardStore();
const { salesData, trafficData, distributionData, efficiencyData } = storeToRefs(store);

const gridStyle = computed(() => ({
  width: '1920px',
  height: '1080px',
  transform: `scale(${scale.value})`,
  transformOrigin: 'left top',
}));

const totalRevenue = computed(() => salesData.value.reduce((s, v) => s + v.revenue, 0));
const totalOrders = ref(38462);
const totalCustomers = ref(12850);
const avgOrder = ref(523);
</script>

<style scoped lang="scss">
.dashboard-wrapper {
  width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse at center, #0d2b4a 0%, #0a1a2e 70%);
  &::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 60px 1fr 1fr;
  gap: 8px;
  padding: 0 12px 12px;
  position: relative; z-index: 1;
}
.grid-header { grid-column: 1 / -1; grid-row: 1; }
.grid-left-top { grid-column: 1 / 4; grid-row: 2; }
.grid-left-bottom { grid-column: 1 / 4; grid-row: 3; }
.grid-center-top { grid-column: 4 / 10; grid-row: 2; }
.grid-center-bottom { grid-column: 4 / 10; grid-row: 3; }
.grid-right-top { grid-column: 10 / -1; grid-row: 2; }
.grid-right-bottom { grid-column: 10 / -1; grid-row: 3; }

.metrics-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 8px;
}
.insight-content {
  display: flex; flex-direction: column; gap: 12px; padding: 16px;
}
.insight-text {
  font-size: 14px; color: rgba(224,230,240,0.8); line-height: 1.8;
  .highlight { color: #00d4ff; font-weight: 600; }
  .highlight.up { color: #00ff88; }
}
</style>
