/** 月度销售额 */
export interface SalesData { month: string; revenue: number; target: number; }

/** 流量渠道 */
export interface TrafficData { channel: string; value: number; percentage: string; }

/** 品类 / 设备分布 */
export interface DistributionData { name: string; value: number; }

/** 效率指标 */
export interface EfficiencyData { name: string; value: number; unit: string; max: number; }

/** 设备类型 */
export interface DeviceData { type: string; value: number; }

/** 区域排行 */
export interface RegionData { region: string; visits: number; percentage: string; }

/** 同比环比 */
export interface YoYData { label: string; current: number; last: number; change: number; }

/** 告警 */
export interface AlertData { id: number; level: 'warning' | 'danger' | 'info'; message: string; time: string; }

/** 仪表盘聚合数据 */
export interface DashboardData {
  sales: SalesData[];
  traffic: TrafficData[];
  distribution: DistributionData[];
  efficiency: EfficiencyData[];
  devices: DeviceData[];
  regions: RegionData[];
  yoy: YoYData[];
  alerts: AlertData[];
}
