import { useMutation } from '@tanstack/react-query';
import { postCreateApp, AppCreatePayload, patchGithubInfo, UpdateGithubInfoPayload } from './app.api';

export const useCreateAppMutation = () => {
    return useMutation({
        mutationFn: (payload: AppCreatePayload) => postCreateApp(payload),
    });
};

export const useUpdateGithubInfoMutation = () => {
    return useMutation({
        mutationFn: (payload: UpdateGithubInfoPayload) => patchGithubInfo(payload),
    });
};