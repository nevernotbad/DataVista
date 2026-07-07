import type { IDataSource } from './IDataSource';
import type { DashboardData } from '@/types/dashboard';
import { createLogger } from '@/services/logger';
import axios from 'axios';
const logger = createLogger('MockDataSource');
export class MockDataSource implements IDataSource<DashboardData> {
  async fetchData(): Promise<DashboardData> {
    logger.info('Fetching mock dashboard data...');
    const { data } = await axios.get<DashboardData>('/api/dashboard');
    logger.info('Mock data fetched');
    return data;
  }
}