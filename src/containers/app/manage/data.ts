import type { ChartData, ChartOptions } from 'chart.js';

export interface AppSummaryMetric {
  id: string;
  label: string;
  value: string;
}

export interface ResourceMetric {
  id: string;
  label: string;
  value: string;
  percent: number;
}

export interface UserStatLegend {
  id: string;
  label: string;
  color: string;
  value: string;
}

export const APP_NAME = 'Aemaehano';

export const summaryMetrics: AppSummaryMetric[] = [
  { id: 'visitors', label: '방문자', value: '145 명' },
  { id: 'language', label: '사용하는 언어', value: 'Python' },
  { id: 'port', label: '포트', value: '8000' },
  { id: 'resource', label: '자원 사용량', value: '양호' },
];

export const latestLogs: string[] = [
  '[2025-12-06 10:12:33] user_id=18374 action=login',
  '[2025-12-06 10:12:33] user_id=18374 action=login',
  '[2025-12-06 10:13:10] user_id=18374 action=view_page page=home',
  '[2025-12-06 10:12:33] user_id=18374 action=login',
  '[2025-12-06 10:12:33] user_id=18374 action=login',
  '[2025-12-06 10:12:33] user_id=18374 action=login',
  '[2025-12-06 10:12:33] user_id=18374 action=login',
  '[2025-12-06 10:12:33] user_id=18374 action=login',
  '[2025-12-06 10:12:33] user_id=18374 action=login',
  '[2025-12-06 10:12:33] user_id=18374 action=login',
  '[2025-12-06 10:12:33] user_id=18374 action=login',
  '[2025-12-06 10:12:33] user_id=18374 action=login',
];

export const userStatsLegend: UserStatLegend[] = [
  { id: 'dau', label: 'DAU', color: '#2D6CF7', value: '98 733' },
  { id: 'wau', label: 'WAU', color: '#00B6FF', value: '98 733' },
  { id: 'mau', label: 'MAU', color: '#131BA6', value: '98 733' },
];

export const resourceMetrics: ResourceMetric[] = [
  { id: 'cpu', label: 'CPU', value: '70%', percent: 70 },
  { id: 'mem', label: 'MEM', value: '7.1GB', percent: 71 },
  { id: 'disk', label: 'DISK', value: '23.1GB', percent: 63 },
  { id: 'instance', label: 'INSTANCE', value: '2', percent: 50 },
];

export const userStatsChartData: ChartData<'line'> = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [
    {
      label: 'DAU',
      data: [8000, 11000, 7000, 20000, 9000, 9000, 17000, 14000, 21000, 5000, 11000, 10000],
      borderColor: '#2D6CF7',
      backgroundColor: 'transparent',
      tension: 0,
      pointRadius: 0,
      borderWidth: 3,
    },
    {
      label: 'WAU',
      data: [3000, 0, 17000, 14000, 8000, 19000, 23000, 9000, 7000, 2000, 18000, 18000],
      borderColor: '#00B6FF',
      backgroundColor: 'transparent',
      tension: 0,
      pointRadius: 0,
      borderWidth: 3,
    },
    {
      label: 'MAU',
      data: [7000, 9000, 12000, 9000, 16000, 16000, 12000, 17000, 16000, 26000, 4000, 6000],
      borderColor: '#131BA6',
      backgroundColor: 'transparent',
      tension: 0,
      pointRadius: 0,
      borderWidth: 3,
    },
  ],
};

export const trafficChartData: ChartData<'line'> = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [
    {
      label: '트래픽',
      data: [190, 230, 220, 360, 370, 470, 390, 310, 370, 230, 410, 440],
      borderColor: '#151EA9',
      backgroundColor: 'rgba(27, 37, 175, 0.36)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 4,
    },
  ],
};

export const userStatsChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { display: false },
    },
    y: {
      min: 0,
      max: 40000,
      ticks: {
        stepSize: 10000,
        color: '#6B6B6B',
        callback: (value) => `${Number(value) / 1000}k`,
      },
      border: { display: false },
      grid: { color: 'rgba(43, 43, 43, 0.22)' },
    },
  },
  elements: {
    line: { borderCapStyle: 'round' },
  },
};

export const trafficChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        color: '#7E8798',
        font: { size: 11 },
      },
    },
    y: {
      min: 0,
      max: 500,
      ticks: {
        stepSize: 100,
        color: '#7E8798',
        font: { size: 11 },
      },
      border: { display: false },
      grid: {
        color: 'rgba(47, 58, 86, 0.36)',
      },
    },
  },
  elements: {
    line: {
      borderJoinStyle: 'round',
      capBezierPoints: true,
    },
  },
};
