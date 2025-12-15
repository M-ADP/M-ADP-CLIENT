import type { ChartData } from '@/types/chart';

// 프로젝트 통계 라인 차트 데이터 (이미지 기반)
export const projectStatsChartData: ChartData = {
  labels: Array.from({ length: 12 }, (_, i) => `${i + 1}월`),
  datasets: [
    {
      label: 'DAU',
      data: [15, 12, 17, 20, 16, 18, 15, 20, 18, 22, 16, 19],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
    },
    {
      label: 'WAU',
      data: [8, 5, 12, 24, 18, 12, 20, 8, 15, 2, 18, 17],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
    },
    {
      label: 'MAU',
      data: [10, 11, 20, 18, 16, 14, 10, 16, 14, 26, 3, 5],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
  ],
};

// 트래픽 통계 에어리어 차트 데이터
export const trafficStatsData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Traffic',
      data: [200, 300, 250, 400, 350, 500, 450, 600, 550, 700, 650, 800],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Requests',
      data: [150, 250, 200, 350, 300, 450, 400, 550, 500, 650, 600, 750],
      borderColor: '#1d4ed8',
      backgroundColor: 'rgba(29, 78, 216, 0.2)',
      fill: true,
      tension: 0.4,
    },
  ],
};

// 바 차트 데이터
export const barChartData: ChartData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Sales',
      data: [65, 59, 80, 81],
      backgroundColor: 'rgba(34, 197, 94, 0.7)',
      borderColor: '#22c55e',
    },
    {
      label: 'Revenue',
      data: [28, 48, 40, 79],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: '#3b82f6',
    },
  ],
};

// 도넛 차트 데이터
export const doughnutChartData: ChartData = {
  labels: ['Desktop', 'Mobile', 'Tablet'],
  datasets: [
    {
      data: [55, 35, 10],
      backgroundColor: [
        '#22c55e',
        '#3b82f6',
        '#f59e0b',
      ],
      borderColor: [
        '#16a34a',
        '#2563eb',
        '#d97706',
      ],
    },
  ],
};