import { useMutation } from '@tanstack/react-query';
import { postCreateApp, patchAppResources, deleteApp, AppCreatePayload, AppResourcesUpdatePayload, AppDeletePayload } from './app.api';

export const useCreateAppMutation = () => {
    return useMutation({
        mutationFn: (payload: AppCreatePayload) => postCreateApp(payload),
    });
};

export const usePatchAppResourcesMutation = () => {
    return useMutation({
        mutationFn: (payload: AppResourcesUpdatePayload) => patchAppResources(payload),
    });
};

export const useDeleteAppMutation = () => {
    return useMutation({
        mutationFn: (payload: AppDeletePayload) => deleteApp(payload),
    });
};
