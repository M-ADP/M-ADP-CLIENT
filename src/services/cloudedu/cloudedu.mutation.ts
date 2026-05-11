import { useMutation } from '@tanstack/react-query';
import { postCloudComparison } from './cloudedu.api';
import { CloudComparisonRequest } from '@/types/cloudedu';

export const useCloudComparison = () => {
  return useMutation({
    mutationFn: (payload: CloudComparisonRequest) => postCloudComparison(payload),
  });
};
