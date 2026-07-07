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
    postCreateDnsEndpoint,
    CreateDnsEndpointPayload,
    deleteDnsEndpoint,
    putUpdateDnsEndpoint,
    UpdateDnsEndpointPayload,
    postCreateSecret,
    CreateSecretRequestPayload,
    deleteSecret,
    DeleteSecretRequestPayload,
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
        },
    });
};

export const useCreateDnsEndpointMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateDnsEndpointPayload) => postCreateDnsEndpoint(payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['dnsEndpoints', String(variables.project_id)] });
        },
    });
};

export const useDeleteDnsEndpointMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dnsId: string | number) => deleteDnsEndpoint(dnsId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dnsEndpoints'] });
        },
    });
};

export const useUpdateDnsEndpointMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateDnsEndpointPayload) => putUpdateDnsEndpoint(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dnsEndpoints'] });
        },
    });
};

export const useCreateSecretMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateSecretRequestPayload) => postCreateSecret(payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['secretNames', variables.projectId, variables.appName] });
        },
    });
};

export const useDeleteSecretMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: DeleteSecretRequestPayload) => deleteSecret(payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['secretNames', variables.projectId, variables.appName] });
        },
    });
};
