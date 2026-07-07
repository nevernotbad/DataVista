/**
 * ECharts 图表配置生成器
 * 根据当前主题动态生成图表配置，实现主题联动
 */
import type { ThemeColors } from '@/themes';

export interface ChartThemeContext {
  theme: ThemeColors;
  isDark: boolean;
}

/** 从 ThemeColors 生成 ECharts 颜色序列 */
export function getChartColors(theme: ThemeColors): string[] {
  return [
    theme.colorPrimary,
    theme.colorSecondary,
    theme.colorTertiary,
    theme.colorAccent,
    theme.colorAccent2,
    theme.colorPrimary + '99',
    theme.colorSecondary + '99',
  ];
}

/** 通用 tooltip 配置 */
export function getTooltipConfig(theme: ThemeColors) {
  return {
    backgroundColor: 'rgba(10,22,40,0.92)',
    borderColor: theme.glassBorder,
    textStyle: { color: theme.textPrimary, fontSize: 12 },
    extraCssText: `box-shadow: 0 4px 16px rgba(0,0,0,0.5); border-radius: 4px;`,
  };
}

/** 通用坐标轴配置 */
export function getAxisConfig(theme: ThemeColors) {
  return {
    axisLine: { lineStyle: { color: theme.glassBorder } },
    axisTick: { show: false },
    axisLabel: { color: theme.textMuted, fontSize: 10 },
    splitLine: { lineStyle: { color: theme.glassBorder.replace('0.2', '0.06') } },
  };
}

/** 通用网格配置 */
export function getGridConfig(extra: Record<string, unknown> = {}) {
  return {
    left: '3%', right: '5%', bottom: '3%', top: 12,
    containLabel: true,
    ...extra,
  };
}

/** 标题文字样式 */
export function getTitleStyle(theme: ThemeColors) {
  return {
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: 600,
  };
}
