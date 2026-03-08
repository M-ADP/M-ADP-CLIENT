import { useQuery } from '@tanstack/react-query';
import { getProjects, ProjectListParams } from './project.api';

export const useProjectListQuery = (params?: ProjectListParams) => {
    return useQuery({
        queryKey: ['projects', params],
        queryFn: () => getProjects(params),
        select: (data) => data.data,
    });
};