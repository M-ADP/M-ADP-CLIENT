import { useQuery } from '@tanstack/react-query';
import { getGithubAllowedRepositories, GithubAllowedRepository } from './app.api';

export const useGithubAllowedRepositoriesQuery = (appId: string | null) => {
    return useQuery<GithubAllowedRepository[]>({
        queryKey: ['githubAllowedRepositories', appId],
        queryFn: () => getGithubAllowedRepositories(),
        enabled: !!appId,
    });
};
