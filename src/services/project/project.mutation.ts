import { useMutation } from '@tanstack/react-query';
import { postCreateProject, ProjectCreatePayload } from './project.api';

export const useCreateProjectMutation = () => {
    return useMutation({
        mutationFn: (payload: ProjectCreatePayload) => postCreateProject(payload),
    });
};