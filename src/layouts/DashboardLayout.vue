<template>
  <div ref="wrapperRef" class="dashboard-wrapper">
    <!-- 背景装饰层 -->
    <div v-if="settings.showBgEffects" class="bg-layer">
      <div class="bg-glow bg-glow-1" />
      <div class="bg-glow bg-glow-2" />
      <div class="bg-glow bg-glow-3" />
      <div class="bg-grid" />
      <div v-if="settings.enableAnimations" class="bg-particles">
        <!-- 浮动光点 -->
        <span v-for="i in 6" :key="i" class="bg-float-orb" :style="orbStyle(i)" />
      </div>
      <!-- 扫描线 -->
      <div v-if="settings.enableAnimations" class="bg-scan-line" />
    </div>

    <!-- 内容层 -->
    <div class="dashboard-grid" :style="gridStyle">
      <!-- ====== TOP HEADER ====== -->
      <div class="grid-header">
        <PageHeader
          :refreshing="refreshState.refreshing"
          :last-refresh="refreshState.lastRefresh"
          :countdown="refreshState.countdown"
          :paused="refreshState.paused"
          :speed="refreshState.speed"
          @refresh="doRefresh"
          @toggle-pause="refreshEngine.togglePause()"
          @open-settings="showSettings = true"
        />
      </div>

      <!-- ====== LEFT COLUMN (2.5/12) ====== -->
      <div class="grid-left-top">
        <BorderBox title="流量渠道分布" icon="📊">
          <PieChart :data="trafficData" />
        </BorderBox>
      </div>
      <div class="grid-left-mid">
        <BorderBox title="区域访问排行" icon="🏆">
          <div class="region-list">
            <TransitionGroup name="rank-move">
              <div v-for="(r, i) in regionsData.slice(0, 5)" :key="r.region" class="region-item">
                <span class="region-rank" :class="'rank-' + (i + 1)">{{ i + 1 }}</span>
                <span class="region-name">{{ r.region }}</span>
                <div class="region-bar-bg">
                  <div class="region-bar-fill" :style="{ width: r.percentage }" />
                </div>
                <span class="region-visits">{{ (r.visits / 1000).toFixed(1) }}k</span>
                <span v-if="getRegionChange(r.region)" class="region-change" :class="getRegionChange(r.region)!.trend">
                  {{ getRegionChange(r.region)!.arrow }}
                </span>
              </div>
            </TransitionGroup>
          </div>
        </BorderBox>
      </div>
      <div class="grid-left-bottom">
        <BorderBox title="区域能力雷达" icon="🎯">
          <RadarChart :data="radarData" />
        </BorderBox>
      </div>

      <!-- ====== CENTER COLUMN (7/12) — bigger focal area ====== -->
      <div class="grid-center-top">
        <BorderBox title="销售趋势总览" icon="📈">
          <LineChart :data="salesData" />
        </BorderBox>
      </div>
      <div class="grid-center-bottom">
        <BorderBox title="销售额对比分析" icon="📊">
          <BarChart :data="salesData" />
        </BorderBox>
      </div>

      <!-- ====== RIGHT COLUMN (2.5/12) ====== -->
      <div class="grid-right-top">
        <BorderBox title="核心指标" icon="💎">
          <div class="stat-cards-grid">
            <StatCard
              v-for="y in yoyData" :key="y.label"
              :label="y.label" :value="y.current"
              :unit="y.label.includes('销售额') || y.label.includes('收入') ? '万' : undefined"
              :change="y.change" :last-value="y.last"
              :duration="settings.enableAnimations ? 1500 : 0"
            />
          </div>
        </BorderBox>
      </div>
      <div class="grid-right-mid">
        <BorderBox title="生产效率仪表" icon="⏱">
          <GaugeChart :data="efficiencyData" />
        </BorderBox>
      </div>
      <div class="grid-right-bottom">
        <BorderBox title="实时告警" icon="🔔">
          <AlertList :alerts="alertsData" @click-alert="onAlertClick" />
        </BorderBox>
      </div>

      <!-- ====== BOTTOM BAR (FULL) ====== -->
      <div v-if="settings.showDataFlow" class="grid-bottom">
        <div class="bottom-bar">
          <BorderBox :padding="false" title="">
            <div class="bottom-content">
              <div class="bottom-left">
                <span class="bottom-label">实时数据流</span>
                <span class="bottom-divider">|</span>
                <button class="bottom-pause-btn" :title="refreshState.paused ? '继续' : '暂停'" @click="refreshEngine.togglePause()">
                  {{ refreshState.paused ? '▶' : '⏸' }}
                </button>
              </div>
              <div class="bottom-center">
                <DataFlow :items="flowItems" :speed="20" />
              </div>
              <div class="bottom-right">
                <span v-for="s in quickStats" :key="s.label" class="bottom-stat">
                  <span class="bs-label">{{ s.label }}</span>
                  <span class="bs-value" :class="s.trend">{{ s.value }}</span>
                </span>
              </div>
            </div>
          </BorderBox>
        </div>
      </div>
    </div>

    <!-- 设置面板 -->
    <SettingsPanel :visible="showSettings" @close="showSettings = false" />

    <!-- 告警详情弹窗 -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="selectedAlert" class="alert-modal-overlay" @click.self="selectedAlert = null">
          <div class="alert-modal">
            <div class="am-header">
              <span class="am-title">告警详情</span>
              <button class="am-close" @click="selectedAlert = null">✕</button>
            </div>
            <div class="am-body">
              <div class="am-level" :class="'level-' + selectedAlert.level">
                {{ levelLabel(selectedAlert.level) }}
              </div>
              <p class="am-msg">{{ selectedAlert.message }}</p>
              <p class="am-time">时间：{{ selectedAlert.time }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@/stores/dashboard';
import { useSettingsStore } from '@/stores/settings';
import { useAutoResize } from '@/composables/useAutoResize';
import { useDataRefresh } from '@/composables/useDataRefresh';
import { useKeyboard } from '@/composables/useKeyboard';
import { useFullscreen } from '@/composables/useFullscreen';
import PageHeader from '@/components/PageHeader/PageHeader.vue';
import BorderBox from '@/components/BorderBox/BorderBox.vue';
import StatCard from '@/components/StatCard/StatCard.vue';
import AlertList from '@/components/AlertList/AlertList.vue';
import DataFlow from '@/components/DataFlow/DataFlow.vue';
import SettingsPanel from '@/components/SettingsPanel/SettingsPanel.vue';
import PieChart from '@/charts/PieChart/PieChart.vue';
import LineChart from '@/charts/LineChart/LineChart.vue';
import BarChart from '@/charts/BarChart/BarChart.vue';
import GaugeChart from '@/charts/GaugeChart/GaugeChart.vue';
import RadarChart from '@/charts/RadarChart/RadarChart.vue';
import type { AlertData } from '@/types/dashboard';

const dashboardStore = useDashboardStore();
const { trafficData, salesData, efficiencyData, regionsData, yoyData, alertsData } = storeToRefs(dashboardStore);

const settingsStore = useSettingsStore();
const settings = computed(() => settingsStore.settings);
const showSettings = ref(false);

// 数据刷新引擎
const refreshEngine = useDataRefresh();
const refreshState = refreshEngine.state;
refreshEngine.onRefresh(() => dashboardStore.fetchDashboard());

async function doRefresh() {
  await refreshEngine.refresh();
}

// 全屏
const { toggle: toggleFullscreen } = useFullscreen();

// 键盘快捷键
const { bind } = useKeyboard();
bind('f', toggleFullscreen, '全屏');
bind('r', doRefresh, '刷新数据');
bind(' ', () => refreshEngine.togglePause(), '播放/暂停');
bind('escape', () => { showSettings.value = false; }, '关闭面板');
bind('s', () => { showSettings.value = !showSettings.value; }, '设置面板', { ctrl: true });

// 缩放适配
const wrapperRef = ref<HTMLElement>();
const { scale } = useAutoResize(wrapperRef, 1920, 1080);
void scale; // used reactively by useAutoResize

// 用户缩放覆盖
const gridStyle = computed(() => {
  const z = settings.value.zoomLevel;
  if (z === 1) return {};
  return {
    transform: `scale(${z})`,
    transformOrigin: 'center center',
  };
});

// 字号缩放
watch(() => settings.value.fontSizeScale, (s) => {
  document.documentElement.style.fontSize = `${15 * s}px`;
}, { immediate: true });

// region change tracking
const regionChanges = ref<Record<string, { arrow: string; trend: string }>>({});
function getRegionChange(region: string) {
  return regionChanges.value[region] || null;
}

// 雷达图数据
const radarData = computed(() => {
  const maxVisit = Math.max(...regionsData.value.map(r => r.visits), 1);
  return regionsData.value.slice(0, 6).map(r => ({
    name: r.region,
    value: Math.round((r.visits / maxVisit) * 100),
  }));
});

// 告警
const selectedAlert = ref<AlertData | null>(null);
function onAlertClick(alert: AlertData) {
  selectedAlert.value = alert;
}
function levelLabel(level: string) {
  const map: Record<string, string> = { danger: '🔴 严重', warning: '🟡 警告', info: '🔵 信息' };
  return map[level] ?? level;
}

// 背景浮动光点 — 随机初始位置和动画延迟
const orbSeeds = Array.from({ length: 6 }, (_, i) => ({
  x: 15 + (i * 67) % 85,
  y: 10 + (i * 41) % 80,
  delay: i * 2.3,
  size: 80 + (i * 73) % 200,
}));
function orbStyle(i: number) {
  const s = orbSeeds[i - 1];
  return {
    left: `${s.x}%`,
    top: `${s.y}%`,
    width: `${s.size}px`,
    height: `${s.size}px`,
    animationDelay: `${s.delay}s`,
  };
}

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

// 光晕 — 三个不同位置和颜色的大光斑
.bg-glow {
  position: absolute; border-radius: 50%; filter: blur(140px);
  &-1 {
    width: 1200px; height: 800px; top: -300px; left: 50%; transform: translateX(-50%);
    background: radial-gradient(circle, $color-primary, transparent);
    opacity: 0.08; animation: glow-float-1 10s ease-in-out infinite;
  }
  &-2 {
    width: 600px; height: 450px; bottom: -150px; right: 8%;
    background: radial-gradient(circle, $color-accent, transparent);
    opacity: 0.05; animation: glow-float-2 12s ease-in-out infinite;
  }
  &-3 {
    width: 400px; height: 400px; top: 40%; left: -5%;
    background: radial-gradient(circle, $color-accent2, transparent);
    opacity: 0.04; animation: glow-float-3 14s ease-in-out infinite;
  }
}

@keyframes glow-float-1 {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.08; }
  50% { transform: translateX(-50%) scale(1.15); opacity: 0.13; }
}
@keyframes glow-float-2 {
  0%, 100% { transform: scale(1); opacity: 0.05; }
  40% { transform: scale(1.2) translateY(-30px); opacity: 0.09; }
  80% { transform: scale(0.9); opacity: 0.03; }
}
@keyframes glow-float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.04; }
  33% { transform: translate(30px, -20px) scale(1.25); opacity: 0.08; }
  66% { transform: translate(-20px, 10px) scale(0.85); opacity: 0.02; }
}

