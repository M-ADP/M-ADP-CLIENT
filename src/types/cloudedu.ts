export interface CloudComparisonResourceParams {
  storage_size_gb?: number;
  monthly_requests?: number;
  data_transfer_gb?: number;
  compute_instance_type?: string;
  database_size_gb?: number;
  v_cpu_count?: number;
  memory_gb?: number;
  network_gbps?: number;
}

export interface CloudComparisonRequest {
  function_type: string;
  resource_params?: CloudComparisonResourceParams;
  region?: string;
  response_type?: 'detailed' | 'summary' | string;
}

export type CloudComparisonResponse = Record<string, unknown>;
