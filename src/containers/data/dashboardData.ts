import type { ChartData, ChartOptions, ScriptableContext } from 'chart.js';
import { status, colors } from '@/styles/colors';

// 1. 최애의 사인 (Best Sign) - 게이지 차트
export const bestSignData: ChartData<'doughnut'> = {
  labels: ['Good', 'Remaining'],
  datasets: [
    {
      data: [75, 25],
      backgroundColor: (context: ScriptableContext<'doughnut'>) => {
        const ctx = context.chart.ctx;
        const index = context.dataIndex;
        if (index === 0) {
          const gradient = ctx.createLinearGradient(0, 0, 100, 0); // Horizontal gradient
          gradient.addColorStop(0, '#059669'); // Darker Green
          gradient.addColorStop(1, '#34d399'); // Lighter Green/Teal
          return gradient;
        }
        return '#1f2937'; // Dark Grey for Remaining
      },
      borderWidth: 0,
      circumference: 270,
      rotation: 225,
      cutout: '85%', // 두께 설정
      borderRadius: [
        { outerStart: 10, innerStart: 10, outerEnd: 0, innerEnd: 0 }, // 시작 부분 둥글게
        { outerStart: 0, innerStart: 0, outerEnd: 10, innerEnd: 10 }  // 끝 부분 둥글게
      ],
    },
  ],
};

// 2. 프로젝트 통계 (Project Stats) - 멀티 라인 차트
export const projectStatsData: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'DAU    98 733',
      data: [5000, 7000, 10000, 8000, 15000, 20000, 15000, 18000, 25000, 10000, 12000, 15000],
      borderColor: status.success, // 녹색
      backgroundColor: status.success,
      tension: 0, // 직선
      pointRadius: 0,
      borderWidth: 2,
    },
    {
      label: 'WAU    98 733',
      data: [3000, 5000, 8000, 12000, 18000, 22000, 12000, 15000, 10000, 5000, 18000, 18000],
      borderColor: status.error, // 빨간색
      backgroundColor: status.error,
      tension: 0,
      pointRadius: 0,
      borderWidth: 2,
    },
    {
      label: 'MAU    98 733',
      data: [8000, 10000, 15000, 10000, 12000, 15000, 18000, 15000, 25000, 5000, 8000, 10000],
      borderColor: status.info, // 파란색
      backgroundColor: status.info,
      tension: 0,
      pointRadius: 0,
      borderWidth: 2,
    },
  ],
};

// 3. 트래픽 통계 (Traffic Stats) - 영역 차트
export const trafficStatsData: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Total Traffic',
      data: [200, 450, 150, 250, 220, 400, 450, 350, 420, 250, 300, 350],
      borderColor: status.info, // 파란색
      backgroundColor: (context: ScriptableContext<'line'>) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // 투명도 있는 파란색
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
        return gradient;
      },
      fill: true,
      tension: 0.4, // 부드러운 곡선
      pointRadius: 0,
      borderWidth: 2,
    },
    {
      label: 'Unique Visitors',
      data: [100, 200, 120, 180, 250, 300, 280, 200, 150, 180, 220, 200],
      borderColor: '#60a5fa', // 연한 파란색
      backgroundColor: 'transparent',
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    },
  ],
};

// 4. 자원 사용량 (Resource Usage) - 라인 차트 옵션 및 데이터
export const resourceChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      display: false,
      grid: { display: false },
    },
    y: {
      display: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: '#a0aec0',
        font: { size: 10 },
        callback: (value) => {
          if (typeof value === 'number') {
            return value >= 1000 ? `${value / 1000}k` : value;
          }
          return value;
        },
        stepSize: 10000,
      },
      min: 0,
      max: 40000,
    },
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 100,
      hoverRadius: 6,
    },
    line: { borderWidth: 2, tension: 0 },
  },
};

const resourceLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const cpuData: ChartData<'line'> = {
  labels: resourceLabels,
  datasets: [{
    data: [25000, 15000, 20000, 21000, 35000, 30000, 38000, 23000, 20000, 8000],
    borderColor: '#00C2FF', // Cyan/Blue
    backgroundColor: 'transparent',
    tension: 0,
  }],
};

export const ramData: ChartData<'line'> = {
  labels: resourceLabels,
  datasets: [{
    data: [25000, 15000, 20000, 21000, 35000, 30000, 38000, 23000, 20000, 8000],
    borderColor: '#00C2FF',
    backgroundColor: 'transparent',
    tension: 0,
  }],
};

export const diskData: ChartData<'line'> = {
  labels: resourceLabels,
  datasets: [{
    data: [25000, 15000, 20000, 21000, 35000, 30000, 38000, 23000, 20000, 8000],
    borderColor: '#00C2FF',
    backgroundColor: 'transparent',
    tension: 0,
  }],
};

export const networkData: ChartData<'line'> = {
  labels: resourceLabels,
  datasets: [{
    data: [25000, 15000, 20000, 21000, 35000, 30000, 38000, 23000, 20000, 8000],
    borderColor: '#00C2FF',
    backgroundColor: 'transparent',
    tension: 0,
  }],
};
