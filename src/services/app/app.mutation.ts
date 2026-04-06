import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCreateApp, AppCreatePayload, patchGithubInfo, UpdateGithubInfoPayload } from './app.api';

export const useCreateAppMutation = () => {
    return useMutation({
        mutationFn: (payload: AppCreatePayload) => postCreateApp(payload),
    });
};

export const useUpdateGithubInfoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateGithubInfoPayload) => patchGithubInfo(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });
};