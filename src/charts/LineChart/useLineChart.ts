import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { SalesData } from '@/types/dashboard';

export function useLineChart(data: () => SalesData[]) {
  const chartRef = ref<HTMLElement>();
  let instance: echarts.ECharts | null = null;

  function initChart() {
    if (!chartRef.value) return;
    instance = echarts.init(chartRef.value);
    updateChart();
    window.addEventListener('resize', () => instance?.resize());
  }

  function updateChart() {
    if (!instance) return;
    const d = data();
    instance.setOption({
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(6,30,60,0.9)', borderColor: '#00d4ff', textStyle: { color: '#e0e6f0' } },
      grid: { left: '3%', right: '4%', bottom: '3%', top: 20, containLabel: true },
      xAxis: { type: 'category', data: d.map(v => v.month), boundaryGap: false, axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } }, axisLabel: { color: '#e0e6f0' } },
      yAxis: { type: 'value', name: '万元', splitLine: { lineStyle: { color: 'rgba(0,212,255,0.1)' } }, axisLabel: { color: '#e0e6f0' } },
      series: [{
        name: '销售额趋势', type: 'line', data: d.map(v => v.revenue),
        smooth: true, symbol: 'circle', symbolSize: 8,
        lineStyle: { color: '#00d4ff', width: 3 },
        itemStyle: { color: '#00d4ff' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0,212,255,0.3)' }, { offset: 1, color: 'rgba(0,212,255,0.02)' }]) },
        animationDuration: 1500
      }]
    });
  }

  onMounted(initChart);
  onUnmounted(() => { instance?.dispose(); });
  watch(data, updateChart, { deep: true });
  return { chartRef };
}
