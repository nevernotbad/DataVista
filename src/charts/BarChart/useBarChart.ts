import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { SalesData } from '@/types/dashboard';

export function useBarChart(data: () => SalesData[]) {
  const chartRef = ref<HTMLElement>();
  let instance: echarts.ECharts | null = null;

  function initChart() {
    if (!chartRef.value) return;
    instance = echarts.init(chartRef.value);
    updateChart();
    window.addEventListener('resize', handleResize);
  }

  function updateChart() {
    if (!instance) return;
    const d = data();
    instance.setOption({
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(6,30,60,0.9)', borderColor: '#00d4ff', textStyle: { color: '#e0e6f0' } },
      legend: { data: ['销售额', '目标'], right: 10, textStyle: { color: '#e0e6f0' } },
      grid: { left: '3%', right: '4%', bottom: '3%', top: 40, containLabel: true },
      xAxis: { type: 'category', data: d.map(v => v.month), axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } }, axisLabel: { color: '#e0e6f0' } },
      yAxis: { type: 'value', name: '万元', splitLine: { lineStyle: { color: 'rgba(0,212,255,0.1)' } }, axisLabel: { color: '#e0e6f0' } },
      series: [
        { name: '销售额', type: 'bar', data: d.map(v => v.revenue), itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#00d4ff' }, { offset: 1, color: '#0099cc' }]) }, barWidth: 20, animationDuration: 1000 },
        { name: '目标', type: 'bar', data: d.map(v => v.target), itemStyle: { color: 'rgba(0,255,136,0.3)', borderColor: '#00ff88', borderWidth: 1, borderRadius: 2 }, barWidth: 20, barGap: '20%', animationDuration: 1000 }
      ]
    });
  }

  function handleResize() { instance?.resize(); }

  onMounted(() => { initChart(); });
  onUnmounted(() => { window.removeEventListener('resize', handleResize); instance?.dispose(); });

  watch(data, () => { updateChart(); }, { deep: true });

  return { chartRef };
}
