import { useQuery } from '@tanstack/react-query';
import { getProjects, getProjectById, getProjectMembers, ProjectListParams } from './project.api';

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

export const useProjectMembersQuery = (projectId: string, params?: ProjectListParams) => {
    return useQuery({
        queryKey: ['projectMembers', projectId, params],
        queryFn: () => getProjectMembers(projectId, params),
        select: (data) => data.data,
        enabled: !!projectId,
    });
};