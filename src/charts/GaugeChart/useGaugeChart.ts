import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { EfficiencyData } from '@/types/dashboard';

export function useGaugeChart(data: () => EfficiencyData[]) {
  const chartRef = ref<HTMLElement>();
  let instance: echarts.ECharts | null = null;

  function init() {
    if (!chartRef.value) return;
    instance = echarts.init(chartRef.value);
    update();
    window.addEventListener('resize', () => instance?.resize());
  }

  function update() {
    if (!instance) return;
    const d = data();
    const first3 = d.slice(0, 3);
    const series = first3.map((item, i) => ({
      type: 'gauge' as const,
      startAngle: 210, endAngle: -30,
      center: [`${25 + i * 25}%`, '58%'],
      radius: '68%',
      min: 0, max: item.max,
      axisLine: { lineStyle: { width: 6, color: [[item.value / item.max, '#00b4d8'], [1, 'rgba(0,180,216,0.08)']] } },
      pointer: { length: '55%', width: 3, itemStyle: { color: '#00b4d8' } },
      axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
      detail: { valueAnimation: true, fontSize: 13, fontFamily: "'JetBrains Mono',monospace", color: '#d0d8e8', offsetCenter: [0, '75%'], formatter: `{value}${item.unit}` },
      title: { offsetCenter: [0, '100%'], fontSize: 9, color: 'rgba(208,216,232,0.6)' },
      data: [{ value: item.value, name: item.name }],
      animationDuration: 1500, animationEasing: 'cubicOut',
    }));

    instance.setOption({ series });
  }

  onMounted(init);
  onUnmounted(() => { instance?.dispose(); });
  watch(data, update, { deep: true });
  return { chartRef };
}
