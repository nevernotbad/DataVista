import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { SalesData } from '@/types/dashboard';

/** 读取当前主题色 */
function getThemeColors() {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  return {
    primary: style.getPropertyValue('--color-primary').trim() || '#00b4d8',
    secondary: style.getPropertyValue('--color-secondary').trim() || '#48cae4',
    accent: style.getPropertyValue('--color-accent').trim() || '#c9a96e',
    textPrimary: style.getPropertyValue('--text-primary').trim() || '#d0d8e8',
    textMuted: style.getPropertyValue('--text-muted').trim() || 'rgba(208,216,232,0.5)',
    glassBorder: style.getPropertyValue('--glass-border').trim() || 'rgba(0,180,216,0.3)',
    bgDark: style.getPropertyValue('--bg-dark').trim() || '#0a1628',
  };
}

export function useLineChart(data: () => SalesData[]) {
  const chartRef = ref<HTMLElement>();
  let instance: echarts.ECharts | null = null;

  function init() {
    if (!chartRef.value) return;
    instance = echarts.init(chartRef.value);
    update();
    window.addEventListener('resize', handleResize);
  }

  function handleResize() {
    instance?.resize();
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
        data: ['销售额'],
        right: 8, top: 2,
        textStyle: { color: c.textMuted, fontSize: 11 },
      },
      toolbox: {
        feature: {
          dataZoom: { title: { zoom: '区域缩放', back: '还原' } },
          restore: { title: '还原' },
          saveAsImage: { title: '保存图片', pixelRatio: 2 },
        },
        right: 40, top: 0,
        iconStyle: { borderColor: c.textMuted },
        emphasis: { iconStyle: { borderColor: c.primary } },
      },
      grid: { left: '3%', right: '5%', bottom: '3%', top: 40, containLabel: true },
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { type: 'slider', start: 0, end: 100, height: 16, bottom: 2,
          borderColor: c.glassBorder, backgroundColor: 'rgba(10,22,40,0.3)',
          fillerColor: `rgba(${hexToRgb(c.primary)},0.1)`,
          handleStyle: { color: c.primary },
          textStyle: { color: c.textMuted, fontSize: 9 },
        },
      ],
      xAxis: {
        type: 'category', data: d.map(v => v.month), boundaryGap: false,
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
      series: [{
        name: '销售额', type: 'line',
        data: d.map(v => v.revenue),
        smooth: true, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: c.primary, width: 2.5, shadowBlur: 8, shadowColor: c.primary + '66' },
        itemStyle: { color: c.primary, borderColor: '#fff', borderWidth: 1.5 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: c.primary + '40' },
            { offset: 1, color: c.primary + '03' },
          ]),
        },
        emphasis: { focus: 'series', itemStyle: { shadowBlur: 16, shadowColor: c.primary + '99' } },
        animationDuration: 1500, animationEasing: 'cubicOut',
        markLine: {
          silent: true,
          lineStyle: { color: c.accent, type: 'dashed', opacity: 0.5 },
          data: [{ type: 'average', name: '均值' }],
          label: { color: c.accent, fontSize: 10 },
        },
      }],
    };
  }

  function update() {
    if (!instance) return;
    instance.setOption(getOption()); // merge mode: ECharts animates between old & new data
  }

  onMounted(init);
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    instance?.dispose();
  });
  watch(data, update, { deep: true });

  // 监听主题变化重新渲染
  // 主题变化时完全重绘（清除动画状态）
  const themeObserver = new MutationObserver(() => { instance?.setOption(getOption(), true); });
  onMounted(() => {
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
  });
  onUnmounted(() => themeObserver.disconnect());

  return { chartRef };
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
