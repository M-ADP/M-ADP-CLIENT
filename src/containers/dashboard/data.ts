import { DashboardData } from '@/types/dashboard';
import { ChartData } from 'chart.js';

export const mockDashboardData: DashboardData = {
  userName: '류승찬',
  nuriSummary: [
    { id: 'visitors', label: '방문자', value: '145 명', percentage: 70 },
    { id: 'cpu', label: 'CPU', value: '70%', percentage: 70 },
    { id: 'mem', label: 'MEM', value: '70%', percentage: 70 },
    { id: 'traffic', label: '트래픽', value: '145 명', percentage: 70 },
    { id: 'disk', label: 'DISK', value: '70%', percentage: 70 },
    { id: 'error_rate', label: '오류율', value: '70%', percentage: 70 },
  ],
  projectResources: [
    {
      id: 'm-adp',
      name: 'M-ADP 자원 할당량',
      allocation: {
        cpu: 70,
        memory: { current: 7.1, max: 10 },
        disk: { current: 23.1, max: 30 },
        instance: { current: 2, max: 5 },
      },
    },
    {
      id: 'favorite-sign',
      name: '최애의 사인 자원 할당량',
      allocation: {
        cpu: 70,
        memory: { current: 7.1, max: 10 },
        disk: { current: 23.1, max: 30 },
        instance: { current: 2, max: 5 },
      },
    },
    {
      id: 'remedy',
      name: 'RE:MEDY 자원 할당량',
      allocation: {
        cpu: 70,
        memory: { current: 7.1, max: 10 },
        disk: { current: 23.1, max: 30 },
        instance: { current: 2, max: 5 },
      },
    },
  ],
};

export const mockChartData: ChartData<'line'> = {
  labels: [
    '12:00', '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00', '21:00',
    '22:00', '23:00',
  ],
  datasets: [
    {
      label: 'CPU',
      data: [600, 200, 150, 250, 210, 250, 250, 200, 150, 100, 150, 100],
      borderColor: '#95E8FF',
      backgroundColor: 'rgba(149, 232, 255, 0.2)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'MEM',
      data: [180, 220, 200, 320, 360, 480, 420, 300, 350, 250, 400, 430],
      borderColor: '#030982',
      backgroundColor: 'rgba(3, 9, 130, 0.5)',
      fill: true,
      tension: 0.4,
    },
  ],
};
