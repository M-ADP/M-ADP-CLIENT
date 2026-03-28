import { useQuery } from '@tanstack/react-query';
import { getGithubAllowedRepositories, GithubAllowedRepository } from './app.api';

export const useGithubAllowedRepositoriesQuery = () => {
    return useQuery<GithubAllowedRepository[]>({
        queryKey: ['githubAllowedRepositories'],
        queryFn: () => getGithubAllowedRepositories(),
    });
};
