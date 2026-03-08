import { useMutation } from '@tanstack/react-query';
import { postCreateApp, AppCreatePayload } from './app.api';

export const useCreateAppMutation = () => {
    return useMutation({
        mutationFn: (payload: AppCreatePayload) => postCreateApp(payload),
    });
};