'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card, { MetaItem, FooterMessage, StatusBadge } from '@/components/ui/Card/ui';
import Modal from '@/components/ui/Modal/ui';
import Button from '@/components/ui/Button/ui';
import Input from '@/components/ui/Input/ui';
import ProgressRing from '@/components/ui/Charts/ProgressRing/ui';
import * as S from './style';
import { useProjectDetailQuery, useProjectMembersQuery } from '@/services/project/project.query';
import {
  useDeleteProjectMutation,
  useUpdateProjectNameMutation,
  useUpdateProjectResourceMutation,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
  useTransferOwnershipMutation
} from '@/services/project/project.mutation';
import { useSearchUserByNicknameQuery } from '@/services/user/user.query';
import { useCloudDbsQuery } from '@/services/cloud-database/cloudDb.query';
import { useDeleteCloudDbMutation } from '@/services/cloud-database/cloudDb.mutation';
import { CloudDbInner } from '@/types/cloudDatabase';
import { useDebounce } from '@/hooks/useDebounce';

const inferDbType = (image: string | undefined): string => {
  if (!image) return 'Unknown';
  const lower = image.toLowerCase();
  if (lower.includes('postgres')) return 'PostgreSQL';
  if (lower.includes('mysql')) return 'MySQL';
  if (lower.includes('mariadb')) return 'MariaDB';
  if (lower.includes('mongo')) return 'MongoDB';
  if (lower.includes('redis')) return 'Redis';
  return image.split(':')[0] || 'Unknown';
};

const inferDbStatus = (item: CloudDbInner): 'healthy' | 'warning' | 'stopped' => {
  const { replicas, status } = item.data;
  if (!status || status.ready_replicas === 0) return 'stopped';
  if (status.ready_replicas < replicas) return 'warning';
  return 'healthy';
};

interface ProjectDetailContainerProps {
  projectId: string;
}



