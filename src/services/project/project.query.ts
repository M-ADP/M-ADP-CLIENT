import { useQuery } from '@tanstack/react-query';
import { getProjects, getProjectById, ProjectListParams } from './project.api';

export const useProjectListQuery = (params?: ProjectListParams) => {
    return useQuery({
        queryKey: ['projects', params],
        queryFn: () => getProjects(params),
        select: (data) => data.data,
    });
};

export const useProjectDetailQuery = (projectId: string) => {
    return useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getProjectById(projectId),
        select: (data) => data.data,
        enabled: !!projectId,
    });
};