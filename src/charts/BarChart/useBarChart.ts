import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { SalesData } from '@/types/dashboard';

function getThemeColors() {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  return {
    primary: style.getPropertyValue('--color-primary').trim() || '#00b4d8',
    secondary: style.getPropertyValue('--color-secondary').trim() || '#48cae4',
    accent: style.getPropertyValue('--color-accent').trim() || '#c9a96e',
    accent2: style.getPropertyValue('--color-accent2').trim() || '#7ec8a0',
    textPrimary: style.getPropertyValue('--text-primary').trim() || '#d0d8e8',
    textMuted: style.getPropertyValue('--text-muted').trim() || 'rgba(208,216,232,0.5)',
    glassBorder: style.getPropertyValue('--glass-border').trim() || 'rgba(0,180,216,0.3)',
  };
}

export function useBarChart(data: () => SalesData[]) {
  const chartRef = ref<HTMLElement>();
  let instance: echarts.ECharts | null = null;

  function init() {
    if (!chartRef.value) return;
    instance = echarts.init(chartRef.value);
    update();
    window.addEventListener('resize', () => instance?.resize());
  }

  function getOption() {
    const d = data();
    const c = getThemeColors();
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10,22,40,0.92)',
        borderColor: c.glassBorder,
        textStyle: { color: c.textPrimary, fontSize: 12 },
      },
      legend: {
        data: ['销售额', '目标'],
        right: 8, top: 2,
        textStyle: { color: c.textMuted, fontSize: 11 },
        itemWidth: 10, itemHeight: 6,
      },
      toolbox: {
        feature: {
          saveAsImage: { title: '保存图片', pixelRatio: 2 },
        },
        right: 40, top: 0,
        iconStyle: { borderColor: c.textMuted },
      },
      grid: { left: '3%', right: '5%', bottom: '3%', top: 32, containLabel: true },
      xAxis: {
        type: 'category', data: d.map(v => v.month),
        axisLine: { lineStyle: { color: c.glassBorder } },
        axisTick: { show: false },
        axisLabel: { color: c.textMuted, fontSize: 10 },
      },
      yAxis: {
        type: 'value', name: '万元',
        nameTextStyle: { color: c.textMuted, fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(0,180,216,0.06)' } },
        axisLabel: { color: c.textMuted, fontSize: 10 },
      },
      series: [
        {
          name: '销售额', type: 'bar',
          data: d.map(v => ({
            value: v.revenue,
            itemStyle: { borderRadius: [4, 4, 0, 0] },
          })),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: c.primary },
              { offset: 0.6, color: c.secondary },
              { offset: 1, color: c.primary + '1a' },
            ]),
          },
          barWidth: 22,
          emphasis: { itemStyle: { shadowBlur: 12, shadowColor: c.primary + '99' } },
          animationDuration: 1200, animationEasing: 'cubicOut',
        },
        {
          name: '目标', type: 'bar',
          data: d.map(v => v.target),
          itemStyle: {
            color: 'transparent',
            borderColor: c.accent + '80',
            borderWidth: 1.5,
            borderType: 'dashed',
            borderRadius: [4, 4, 0, 0],
          },
          barWidth: 22, barGap: '25%',
          animationDuration: 1200,
        },
      ],
    };
  }

  function update() {
    if (!instance) return;
    instance.setOption(getOption()); // merge mode: animate between old & new data
  }

  onMounted(init);
  onUnmounted(() => { instance?.dispose(); });
  watch(data, update, { deep: true });

  const themeObserver = new MutationObserver(() => { instance?.setOption(getOption(), true); });
  onMounted(() => {
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
  });
  onUnmounted(() => themeObserver.disconnect());

  return { chartRef };
}
