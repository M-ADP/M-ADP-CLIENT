export interface SummaryMetric {
  id: string;
  label: string;
  value: string;
  percentage: number;
  comingSoon?: boolean;
  helperText?: string;
}

export type NuriMetric = SummaryMetric;

export interface ResourceAllocationItem {
  cpu: number;
  memory: { current: number; max: number };
  disk: { current: number; max: number };
  instance: { current: number; max: number };
}

export interface ProjectResource {
  id: string;
  name: string;
  allocation: ResourceAllocationItem;
}

export interface DashboardData {
  userName: string;
  summaryMetrics: SummaryMetric[];
  projectResources: ProjectResource[];
}
