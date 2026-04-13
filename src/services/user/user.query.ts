import { useQuery } from '@tanstack/react-query';
import { getMyUserProfile, getUserByNickname, UserProfile } from './user.api';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';

type ApiWrapped<T> = {
    message?: string;
    data?: T;
};

const unwrapUserProfile = (response: UserProfile | ApiWrapped<UserProfile>): UserProfile | null => {
    if (!response || typeof response !== 'object') return null;
    if ('github_id' in response) return response as UserProfile;
    if ('data' in response && response.data && typeof response.data === 'object') {
        return response.data;
    }
    return null;
};

export const useUserProfileQuery = () => {
    const setUser = useUserStore((state) => state.setUser);

    const query = useQuery<UserProfile>({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await getMyUserProfile();
            const unwrapped = unwrapUserProfile(response as UserProfile | ApiWrapped<UserProfile>);
            if (!unwrapped) {
                throw new Error('사용자 프로필 형식이 올바르지 않습니다.');
            }
            return unwrapped;
        },
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (query.data) {
            setUser(query.data);
        }
    }, [query.data, setUser]);

    return query;
};

export const useSearchUserByNicknameQuery = (nickname: string) => {
    return useQuery({
        queryKey: ['searchUserByNickname', nickname],
        queryFn: () => getUserByNickname(nickname),
        enabled: Boolean(nickname),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};
