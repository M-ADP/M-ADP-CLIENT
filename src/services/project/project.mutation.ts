import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    postCreateProject,
    deleteProject,
    updateProjectName,
    updateProjectResource,
    addProjectMember,
    removeProjectMember,
    transferProjectOwnership,
} from './project.api';
import {
    ProjectCreatePayload,
    UpdateProjectNamePayload,
    UpdateProjectResourcePayload,
    AddProjectMemberPayload,
    ProjectOwnerTransferPayload,
} from '@/types/project';

export const useCreateProjectMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ProjectCreatePayload) => postCreateProject(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
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

export const useAddProjectMemberMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, payload }: { projectId: string; payload: AddProjectMemberPayload }) =>
            addProjectMember(projectId, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projectMembers', variables.projectId] });
        },
    });
};

export const useRemoveProjectMemberMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, targetUserId }: { projectId: string; targetUserId: string }) =>
            removeProjectMember(projectId, targetUserId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projectMembers', variables.projectId] });
        },
    });
};

export const useTransferOwnershipMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, payload }: { projectId: string; payload: ProjectOwnerTransferPayload }) =>
            transferProjectOwnership(projectId, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projectMembers', variables.projectId] });
            queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
        },
    });
};