export default function ProjectDetailContainer({ projectId }: ProjectDetailContainerProps) {
  const router = useRouter();
  const { data: project, isLoading, isError } = useProjectDetailQuery(projectId);
  const { data: membersData } = useProjectMembersQuery(projectId, { limit: 100 });
  const { data: cloudDbs = [], isPending: isCloudDbsPending } = useCloudDbsQuery(projectId);
  const deleteCloudDbMutation = useDeleteCloudDbMutation();
  const deleteProjectMutation = useDeleteProjectMutation();
  const updateNameMutation = useUpdateProjectNameMutation();
  const updateResourceMutation = useUpdateProjectResourceMutation();
  const addMemberMutation = useAddProjectMemberMutation();
  const removeMemberMutation = useRemoveProjectMemberMutation();
  const transferOwnershipMutation = useTransferOwnershipMutation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const [inviteSearchQuery, setInviteSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(inviteSearchQuery, 500);
  const { data: searchResult, isLoading: isSearchLoading } = useSearchUserByNicknameQuery(debouncedSearchQuery);

  const [editForm, setEditForm] = useState({
    name: '',
    cpu: '',
    memory: '',
    disk: '',
  });

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftGradient(scrollLeft > 0);
        setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      handleScroll();
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleOpenEditModal = () => {
    if (project) {
      setEditForm({
        name: project.name,
        cpu: '',
        memory: '',
        disk: '',
      });
    }
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const sanitizedName = value
        .toLowerCase()
        .replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
      setEditForm((prev) => ({ ...prev, [name]: sanitizedName }));
      return;
    }
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const isNameChanged = Boolean(editForm.name && editForm.name !== project?.name);
      if (isNameChanged && (/[A-Z]/.test(editForm.name) || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(editForm.name))) {
        alert('프로젝트 이름에는 대문자와 한글을 사용할 수 없습니다.');
        return;
      }

      if (isNameChanged) {
        await updateNameMutation.mutateAsync({
          projectId,
          payload: { name: editForm.name },
        });
      }

      const resourcePayload: { max_cpu?: number; max_memory?: number; max_disk?: number } = {};
      if (editForm.cpu) resourcePayload.max_cpu = Number(editForm.cpu);
      if (editForm.memory) resourcePayload.max_memory = Number(editForm.memory);
      if (editForm.disk) resourcePayload.max_disk = Number(editForm.disk);

      if (Object.keys(resourcePayload).length > 0) {
        await updateResourceMutation.mutateAsync({
          projectId,
          payload: resourcePayload,
        });
      }

      alert('프로젝트가 수정되었습니다.');
      setIsEditModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('프로젝트 수정에 실패했습니다.');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProjectMutation.mutateAsync(projectId);
      alert('프로젝트가 삭제되었습니다.');
      router.push('/project/manage');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('프로젝트 삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleInviteOpen = () => {
    setInviteSearchQuery('');
    setIsInviteModalOpen(true);
  };

  const handleInviteUser = async (userId: string) => {
    try {
      await addMemberMutation.mutateAsync({
        projectId,
        payload: { user_id: userId },
      });
      alert('사용자가 초대되었습니다.');
      setInviteSearchQuery('');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('사용자 초대에 실패했습니다.');
      }
    }
  };

  const handleKickUser = async (targetUserId: string) => {
    if (!confirm('정말 이 멤버를 추방하시겠습니까?')) return;
    try {
      await removeMemberMutation.mutateAsync({
        projectId,
        targetUserId,
      });
      alert('멤버가 추방되었습니다.');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('멤버 추방에 실패했습니다.');
      }
    }
  };

  const handleOpenAppDetail = (appName: string, appId: string | number) => {
    const query = new URLSearchParams({ appName, appId: String(appId) });
    router.push(`/project/manage/${projectId}/app?${query.toString()}`);
  };

  const handleOpenCloudDb = (cloudDbName: string) => {
    router.push(`/project/manage/${projectId}/cloud-database/${cloudDbName}`);
  };

  const handleDeleteCloudDb = (cloudDbName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (deleteCloudDbMutation.isPending) return;
    if (!window.confirm(`'${cloudDbName}' 데이터베이스를 삭제할까요?`)) return;
    deleteCloudDbMutation.mutate({ cloudDbId: cloudDbName, projectId });
  };

  useEffect(() => {
    if (!isCreateMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setIsCreateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCreateMenuOpen]);

  if (isLoading) {
    return (
      <S.PageWrapper>
        <p>로딩 중...</p>
      </S.PageWrapper>
    );
  }

  if (isError || !project) {
    return (
      <S.PageWrapper>
        <p>프로젝트 정보를 불러오는데 실패했습니다.</p>
      </S.PageWrapper>
    );
  }

  const getStatusVariant = (status: string): 'healthy' | 'unhealthy' | 'warning' | 'stopped' => {
    const s = status.toUpperCase();
    switch (s) {
      case 'HEALTHY':
      case 'RUNNING':
        return 'healthy';
      case 'BUILDING':
      case 'PENDING':
        return 'warning';
      case 'UNHEALTHY':
        return 'unhealthy';
      case 'STOPPED':
      default:
        return 'stopped';
    }
  };

  const isEditPending = updateNameMutation.isPending || updateResourceMutation.isPending;

  return (
    <S.PageWrapper>
      <S.PageHeader>
        <S.TitleRow>
          <S.PageTitle>{project.name}</S.PageTitle>
          {/* <S.ProjectId>({project.id})</S.ProjectId> */}
          <S.HeaderButtonGroup>
            <Button variant="confirm" onClick={handleOpenEditModal}>
              수정
            </Button>
            <Button variant="cancel" onClick={() => setIsDeleteModalOpen(true)}>
              삭제
            </Button>
            {project.my_role === 'OWNER' && (
              <Button variant="confirm" onClick={handleInviteOpen}>
                사용자 초대
              </Button>
            )}
          </S.HeaderButtonGroup>
        </S.TitleRow>
      </S.PageHeader>

      <S.SectionRow>
        <S.SectionTitle>앱 배포 목록</S.SectionTitle>
        <S.CreateDropdownWrapper ref={createMenuRef}>
          <Button variant="confirm" onClick={() => setIsCreateMenuOpen((v) => !v)}>
            + 생성 ▾
          </Button>
          {isCreateMenuOpen && (
            <S.CreateDropdownMenu>
              <S.CreateDropdownItem
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  router.push(`/app/create?projectId=${projectId}`);
                }}
              >
                <Image src="/icons/sidebar/dashboard.svg" alt="" width={16} height={16} />
                일반 앱
              </S.CreateDropdownItem>
              <S.CreateDropdownItem
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  router.push(`/project/manage/${projectId}/cloud-database/create`);
                }}
              >
                <Image src="/icons/sidebar/cloud-db.svg" alt="" width={16} height={16} />
                클라우드 DB
              </S.CreateDropdownItem>
            </S.CreateDropdownMenu>
          )}
        </S.CreateDropdownWrapper>
      </S.SectionRow>
      <S.AppGridWrapper $showLeftGradient={showLeftGradient} $showRightGradient={showRightGradient}>
        <S.AppGrid ref={scrollRef}>
          {project.deployments.length === 0 ? (
            <p>배포된 앱이 없습니다.</p>
          ) : (
            project.deployments.map((app) => {
              const variant = getStatusVariant(app.health_status);
              const normalizedStatus = String(app.health_status || '').toUpperCase();
              const showStatusMessage = variant === 'unhealthy' || variant === 'stopped' || variant === 'warning';
              return (
                <Card
                  key={app.id}
                  title={app.name}
                  onClick={() => handleOpenAppDetail(app.name, app.id)}
                  footer={
                    <>
                      {showStatusMessage && (
                        <FooterMessage>
                          <Image src="/icons/project/warning.svg" alt="warning" width={12} height={12} />
                          {variant === 'warning'
                            ? '애플리케이션을 빌드 중입니다. 잠시만 기다려주세요.'
                            : normalizedStatus === 'STOPPED'
                              ? '애플리케이션이 정지 상태입니다.'
                              : '애플리케이션에 오류가 발생했습니다.'}
                        </FooterMessage>
                      )}
                      <StatusBadge $variant={variant}>
                        {app.health_status}
                      </StatusBadge>
                    </>
                  }
                >
                  {app.runtime && (
                    <MetaItem>
                      <Image src="/icons/project/code.svg" alt="language" width={14} height={14} />
                      {app.runtime}
                    </MetaItem>
                  )}
                  <MetaItem>
                    <Image src="/icons/project/pods.svg" alt="replicas" width={14} height={14} />
                    {app.pod_count}
                  </MetaItem>
                  <MetaItem>
                    <Image src="/icons/project/port.svg" alt="port" width={14} height={14} />
                    {app.exposed_port}
                  </MetaItem>
                  <MetaItem>
                    <Image src="/icons/project/gauge.svg" alt="usage" width={14} height={14} />
                    CPU: {app.cpu_usage_percent}% · RAM: {app.ram_usage_percent}%
                  </MetaItem>
                </Card>
              );
            })
          )}
        </S.AppGrid>
      </S.AppGridWrapper>

      <S.SectionRow>
        <S.SectionTitle>클라우드 DB 목록</S.SectionTitle>
      </S.SectionRow>
      <S.AppGridWrapper $showLeftGradient={false} $showRightGradient={false}>
        <S.AppGrid>
          {isCloudDbsPending ? (
            <p>불러오는 중...</p>
          ) : cloudDbs.length === 0 ? (
            <p>생성된 데이터베이스가 없습니다.</p>
          ) : (
            cloudDbs.map((item) => {
              const dbName = item.data.name;
              const type = inferDbType(item.data.containers?.[0]?.image);
              const status = inferDbStatus(item);
              const ready = item.data.status?.ready_replicas ?? 0;
              return (
                <div key={dbName} style={{ position: 'relative' }}>
                  <Card
                    title={dbName}
                    onClick={() => handleOpenCloudDb(dbName)}
                    status={status}
                  >
                    <MetaItem>
                      <Image src="/icons/sidebar/cloud-db.svg" alt="type" width={14} height={14} />
                      {type}
                    </MetaItem>
                    <MetaItem>
                      <Image src="/icons/project/pods.svg" alt="replicas" width={14} height={14} />
                      {ready} / {item.data.replicas}
                    </MetaItem>
                  </Card>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteCloudDb(dbName, e)}
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '2.75rem',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: '#dc2626',
                      padding: '0.25rem 0.5rem',
                    }}
                    disabled={deleteCloudDbMutation.isPending}
                  >
                    삭제
                  </button>
                </div>
              );
            })
          )}
        </S.AppGrid>
      </S.AppGridWrapper>

      <S.ChartSection>
        <S.ChartGrid>
          <S.ChartCard>
            <S.ChartTitle>CPU 사용량</S.ChartTitle>
            <ProgressRing
              value={project.resource?.cpu?.percentage || 0}
              color="#3b82f6"
              size={80}
              strokeWidth={8}
            />
          </S.ChartCard>
          <S.ChartCard>
            <S.ChartTitle>메모리 사용량</S.ChartTitle>
            <ProgressRing
              value={project.resource?.memory?.percentage || 0}
              color="#8b5cf6"
              size={80}
              strokeWidth={8}
            />
          </S.ChartCard>
          <S.ChartCard>
            <S.ChartTitle>디스크 사용량</S.ChartTitle>
            <ProgressRing
              value={project.resource?.disk?.percentage || 0}
              color="#f59e0b"
              size={80}
              strokeWidth={8}
            />
          </S.ChartCard>
          <S.ChartCard>
            <S.ChartTitle>인스턴스 사용량</S.ChartTitle>
            <ProgressRing
              value={project.resource?.instance?.percentage || 0}
              color="#10b981"
              size={80}
              strokeWidth={8}
            />
          </S.ChartCard>
        </S.ChartGrid>
      </S.ChartSection>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} width={480} height="auto">
        <S.ModalContent>
          <S.ModalTitle>프로젝트 수정</S.ModalTitle>
          <Input
            label="프로젝트 명"
            name="name"
            value={editForm.name}
            onChange={handleEditChange}
            placeholder="프로젝트 이름"
            maxLength={20}
          />
          <Input
            label="CPU (0.1v ~ 4.0v)"
            name="cpu"
            value={editForm.cpu}
            onChange={handleEditChange}
            placeholder="예: 0.3"
          />
          <Input
            label="MEMORY (0.5GB ~ 1GB)"
            name="memory"
            value={editForm.memory}
            onChange={handleEditChange}
            placeholder="예: 1"
          />
          <Input
            label="DISK (2GB ~ 50GB)"
            name="disk"
            value={editForm.disk}
            onChange={handleEditChange}
            placeholder="예: 4"
          />
          <S.ModalText>※ 변경하실 항목만 GB 단위로 입력해 주세요. (입력하지 않으면 기존 값이 유지됩니다.)</S.ModalText>
          <S.ModalButtonGroup>
            <Button variant="cancel" onClick={() => setIsEditModalOpen(false)}>
              취소
            </Button>
            <Button variant="confirm" onClick={handleEditSubmit} disabled={isEditPending}>
              {isEditPending ? '저장 중...' : '저장'}
            </Button>
          </S.ModalButtonGroup>
        </S.ModalContent>
      </Modal>

      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} width={400} height="auto">
        <S.ModalContent>
          <S.ModalTitle>프로젝트 삭제</S.ModalTitle>
          <S.ModalText>정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</S.ModalText>
          <S.ModalButtonGroup>
            <Button variant="cancel" onClick={() => setIsDeleteModalOpen(false)}>
              취소
            </Button>
            <Button variant="confirm" onClick={handleDelete} disabled={deleteProjectMutation.isPending}>
              {deleteProjectMutation.isPending ? '삭제 중...' : '삭제'}
            </Button>
          </S.ModalButtonGroup>
        </S.ModalContent>
      </Modal>

      <Modal open={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} width={480} height="auto">
        <S.ModalContent>
          <S.ModalTitle>사용자 초대 / 관리</S.ModalTitle>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1rem' }}>
            <Input
              name="inviteSearch"
              placeholder="닉네임을 검색해주세요..."
              value={inviteSearchQuery}
              onChange={(e) => setInviteSearchQuery(e.target.value)}
              width="100%"
            />
          </div>

          {inviteSearchQuery && (
            <S.SearchPreviewBox>
              {isSearchLoading ? (
                <p>검색 중...</p>
              ) : searchResult && (Array.isArray(searchResult) ? searchResult.length > 0 : true) ? (
                (Array.isArray(searchResult) ? searchResult : [searchResult]).map(result => (
                  <S.MemberItem key={result.id}>
                    <S.MemberInfoWrapper>
                      <S.AvatarImage $imageUrl={result.profile || undefined} />
                      <S.MemberName>{result.nickname} ({result.github_id})</S.MemberName>
                    </S.MemberInfoWrapper>
                    <Button
                      variant="confirm"
                      onClick={() => handleInviteUser(result.id)}
                      disabled={addMemberMutation.isPending}
                    >
                      {addMemberMutation.isPending ? '초대 중...' : '초대'}
                    </Button>
                  </S.MemberItem>
                ))
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </S.SearchPreviewBox>
          )}

          <S.ModalText style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>참여 중인 멤버</S.ModalText>
          <S.MemberList>
            {membersData?.items
              .slice()
              .sort((a, b) => (a.role === 'OWNER' ? -1 : b.role === 'OWNER' ? 1 : 0))
              .map((member) => (
              <S.MemberItem key={member.user_id}>
                <S.MemberInfoWrapper>
                  <S.AvatarImage $imageUrl={member.profile_image || undefined} />
                  <S.MemberName>{member.username}</S.MemberName>
                  {member.role === 'OWNER' && <S.OwnerBadge>오너</S.OwnerBadge>}
                </S.MemberInfoWrapper>
                {member.role !== 'OWNER' && project.my_role === 'OWNER' && (
                  <S.MemberActionGroup>
                    <S.TransferButton
                      onClick={() => {
                        if (!confirm(`${member.username}님에게 소유권을 이전하시겠습니까?`)) return;
                        transferOwnershipMutation.mutateAsync({
                          projectId,
                          payload: { target_user_id: member.user_id },
                        }).then(() => alert('소유권이 이전되었습니다.')).catch((err) => {
                          alert(err instanceof Error ? err.message : '소유권 이전에 실패했습니다.');
                        });
                      }}
                    >
                      {transferOwnershipMutation.isPending ? '처리 중' : '소유권 이전'}
                    </S.TransferButton>
                    <S.KickButton onClick={() => handleKickUser(member.user_id)}>
                      {removeMemberMutation.isPending ? '처리 중' : '추방'}
                    </S.KickButton>
                  </S.MemberActionGroup>
                )}
              </S.MemberItem>
            )) || <p>멤버를 불러오는 중입니다.</p>}
          </S.MemberList>

          <S.ModalButtonGroup>
            <Button variant="cancel" onClick={() => setIsInviteModalOpen(false)}>
              닫기
            </Button>
          </S.ModalButtonGroup>
        </S.ModalContent>
      </Modal>
    </S.PageWrapper>
  );
}
