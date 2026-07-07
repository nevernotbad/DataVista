import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { SalesData } from '@/types/dashboard';

export function useBarChart(data: () => SalesData[]) {
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
      legend: { data: ['销售额', '目标'], right: 8, top: 2, textStyle: { color: 'rgba(208,216,232,0.7)', fontSize: 11 }, itemWidth: 10, itemHeight: 6 },
      grid: { left: '3%', right: '5%', bottom: '3%', top: 32, containLabel: true },
      xAxis: { type: 'category', data: d.map(v => v.month), axisLine: { lineStyle: { color: 'rgba(0,180,216,0.15)' } }, axisTick: { show: false }, axisLabel: { color: 'rgba(208,216,232,0.5)', fontSize: 10 } },
      yAxis: { type: 'value', name: '万元', nameTextStyle: { color: 'rgba(208,216,232,0.4)', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(0,180,216,0.06)' } }, axisLabel: { color: 'rgba(208,216,232,0.5)', fontSize: 10 } },
      series: [
        {
          name: '销售额', type: 'bar',
          data: d.map(v => ({ value: v.revenue, itemStyle: { borderRadius: [4, 4, 0, 0] } })),
          itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#00b4d8' }, { offset: 0.6, color: '#0077b6' }, { offset: 1, color: 'rgba(0,180,216,0.1)' }]) },
          barWidth: 22, emphasis: { itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,180,216,0.6)' } }, animationDuration: 1200, animationEasing: 'cubicOut',
        },
        {
          name: '目标', type: 'bar',
          data: d.map(v => v.target),
          itemStyle: { color: 'transparent', borderColor: 'rgba(201,169,110,0.5)', borderWidth: 1.5, borderType: 'dashed', borderRadius: [4, 4, 0, 0] },
          barWidth: 22, barGap: '25%', animationDuration: 1200,
        },
      ],
    });
  }

  onMounted(init);
  onUnmounted(() => { instance?.dispose(); });
  watch(data, update, { deep: true });
  return { chartRef };
}