// 背景网格 — 呼吸效果
.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(var(--color-primary-rgb, 0,180,216), 0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--color-primary-rgb, 0,180,216), 0.018) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: grid-breath 8s ease-in-out infinite;
}

@keyframes grid-breath {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

// 浮动光点
.bg-float-orb {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--color-primary-rgb, 0,180,216), 0.08) 0%, transparent 70%);
  animation: orb-drift 16s ease-in-out infinite;
  pointer-events: none;
}

@keyframes orb-drift {
  0%   { transform: translate(0, 0) scale(1); }
  25%  { transform: translate(40px, -30px) scale(1.3); }
  50%  { transform: translate(-20px, 20px) scale(0.8); }
  75%  { transform: translate(30px, 10px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
}

// 扫描线 — 从上到下缓缓扫过
.bg-scan-line {
  position: absolute; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb, 0,180,216), 0.12), transparent);
  animation: scan-down 8s linear infinite;
  pointer-events: none;
}

@keyframes scan-down {
  0% { top: -2px; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.bg-particles { position: absolute; inset: 0; }

// ====== GRID ======
.dashboard-grid {
  display: grid;
  // 2.5 : 7 : 2.5 ratio for left : center : right
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  // rows: header | main-top | main-mid | main-bottom | bottom-bar
  grid-template-rows: 54px 1fr 1fr 1fr 50px;
  gap: 6px 8px;
  padding: 0 10px 6px;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  box-sizing: border-box;

  > div { min-height: 0; min-width: 0; }
}

// HEADER
.grid-header { grid-column: 1 / -1; grid-row: 1; z-index: 10; overflow: visible; }

// LEFT (5/24 = 2.5/12)
.grid-left-top    { grid-column: 1 / 6; grid-row: 2; }
.grid-left-mid    { grid-column: 1 / 6; grid-row: 3; }
.grid-left-bottom { grid-column: 1 / 6; grid-row: 4; }

// CENTER (14/24 = 7/12) — expanded for more visual weight
.grid-center-top    { grid-column: 6 / 20; grid-row: 2 / 4; }  // spans rows 2-3, big chart
.grid-center-bottom { grid-column: 6 / 20; grid-row: 4; }      // row 4, bar chart

// RIGHT (5/24 = 2.5/12)
.grid-right-top    { grid-column: 20 / -1; grid-row: 2; }
.grid-right-mid    { grid-column: 20 / -1; grid-row: 3; }
.grid-right-bottom { grid-column: 20 / -1; grid-row: 4; }

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
.region-name { width: 56px; flex-shrink: 0; color: rgba(208,216,232,0.7); font-size: $font-size-xs; }
.region-bar-bg { flex: 1; height: 6px; background: rgba(0,180,216,0.06); border-radius: 3px; overflow: hidden; }
.region-bar-fill { height: 100%; background: linear-gradient(90deg, $color-primary, $color-secondary); border-radius: 3px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); min-width: 2px; }
.region-visits { font-family: $font-mono; font-size: $font-size-xs; color: rgba(0,180,216,0.7); flex-shrink: 0; }
.region-change { font-size: 10px; flex-shrink: 0;
  &.up { color: $color-accent2; }
  &.down { color: $color-danger; }
}

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
.bottom-pause-btn {
  background: rgba(var(--color-primary-rgb, 0,180,216), 0.1);
  border: 1px solid var(--glass-border);
  color: var(--color-primary);
  border-radius: 3px; width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 10px;
  &:hover { background: rgba(var(--color-primary-rgb, 0,180,216), 0.2); }
}
.bottom-center { flex: 1; overflow: hidden; }
.bottom-right { display: flex; gap: 20px; flex-shrink: 0; }
.bottom-stat { display: flex; align-items: center; gap: 6px; }
.bs-label { color: rgba(208,216,232,0.4); font-size: $font-size-xs; }
.bs-value { font-family: $font-mono; font-size: $font-size-sm; color: $color-tertiary;
  &.up { color: $color-jade; }
  &.down { color: $color-danger; }
}

// ====== RANK MOVE ANIMATION ======
.rank-move-enter-active, .rank-move-leave-active { transition: all 0.5s ease; }
.rank-move-enter-from { opacity: 0; transform: translateX(-20px); }
.rank-move-leave-to { opacity: 0; transform: translateX(20px); }
.rank-move-move { transition: transform 0.5s ease; }

// ====== ALERT MODAL ======
.alert-modal-overlay {
  position: fixed; inset: 0; z-index: 10001;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}
.alert-modal {
  width: 420px; background: var(--bg-dark); border: 1px solid var(--glass-border);
  border-radius: 8px; box-shadow: 0 16px 48px rgba(0,0,0,0.6);
}
.am-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid var(--glass-border);
}
.am-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.am-close {
  width: 28px; height: 28px; border: 1px solid var(--glass-border); border-radius: 4px;
  background: transparent; color: var(--text-secondary); cursor: pointer;
  &:hover { border-color: var(--color-danger); color: var(--color-danger); }
}
.am-body { padding: 20px; }
.am-level {
  display: inline-block; padding: 4px 12px; border-radius: 3px; font-size: 12px; font-weight: 600; letter-spacing: 1px; margin-bottom: 12px;
  &.level-danger { background: rgba(224,80,80,0.15); color: $color-danger; border: 1px solid rgba(224,80,80,0.3); }
  &.level-warning { background: rgba(240,160,64,0.15); color: $color-warning; border: 1px solid rgba(240,160,64,0.3); }
  &.level-info { background: rgba(0,180,216,0.1); color: $color-primary; border: 1px solid rgba(0,180,216,0.3); }
}
.am-msg { font-size: 14px; color: var(--text-primary); line-height: 1.6; margin-bottom: 12px; }
.am-time { font-size: 12px; color: var(--text-muted); }

// ====== TRANSITIONS ======
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
