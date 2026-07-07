import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { TrafficData } from '@/types/dashboard';

export function usePieChart(data: () => TrafficData[]) {
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
      tooltip: { trigger: 'item', backgroundColor: 'rgba(6,30,60,0.9)', borderColor: '#00d4ff', textStyle: { color: '#e0e6f0' },
        formatter: '{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', right: 5, top: 'center', textStyle: { color: '#e0e6f0', fontSize: 11 } },
      series: [{
        type: 'pie', radius: ['50%', '75%'], center: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        data: d.map(v => ({ name: v.channel, value: v.value })),
        itemStyle: { borderRadius: 4, borderColor: '#0a1a2e', borderWidth: 3 },
        animationDuration: 1000
      }],
      color: ['#00d4ff', '#4de8ff', '#00ff88', '#ffb800', '#ff6b9d', '#c084fc']
    });
  }

  onMounted(initChart);
  onUnmounted(() => { instance?.dispose(); });
  watch(data, updateChart, { deep: true });
  return { chartRef };
}
