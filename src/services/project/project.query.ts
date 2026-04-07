import { useQuery } from '@tanstack/react-query';
import { getProjects, getProjectById, getProjectMembers } from './project.api';
import { ProjectListParams } from '@/types/project';

export const useProjectListQuery = (params?: ProjectListParams) => {
    return useQuery({
        queryKey: ['projects', params],
        queryFn: () => getProjects(params),
        select: (data) => data.data,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
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

export const useProjectMembersQuery = (projectId: string, params?: ProjectListParams) => {
    return useQuery({
        queryKey: ['projectMembers', projectId, params],
        queryFn: () => getProjectMembers(projectId, params),
        select: (data) => data.data,
        enabled: !!projectId,
    });
};
