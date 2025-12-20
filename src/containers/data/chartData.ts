import type { ChartData } from '@/types/chart';
import { status, primary } from '@/styles/colors';

// 프로젝트 통계 라인 차트 데이터 (이미지 기반)
export const projectStatsChartData: ChartData = {
  labels: Array.from({ length: 12 }, (_, i) => `${i + 1}월`),
  datasets: [
    {
      label: 'DAU',
      data: [15, 12, 17, 20, 16, 18, 15, 20, 18, 22, 16, 19],
      borderColor: status.success,
      backgroundColor: status.success + '20', // 20% opacity
      tension: 0.4,
    },
    {
      label: 'WAU',
      data: [8, 5, 12, 24, 18, 12, 20, 8, 15, 2, 18, 17],
      borderColor: status.error,
      backgroundColor: status.error + '20', // 20% opacity
      tension: 0.4,
    },
    {
      label: 'MAU',
      data: [10, 11, 20, 18, 16, 14, 10, 16, 14, 26, 3, 5],
      borderColor: status.info,
      backgroundColor: status.info + '20', // 20% opacity
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
      borderColor: status.info,
      backgroundColor: status.info + '30', // 30% opacity
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Requests',
      data: [150, 250, 200, 350, 300, 450, 400, 550, 500, 650, 600, 750],
      borderColor: primary.default,
      backgroundColor: primary.default + '30', // 30% opacity
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
      backgroundColor: status.success + 'B3', // 70% opacity
      borderColor: status.success,
    },
    {
      label: 'Revenue',
      data: [28, 48, 40, 79],
      backgroundColor: status.info + 'B3', // 70% opacity
      borderColor: status.info,
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
        status.success,
        status.info,
        status.warning,
      ],
      borderColor: [
        status.success,
        status.info,
        status.warning,
      ],
    },
  ],
};