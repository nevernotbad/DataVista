import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

interface RadarItem {
  name: string;
  value: number;
}

/**
 * Read a CSS custom property from document.documentElement.
 * Returns the trimmed value, or the provided fallback if empty/missing.
 */
function readCssVar(name: string, fallback: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const trimmed = raw.trim();
  return trimmed || fallback;
}

/**
 * Gather theme-relevant colors from CSS custom properties at call time.
 * Because themes set these properties on :root, reading them each time
 * update() runs ensures the chart reflects the active theme.
 */
function getThemeColors() {
  return {
    primary: readCssVar('--color-primary', '#00b4d8'),
    secondary: readCssVar('--color-secondary', '#48cae4'),
    tertiary: readCssVar('--color-tertiary', '#90e0ef'),
    accent: readCssVar('--color-accent', '#c9a96e'),
    textPrimary: readCssVar('--text-primary', '#d0d8e8'),
    textSecondary: readCssVar('--text-secondary', 'rgba(208,216,232,0.7)'),
    textMuted: readCssVar('--text-muted', 'rgba(208,216,232,0.4)'),
    glassBorder: readCssVar('--glass-border', 'rgba(0,180,216,0.2)'),
  };
}

export function useRadarChart(data: () => RadarItem[]) {
  const chartRef = ref<HTMLElement>();
  let instance: echarts.ECharts | null = null;

  function onResize() {
    instance?.resize();
  }

  function init() {
    if (!chartRef.value) return;
    instance = echarts.init(chartRef.value);
    update();
    window.addEventListener('resize', onResize);
  }

  function update() {
    if (!instance) return;
    const d = data();
    if (!d || d.length === 0) {
      instance.clear();
      return;
    }

    const colors = getThemeColors();

    // Auto-calculate max value: highest data value + 20 % headroom
    const dataMax = Math.max(...d.map((item) => item.value));
    const max = Math.ceil(dataMax * 1.2);

    instance.setOption(
      {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(10,22,40,0.92)',
          borderColor: colors.glassBorder,
          textStyle: { color: colors.textPrimary, fontSize: 12 },
        },
        radar: {
          center: ['50%', '52%'],
          radius: '65%',
          shape: 'circle',
          indicator: d.map((item) => ({
            name: item.name,
            max,
          })),
          axisName: {
            color: colors.textSecondary,
            fontSize: 11,
            borderRadius: 3,
            padding: [3, 5],
          },
          splitArea: {
            areaStyle: {
              color: [
                'rgba(0,180,216,0.02)',
                'rgba(0,180,216,0.02)',
              ],
            },
          },
          splitLine: {
            lineStyle: {
              color: colors.glassBorder,
            },
          },
          axisLine: {
            lineStyle: {
              color: colors.glassBorder,
            },
          },
        },
        series: [
          {
            type: 'radar',
            data: [
              {
                value: d.map((item) => item.value),
                name: '指标',
                areaStyle: {
                  // Semi-transparent primary fill (hex alpha suffix ≈ 20 %)
                  color: colors.primary + '33',
                },
                lineStyle: {
                  color: colors.primary,
                  width: 2,
                },
                itemStyle: {
                  color: colors.primary,
                },
              },
            ],
            symbol: 'circle',
            symbolSize: 6,
            animationDuration: 1200,
            animationEasing: 'cubicOut',
          },
        ],
      },
      { notMerge: true },
    );
  }

  onMounted(init);
  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
    instance?.dispose();
    instance = null;
  });
  watch(data, update, { deep: true });

  return { chartRef };
}
