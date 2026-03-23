import { useQuery } from '@tanstack/react-query';
import { getMyUserProfile, getUserByNickname, UserProfile } from './user.api';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export const useUserProfileQuery = () => {
    const setUser = useUserStore((state) => state.setUser);
    const step = useAuthStore((state: { step: string }) => state.step);
    const token = Cookies.get('token');

    const query = useQuery<UserProfile>({
        queryKey: ['userProfile'],
        queryFn: () => getMyUserProfile(),
        staleTime: 1000 * 60 * 5,
        enabled: !!token && step !== 'github',
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
