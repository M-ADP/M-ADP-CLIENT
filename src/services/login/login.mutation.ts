import { useMutation } from '@tanstack/react-query';
import { postAuthCode, AuthCodePayload } from './login.api';

export const useAuthCodeMutation = () => {
    return useMutation({
        mutationFn: (payload: AuthCodePayload) => postAuthCode(payload),
    });
};