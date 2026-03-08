import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    postCreateProject,
    deleteProject,
    updateProjectName,
    updateProjectResource,
    ProjectCreatePayload,
    UpdateProjectNamePayload,
    UpdateProjectResourcePayload,
} from './project.api';

export const useCreateProjectMutation = () => {
    return useMutation({
        mutationFn: (payload: ProjectCreatePayload) => postCreateProject(payload),
    });
};

export const useDeleteProjectMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (projectId: string) => deleteProject(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};

export const useUpdateProjectNameMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, payload }: { projectId: string; payload: UpdateProjectNamePayload }) =>
            updateProjectName(projectId, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};

export const useUpdateProjectResourceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, payload }: { projectId: string; payload: UpdateProjectResourcePayload }) =>
            updateProjectResource(projectId, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
        },
    });
};