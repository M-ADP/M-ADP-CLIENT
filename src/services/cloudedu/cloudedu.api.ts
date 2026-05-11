import { api } from '@/utils/api';
import {
  CloudComparisonRequest,
  CloudComparisonResponse,
} from '@/types/cloudedu';

export const postCloudComparison = async (payload: CloudComparisonRequest) => {
  const body: CloudComparisonRequest = {
    region: 'ap-northeast-1',
    response_type: 'detailed',
    ...payload,
  };

  return api<CloudComparisonResponse>(`/api/v1/cloud-comparison`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};
