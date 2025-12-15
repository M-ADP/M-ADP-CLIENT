import type { ChartData } from '@/types/chart';

// 프로젝트 통계 라인 차트 데이터
export const projectStatsData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'DAU',
      data: [15, 25, 18, 30, 22, 35, 28, 40, 32, 45, 38, 50],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
    },
    {
      label: 'WAU',
      data: [20, 35, 25, 40, 30, 45, 38, 50, 42, 55, 48, 60],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
    {
      label: 'MAU',
      data: [10, 20, 15, 25, 18, 30, 22, 35, 28, 40, 32, 45],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
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