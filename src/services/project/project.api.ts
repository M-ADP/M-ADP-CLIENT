import { api } from '@/utils/api';
import {
    ProjectCreatePayload,
    ProjectCreateResponse,
    ProjectListParams,
    ProjectListResponse,
    ProjectDetailResponse,
    UpdateProjectNamePayload,
    UpdateProjectResourcePayload,
    ProjectMembersParams,
    ProjectMembersListResponse,
    AddProjectMemberPayload,
    ProjectOwnerTransferPayload,
    ProjectMemberInvitationsParams,
    ProjectMemberInvitationsListResponse,
    ProjectMemberInvitationSuccessResponse,
    ProjectMemberResponse,
} from '@/types/project';

export const postCreateProject = (payload: ProjectCreatePayload) => {
    return api<ProjectCreateResponse>('/projects', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const getProjects = (params?: ProjectListParams) => {
    const searchParams = new URLSearchParams();
    if (params?.cursor) searchParams.set('cursor', params.cursor);
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    return api<ProjectListResponse>(`/projects${query ? `?${query}` : ''}`);
};

export const getProjectById = (projectId: string) => {
    return api<ProjectDetailResponse>(`/projects/${projectId}`);
};

export const deleteProject = (projectId: string) => {
    return api(`/projects/${projectId}`, {
        method: 'DELETE',
    });
};

export const updateProjectName = (projectId: string, payload: UpdateProjectNamePayload) => {
    return api(`/projects/${projectId}/name`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
};

export const updateProjectResource = (projectId: string, payload: UpdateProjectResourcePayload) => {
    return api(`/projects/${projectId}/resource`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
};

export const getProjectMembers = (projectId: string, params?: ProjectMembersParams) => {
    const searchParams = new URLSearchParams();
    if (params?.cursor) searchParams.set('cursor', params.cursor);
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    return api<ProjectMembersListResponse>(`/projects/${projectId}/members${query ? `?${query}` : ''}`);
};

export const addProjectMember = (projectId: string, payload: AddProjectMemberPayload) => {
    return api<ProjectMemberInvitationSuccessResponse>(`/projects/${projectId}/members`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const removeProjectMember = (projectId: string, targetUserId: string) => {
    return api(`/projects/${projectId}/members/${targetUserId}`, {
        method: 'DELETE',
    });
};

export const transferProjectOwnership = (projectId: string, payload: ProjectOwnerTransferPayload) => {
    return api(`/projects/${projectId}/owner`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
};

export const getProjectMemberInvitations = (projectId: string, params?: ProjectMemberInvitationsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.cursor) searchParams.set('cursor', params.cursor);
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    return api<ProjectMemberInvitationsListResponse>(
        `/projects/${projectId}/member-invitations${query ? `?${query}` : ''}`
    );
};

export const acceptProjectMemberInvitation = (projectId: string, token: string) => {
    return api<{ message: string; data: ProjectMemberResponse }>(
        `/projects/${projectId}/member-invitations/${encodeURIComponent(token)}/accept`,
        {
            method: 'POST',
        }
    );
};

export const cancelProjectMemberInvitation = (projectId: string, invitationId: string) => {
    return api<ProjectMemberInvitationSuccessResponse>(
        `/projects/${projectId}/member-invitations/${invitationId}`,
        {
            method: 'DELETE',
        }
    );
};

export const resendProjectMemberInvitation = (projectId: string, invitationId: string) => {
    return api<ProjectMemberInvitationSuccessResponse>(
        `/projects/${projectId}/member-invitations/${invitationId}/resend`,
        {
            method: 'POST',
        }
    );
};
