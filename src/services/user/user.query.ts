import { useQuery } from '@tanstack/react-query';
import { getMyUserProfile, UserProfile } from './user.api';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export const useUserProfileQuery = () => {
  const setUser = useUserStore((state) => state.setUser);
  const step = useAuthStore((state) => state.step);
  const token = useAuthStore((state) => state.token);

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
