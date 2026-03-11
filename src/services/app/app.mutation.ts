import { useMutation } from '@tanstack/react-query';
import { postCreateApp, patchAppResources, AppCreatePayload, AppResourcesUpdatePayload } from './app.api';

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
