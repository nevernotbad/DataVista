import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { SalesData } from '@/types/dashboard';

export function useLineChart(data: () => SalesData[]) {
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
    instance.setOption({
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(10,22,40,0.92)', borderColor: 'rgba(0,180,216,0.3)', textStyle: { color: '#d0d8e8', fontSize: 12 } },
      grid: { left: '3%', right: '5%', bottom: '3%', top: 12, containLabel: true },
      xAxis: { type: 'category', data: d.map(v => v.month), boundaryGap: false, axisLine: { lineStyle: { color: 'rgba(0,180,216,0.15)' } }, axisTick: { show: false }, axisLabel: { color: 'rgba(208,216,232,0.5)', fontSize: 10 } },
      yAxis: { type: 'value', name: '万元', nameTextStyle: { color: 'rgba(208,216,232,0.4)', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(0,180,216,0.06)' } }, axisLabel: { color: 'rgba(208,216,232,0.5)', fontSize: 10 } },
      series: [{
        type: 'line', data: d.map(v => v.revenue), smooth: true, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: '#00b4d8', width: 2.5, shadowBlur: 8, shadowColor: 'rgba(0,180,216,0.4)' },
        itemStyle: { color: '#00b4d8', borderColor: '#fff', borderWidth: 1.5 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0,180,216,0.25)' }, { offset: 1, color: 'rgba(0,180,216,0.01)' }]) },
        emphasis: { focus: 'series', itemStyle: { shadowBlur: 16, shadowColor: 'rgba(0,180,216,0.6)' } },
        animationDuration: 1500, animationEasing: 'cubicOut',
      }],
    });
  }

  onMounted(init);
  onUnmounted(() => { instance?.dispose(); });
  watch(data, update, { deep: true });
  return { chartRef };
}
