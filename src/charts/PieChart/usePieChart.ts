import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { TrafficData, DeviceData } from '@/types/dashboard';

function getThemeColors() {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  return {
    primary: style.getPropertyValue('--color-primary').trim() || '#00b4d8',
    secondary: style.getPropertyValue('--color-secondary').trim() || '#48cae4',
    tertiary: style.getPropertyValue('--color-tertiary').trim() || '#90e0ef',
    accent: style.getPropertyValue('--color-accent').trim() || '#c9a96e',
    accent2: style.getPropertyValue('--color-accent2').trim() || '#7ec8a0',
    textPrimary: style.getPropertyValue('--text-primary').trim() || '#d0d8e8',
    glassBorder: style.getPropertyValue('--glass-border').trim() || 'rgba(0,180,216,0.3)',
    bgDark: style.getPropertyValue('--bg-dark').trim() || '#0a1628',
  };
}

export function usePieChart(data: () => TrafficData[] | DeviceData[]) {
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
    const pieData = d.map(v => ({
      name: 'channel' in v ? v.channel : v.type,
      value: v.value,
    }));

    const colors = [c.primary, c.secondary, c.tertiary, c.accent, c.accent2, '#6c8cd9', '#a08cd9'];

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(10,22,40,0.92)',
        borderColor: c.glassBorder,
        textStyle: { color: c.textPrimary, fontSize: 12 },
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 2, top: 'center',
        textStyle: { color: c.textPrimary, fontSize: 10 },
        itemWidth: 8, itemHeight: 8,
      },
      series: [{
        type: 'pie',
        radius: ['55%', '78%'],
        center: ['42%', '52%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold', color: c.textPrimary },
          scaleSize: 8,
        },
        data: pieData,
        itemStyle: { borderRadius: 4, borderColor: c.bgDark, borderWidth: 3 },
        animationDuration: 1200, animationEasing: 'cubicOut',
      }],
      color: colors,
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
