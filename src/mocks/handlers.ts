import { http, HttpResponse } from 'msw';
import salesData from './data/sales.json';
import trafficData from './data/traffic.json';
import distributionData from './data/distribution.json';
import efficiencyData from './data/efficiency.json';

export const handlers = [
  http.get('/api/dashboard', () => {
    return HttpResponse.json({
      sales: salesData,
      traffic: trafficData,
      distribution: distributionData,
      efficiency: efficiencyData,
    });
  }),
];
