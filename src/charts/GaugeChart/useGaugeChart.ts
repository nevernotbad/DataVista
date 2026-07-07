import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { EfficiencyData } from '@/types/dashboard';

function getThemeColors() {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  return {
    primary: style.getPropertyValue('--color-primary').trim() || '#00b4d8',
    accent: style.getPropertyValue('--color-accent').trim() || '#c9a96e',
    accent2: style.getPropertyValue('--color-accent2').trim() || '#7ec8a0',
    textPrimary: style.getPropertyValue('--text-primary').trim() || '#d0d8e8',
    textMuted: style.getPropertyValue('--text-muted').trim() || 'rgba(208,216,232,0.6)',
  };
}

export function useGaugeChart(data: () => EfficiencyData[]) {
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
    const first3 = d.slice(0, 3);
    const colors = [c.primary, c.accent, c.accent2];

    const series = first3.map((item, i) => ({
      type: 'gauge' as const,
      startAngle: 210, endAngle: -30,
      center: [`${25 + i * 25}%`, '58%'],
      radius: '68%',
      min: 0, max: item.max,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [[item.value / item.max, colors[i]], [1, colors[i] + '14']],
        },
      },
      pointer: { length: '55%', width: 3, itemStyle: { color: colors[i] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 13,
        fontFamily: "'JetBrains Mono', monospace",
        color: c.textPrimary,
        offsetCenter: [0, '75%'],
        formatter: `{value}${item.unit}`,
      },
      title: {
        offsetCenter: [0, '100%'],
        fontSize: 9,
        color: c.textMuted,
      },
      data: [{ value: item.value, name: item.name }],
      animationDuration: 1500,
      animationEasing: 'cubicOut',
      progress: { show: true, width: 6, itemStyle: { color: colors[i] } },
    }));

    return { series };
  }

  function update() {
    if (!instance) return;
    instance.setOption(getOption()); // merge mode: animate gauge pointer smoothly
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
