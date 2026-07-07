import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { EfficiencyData } from '@/types/dashboard';

export function useGaugeChart(data: () => EfficiencyData[]) {
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
    const series = d.map((item, i) => ({
      type: 'gauge' as const,
      startAngle: 210, endAngle: -30,
      center: [`${20 + i * 30}%`, '55%'],
      radius: '60%',
      min: 0, max: item.max,
      axisLine: { lineStyle: { width: 8, color: [[item.value / item.max, '#00d4ff'], [1, 'rgba(0,212,255,0.15)']] } },
      pointer: { length: '60%', width: 4, itemStyle: { color: '#00d4ff' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: { valueAnimation: true, fontSize: 14, color: '#e0e6f0', offsetCenter: [0, '70%'], formatter: `{value}${item.unit}` },
      title: { offsetCenter: [0, '95%'], fontSize: 10, color: '#e0e6f0' },
      data: [{ value: item.value, name: item.name }],
      animationDuration: 1200
    }));

    instance.setOption({ series });
  }

  onMounted(initChart);
  onUnmounted(() => { instance?.dispose(); });
  watch(data, updateChart, { deep: true });
  return { chartRef };
}
