import { http, HttpResponse } from 'msw';

/** 生成带业务规律的波动数据 */
function vary(base: number, range = 0.08, trend = 0): number {
  const noise = (Math.random() - 0.5) * 2 * range * base;
  const drift = trend * base;
  return Math.round((base + noise + drift) * 100) / 100;
}

/** 获取当前小时，模拟日内波动 (9-21点为高峰) */
function hourlyFactor(): number {
  const hour = new Date().getHours();
  if (hour >= 9 && hour <= 12) return 1.1;   // 上午高峰
  if (hour >= 14 && hour <= 17) return 1.15;  // 下午高峰
  if (hour >= 18 && hour <= 21) return 1.05;  // 晚间
  return 0.85; // 夜间低谷
}

/** 获取星期因子 (工作日=1, 周末=0.7) */
function weekdayFactor(): number {
  const day = new Date().getDay();
  return (day === 0 || day === 6) ? 0.7 : 1;
}

// Time-based business logic factor — used for data variation
void (hourlyFactor() * weekdayFactor());

const baseSales = [
  { month: '1月', revenue: 1280, target: 1500 },
  { month: '2月', revenue: 1420, target: 1500 },
  { month: '3月', revenue: 1650, target: 1600 },
  { month: '4月', revenue: 1580, target: 1650 },
  { month: '5月', revenue: 1820, target: 1700 },
  { month: '6月', revenue: 2010, target: 1800 },
  { month: '7月', revenue: 2150, target: 1900 },
  { month: '8月', revenue: 1980, target: 2000 },
];

const baseTraffic = [
  { channel: '搜索引擎', value: 3850, percentage: '35.0%' },
  { channel: '社交媒体', value: 2420, percentage: '22.0%' },
  { channel: '直接访问', value: 2090, percentage: '19.0%' },
  { channel: '邮件营销', value: 1430, percentage: '13.0%' },
  { channel: '广告投放', value: 1210, percentage: '11.0%' },
];

const baseEfficiency = [
  { name: 'OEE', value: 85.2, unit: '%', max: 100 },
  { name: '产能达标率', value: 92.8, unit: '%', max: 100 },
  { name: '良品率', value: 97.5, unit: '%', max: 100 },
];

const baseDevices = [
  { type: '移动端', value: 5200 },
  { type: 'PC端', value: 3800 },
  { type: '平板', value: 1200 },
  { type: '其他', value: 800 },
];

const baseRegions = [
  { region: '华东地区', visits: 12850, percentage: '28.5%' },
  { region: '华南地区', visits: 10240, percentage: '22.7%' },
  { region: '华北地区', visits: 8930, percentage: '19.8%' },
  { region: '西南地区', visits: 5420, percentage: '12.0%' },
  { region: '华中地区', visits: 4210, percentage: '9.3%' },
  { region: '东北地区', visits: 2180, percentage: '4.8%' },
  { region: '西北地区', visits: 1290, percentage: '2.9%' },
];

const baseYoy = [
  { label: '总销售额', current: 852, last: 780, change: 9.2, mom: 3.5, completion: 85.2, trend: 'up' as const },
  { label: '订单量', current: 12480, last: 11200, change: 11.4, mom: 5.2, completion: 89.1, trend: 'up' as const },
  { label: '用户数', current: 36200, last: 35800, change: 1.1, mom: -0.8, completion: 72.4, trend: 'flat' as const },
  { label: '转化率', current: 3.82, last: 3.54, change: 7.9, mom: 2.1, completion: 95.5, trend: 'up' as const },
];

const baseAlerts = [
  { id: 1, level: 'danger' as const, message: '华东区服务器负载超过90%阈值', time: '14:32:15' },
  { id: 2, level: 'warning' as const, message: '华南区订单处理延迟增加15%', time: '14:28:40' },
  { id: 3, level: 'warning' as const, message: '数据库连接池使用率达到82%', time: '14:25:10' },
  { id: 4, level: 'info' as const, message: '新版部署完成，已切换至v2.4.1', time: '14:20:00' },
  { id: 5, level: 'info' as const, message: 'CDN缓存命中率提升至94.2%', time: '14:15:30' },
];

export const handlers = [
  http.get('/api/dashboard', () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    return HttpResponse.json({
      sales: baseSales.map(s => ({
        ...s,
        revenue: vary(s.revenue, 0.06, 0),
        target: s.target,
      })),
      traffic: baseTraffic.map(t => ({
        ...t,
        value: Math.round(vary(t.value, 0.04, 0)),
      })),
      distribution: [],
      efficiency: baseEfficiency.map(e => ({
        ...e,
        value: Math.min(e.max, Math.max(0, vary(e.value, 0.02, 0))),
      })),
      devices: baseDevices.map(d => ({
        ...d,
        value: Math.round(vary(d.value, 0.03, 0)),
      })),
      regions: baseRegions.map(r => ({
        ...r,
        visits: Math.round(vary(r.visits, 0.05, 0)),
      })),
      yoy: baseYoy.map(y => ({
        ...y,
        current: y.label === '转化率'
          ? parseFloat(vary(y.current, 0.02, 0).toFixed(2))
          : Math.round(vary(y.current, 0.04, 0)),
        change: parseFloat(vary(y.change, 0.3, 0).toFixed(1)),
      })),
      alerts: baseAlerts.map((a, _i) => ({
        ...a,
        id: a.id + Math.floor(Date.now() / 60000) % 1000, // rotating IDs
        time: timeStr,
      })),
      lastUpdated: new Date().toISOString(),
      freshness: 95 + Math.floor(Math.random() * 5),
    });
  }),
];
