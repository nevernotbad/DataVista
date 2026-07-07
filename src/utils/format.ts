/**
 * 数字格式化工具
 * 统一处理千分位、小数位、单位等
 */

/** 格式化数字为带千分位的字符串 */
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** 格式化金额（万元） */
export function formatCurrency(value: number, unit = '万'): string {
  return `${formatNumber(value, 0)}${unit}`;
}

/** 格式化大数（自动选择合适的单位） */
export function formatLargeNumber(value: number): string {
  if (value >= 1_0000_0000) return `${(value / 1_0000_0000).toFixed(1)}亿`;
  if (value >= 1_0000) return `${(value / 1_0000).toFixed(1)}万`;
  if (value >= 1000) return formatNumber(value);
  return String(value);
}

/** 格式化百分比 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/** 格式化变化幅度（带箭头） */
export function formatChange(change: number): { text: string; trend: 'up' | 'down' | 'flat' } {
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  return { text: `${arrow} ${Math.abs(change).toFixed(1)}%`, trend };
}

/** 格式化运行时长 */
export function formatUptime(hours: number): string {
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const h = hours % 24;
  return h > 0 ? `${days}d ${h}h` : `${days}d`;
}

/** 格式化时间 */
export function formatTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/** 格式化日期时间 */
export function formatDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} 周${week} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
