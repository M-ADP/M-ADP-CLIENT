import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    postCreateCloudDb,
    patchUpdateCloudDb,
    deleteCloudDb,
    postExecuteSql,
} from './cloudDb.api';
import {
    CreateCloudDbPayload,
    UpdateCloudDbPayload,
    SqlExecuteRequest,
} from '@/types/cloudDatabase';

export const useCreateCloudDbMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateCloudDbPayload) => postCreateCloudDb(payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cloudDbs', variables.project_id] });
        },
    });
};

export const useUpdateCloudDbMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            cloudDbId,
            projectId,
            payload,
        }: {
            cloudDbId: string;
            projectId: string;
            payload: UpdateCloudDbPayload;
        }) => patchUpdateCloudDb(cloudDbId, projectId, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cloudDb', variables.cloudDbId, variables.projectId] });
            queryClient.invalidateQueries({ queryKey: ['cloudDbs', variables.projectId] });
        },
    });
};

export const useDeleteCloudDbMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cloudDbId, projectId }: { cloudDbId: string; projectId: string }) =>
            deleteCloudDb(cloudDbId, projectId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cloudDbs', variables.projectId] });
        },
    });
};

export const useExecuteSqlMutation = () => {
    return useMutation({
        mutationFn: ({
            cloudDbId,
            projectId,
            payload,
        }: {
            cloudDbId: string;
            projectId: string;
            payload: SqlExecuteRequest;
        }) => postExecuteSql(cloudDbId, projectId, payload),
    });
};
