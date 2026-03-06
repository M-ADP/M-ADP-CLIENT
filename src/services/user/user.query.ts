import { useQuery } from '@tanstack/react-query';
import { getMyUserProfile, UserProfile } from './user.api';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';

export const useUserProfileQuery = () => {
    const setUser = useUserStore((state) => state.setUser);

    const query = useQuery<UserProfile>({
        queryKey: ['userProfile'],
        queryFn: () => getMyUserProfile(),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (query.data) {
            setUser(query.data);
        }
    }, [query.data, setUser]);

    return query;
};
