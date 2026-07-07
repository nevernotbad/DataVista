export interface SalesData { month: string; revenue: number; target: number; }
export interface TrafficData { channel: string; value: number; percentage: string; }
export interface DistributionData { name: string; value: number; }
export interface EfficiencyData { name: string; value: number; unit: string; max: number; }
export interface DashboardData {
  sales: SalesData[];
  traffic: TrafficData[];
  distribution: DistributionData[];
  efficiency: EfficiencyData[];
}
