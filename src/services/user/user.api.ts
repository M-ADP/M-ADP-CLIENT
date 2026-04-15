import { api } from '@/utils/api';

export interface ApiResponse<T> {
    message?: string;
    data: T;
}

export interface UserProfile {
    id: string;
    github_id: string;
    nickname?: string;
    profile?: string;
}

export const getMyUserProfile = (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return api<ApiResponse<UserProfile>>(`/user/profile${query}`, {
        method: 'GET',
    });
};

export interface UserProfileByNickname {
    id: string;
    nickname: string;
    github_id: string;
    profile: string;
}

export const getUserByNickname = (nickname: string) => {
    return api<UserProfileByNickname | UserProfileByNickname[]>(`/user/search?nickname=${nickname}`, {
        method: 'GET',
    });
};
