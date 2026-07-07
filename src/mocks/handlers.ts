import { http, HttpResponse } from 'msw';
import salesData from './data/sales.json';
import trafficData from './data/traffic.json';
import distributionData from './data/distribution.json';
import efficiencyData from './data/efficiency.json';
import devicesData from './data/devices.json';
import regionsData from './data/regions.json';
import yoyData from './data/yoy.json';
import alertsData from './data/alerts.json';

export const handlers = [
  http.get('/api/dashboard', () => {
    return HttpResponse.json({
      sales: salesData,
      traffic: trafficData,
      distribution: distributionData,
      efficiency: efficiencyData,
      devices: devicesData,
      regions: regionsData,
      yoy: yoyData,
      alerts: alertsData,
    });
  }),
];
