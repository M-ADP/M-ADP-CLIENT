import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    postCreateApp,
    AppCreatePayload,
    patchGithubInfo,
    UpdateGithubInfoPayload,
    patchAppResources,
    PatchAppResourcesPayload,
    deleteApp,
    DeleteAppPayload,
} from './app.api';

export const useCreateAppMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: AppCreatePayload) => postCreateApp(payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['project', variables.project_id] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['appDeployments', variables.project_id] });
        },
    });
};

export const useUpdateGithubInfoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateGithubInfoPayload) => patchGithubInfo(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['appDetails'] });
        }
    });
};

export const usePatchAppResourcesMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: PatchAppResourcesPayload) => patchAppResources(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appDetails'] });
            queryClient.invalidateQueries({ queryKey: ['appResourceStatus'] });
            queryClient.invalidateQueries({ queryKey: ['appDeployments'] });
        },
    });
};

export const useDeleteAppMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: DeleteAppPayload) => deleteApp(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['appDeployments'] });
            queryClient.invalidateQueries({ queryKey: ['appDetails'] });
            queryClient.invalidateQueries({ queryKey: ['appLogs'] });
            queryClient.invalidateQueries({ queryKey: ['appResourceStatus'] });
        },
    });
};
