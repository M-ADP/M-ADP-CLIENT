// ===== UI / Form types =====
export interface Column {
  name: string;
  type: string;
  length?: string;
  primaryKey: boolean;
  notNull: boolean;
  autoIncrement: boolean;
  unique: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
}

export interface Database {
  id: string;
  name: string;
  type: string;
  tables: number;
  status: 'healthy' | 'unhealthy' | 'warning' | 'stopped';
}

export interface Table {
  id: string;
  name: string;
  columns: number;
}

export interface TableCreateData {
  tableName: string;
  columns: Column[];
}

// ===== API DTOs =====
export interface CloudDbContainerResponse {
  name: string;
  image: string;
}

export interface CloudDbPvc {
  name: string;
  size: string;
  mount_path: string;
  storage_class: string;
  phase: string;
}

export interface CloudDbStatus {
  replicas: number;
  ready_replicas: number;
  available_replicas: number;
  updated_replicas: number;
}

export interface CloudDbData {
  name: string;
  namespace: string;
  replicas: number;
  containers: CloudDbContainerResponse[];
  pvcs: CloudDbPvc[];
  labels: Record<string, string>;
  status: CloudDbStatus;
}

export interface CloudDbInner {
  message?: string;
  data: CloudDbData;
}

export interface CloudDbListResponse {
  message?: string;
  data: CloudDbInner[];
}

export interface CloudDbDetailResponse {
  message?: string;
  data: CloudDbInner;
}

// Create
export interface CreateCloudDbContainer {
  name: string;
  disk: { size: string };
  resources?: {
    requests?: { cpu: string; memory: string };
    limits?: { cpu: string; memory: string };
  };
}

export interface CreateCloudDbPayload {
  project_id: string;
  type: string;
  replicas?: number;
  containers: CreateCloudDbContainer[];
}

// Update
export interface UpdateCloudDbPayload {
  container_name: string;
  replicas?: number;
  limits?: { cpu: string; memory: string };
  disk?: { size: string };
}

// SQL Execute
export interface SqlExecuteRequest {
  sql: string;
}

export interface SqlExecuteData {
  columns: string[];
  rows: Array<Array<unknown>>;
  affected_rows: number;
  execution_time_ms: number;
}

export interface SqlExecuteInner {
  message?: string;
  data: SqlExecuteData;
}

export interface SqlExecuteResponse {
  message?: string;
  data: SqlExecuteInner;
}
