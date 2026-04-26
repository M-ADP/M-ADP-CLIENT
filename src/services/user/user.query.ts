import { useQuery } from '@tanstack/react-query';
import { getMyUserProfile, getUserByNickname, UserProfile } from './user.api';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';

export const useUserProfileQuery = (enabled: boolean = true) => {
    const setUser = useUserStore((state) => state.setUser);

    const query = useQuery<UserProfile>({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await getMyUserProfile();
            if (!response?.data) {
                throw new Error('사용자 프로필 형식이 올바르지 않습니다.');
            }
            return response.data;
        },
        enabled,
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
