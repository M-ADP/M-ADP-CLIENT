import { api } from '@/utils/api';

export interface UserProfile {
  id: number;
  github_id: string;
  nickname?: string;
  profile?: string;
}

export const getMyUserProfile = (userId?: number) => {
  const query = userId ? `?userId=${userId}` : '';
  return api(`/user/profile${query}`, {
    method: 'GET',
  }) as Promise<UserProfile>;
};
