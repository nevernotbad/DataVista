import type { DashboardData } from '@/types/dashboard';
import type { IDataSource } from '@/adapters/IDataSource';
import { MockDataSource } from '@/adapters/MockDataSource';
import { createLogger } from '@/services/logger';
const logger = createLogger('DashboardService');
let dataSource: IDataSource<DashboardData> = new MockDataSource();
export function setDataSource(source: IDataSource<DashboardData>) { dataSource = source; logger.info('DataSource updated'); }
export async function fetchDashboardData(): Promise<DashboardData> { return dataSource.fetchData(); }