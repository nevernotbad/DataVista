import type { IDataSource } from './IDataSource';
import type { DashboardData } from '@/types/dashboard';
import { createLogger } from '@/services/logger';
import axios from 'axios';
const logger = createLogger('ApiDataSource');
export class ApiDataSource implements IDataSource<DashboardData> {
  private baseUrl: string;
  constructor(baseUrl = '/api') { this.baseUrl = baseUrl; }
  async fetchData(): Promise<DashboardData> {
    logger.info('Fetching API data...');
    try {
      const { data } = await axios.get<DashboardData>(`${this.baseUrl}/dashboard`);
      return data;
    } catch (err) { logger.error('API fetch failed', err); throw err; }
  }
}