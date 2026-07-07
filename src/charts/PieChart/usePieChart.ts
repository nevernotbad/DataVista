import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { TrafficData, DeviceData } from '@/types/dashboard';

export function usePieChart(data: () => TrafficData[] | DeviceData[]) {
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
    const pieData = d.map(v => ({ name: 'channel' in v ? v.channel : v.type, value: v.value }));

    instance.setOption({
      tooltip: { trigger: 'item', backgroundColor: 'rgba(10,22,40,0.92)', borderColor: 'rgba(0,180,216,0.3)', textStyle: { color: '#d0d8e8', fontSize: 12 }, formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie', radius: ['55%', '78%'], center: ['50%', '52%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#e0e8f8' }, scaleSize: 8 },
        data: pieData,
        itemStyle: { borderRadius: 4, borderColor: '#0a1628', borderWidth: 3 },
        animationDuration: 1200, animationEasing: 'cubicOut',
      }],
      color: ['#00b4d8', '#48cae4', '#90e0ef', '#c9a96e', '#7ec8a0', '#6c8cd9', '#a08cd9'],
    });
  }

  onMounted(init);
  onUnmounted(() => { instance?.dispose(); });
  watch(data, update, { deep: true });
  return { chartRef };
}
