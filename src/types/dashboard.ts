export interface NuriMetric {
  id: string;
  label: string;
  value: string;
  percentage: number;
}

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
  nuriSummary: NuriMetric[];
  projectResources: ProjectResource[];
}
