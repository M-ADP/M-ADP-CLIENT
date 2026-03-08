'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card, { MetaItem, FooterMessage, StatusBadge } from '@/components/ui/Card/ui';
import Modal from '@/components/ui/Modal/ui';
import Button from '@/components/ui/Button/ui';
import Input from '@/components/ui/Input/ui';
import * as S from './style';
import { useProjectDetailQuery, useProjectMembersQuery } from '@/services/project/project.query';
import { useDeleteProjectMutation, useUpdateProjectNameMutation, useUpdateProjectResourceMutation } from '@/services/project/project.mutation';

interface ProjectDetailContainerProps {
  projectId: string;
}

export default function ProjectDetailContainer({ projectId }: ProjectDetailContainerProps) {
  const router = useRouter();
  const { data: project, isLoading, isError } = useProjectDetailQuery(projectId);
  const { data: membersData } = useProjectMembersQuery(projectId, { limit: 100 });
  const deleteProjectMutation = useDeleteProjectMutation();
  const updateNameMutation = useUpdateProjectNameMutation();
  const updateResourceMutation = useUpdateProjectResourceMutation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteSearchQuery, setInviteSearchQuery] = useState('');
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
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      if (editForm.name && editForm.name !== project?.name) {
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

  const getStatusVariant = (status: string): 'healthy' | 'unhealthy' | 'stopped' => {
    switch (status) {
      case 'Healthy': return 'healthy';
      case 'Unhealthy': return 'unhealthy';
      default: return 'stopped';
    }
  };

  const isEditPending = updateNameMutation.isPending || updateResourceMutation.isPending;

  return (
    <S.PageWrapper>
      <S.PageHeader>
        <S.TitleRow>
          <S.PageTitle>{project.name}</S.PageTitle>
          <S.ProjectId>({project.id})</S.ProjectId>
          <S.HeaderButtonGroup>
            <Button variant="confirm" onClick={handleOpenEditModal}>
              수정
            </Button>
            <Button variant="cancel" onClick={() => setIsDeleteModalOpen(true)}>
              삭제
            </Button>
            <Button variant="confirm" onClick={() => setIsInviteModalOpen(true)}>
              사용자 초대
            </Button>
          </S.HeaderButtonGroup>
        </S.TitleRow>
      </S.PageHeader>

      <S.SectionTitle>앱 배포 목록</S.SectionTitle>
      <S.AppGridWrapper $showLeftGradient={showLeftGradient} $showRightGradient={showRightGradient}>
        <S.AppGrid ref={scrollRef}>
          {project.deployments.length === 0 ? (
            <p>배포된 앱이 없습니다.</p>
          ) : (
            project.deployments.map((app) => {
              const variant = getStatusVariant(app.health_status);
              const isUnhealthy = variant === 'unhealthy' || variant === 'stopped';
              return (
                <Card
                  key={app.id}
                  title={app.name}
                  footer={
                    <>
                      {isUnhealthy && (
                        <FooterMessage>
                          <Image src="/icons/project/warning.svg" alt="warning" width={12} height={12} />
                          {app.health_status === 'Stopped' ? '애플리케이션이 정지 상태입니다.' : '애플리케이션에 오류가 발생했습니다.'}
                        </FooterMessage>
                      )}
                      <StatusBadge $variant={variant}>
                        {app.health_status}
                      </StatusBadge>
                    </>
                  }
                >
                  <MetaItem>
                    <Image src="/icons/project/code.svg" alt="language" width={14} height={14} />
                    {app.runtime}
                  </MetaItem>
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

      <S.ChartSection>
        <S.ChartGrid>
          <S.ChartCard>
            <S.ChartTitle>CPU 사용량</S.ChartTitle>
            <S.ChartPlaceholder>차트 영역</S.ChartPlaceholder>
          </S.ChartCard>
          <S.ChartCard>
            <S.ChartTitle>메모리 사용량</S.ChartTitle>
            <S.ChartPlaceholder>차트 영역</S.ChartPlaceholder>
          </S.ChartCard>
          <S.ChartCard>
            <S.ChartTitle>디스크 사용량</S.ChartTitle>
            <S.ChartPlaceholder>차트 영역</S.ChartPlaceholder>
          </S.ChartCard>
          <S.ChartCard>
            <S.ChartTitle>네트워크 사용량</S.ChartTitle>
            <S.ChartPlaceholder>차트 영역</S.ChartPlaceholder>
          </S.ChartCard>
        </S.ChartGrid>

        <S.RightPanel>
          <S.PortSection>
            <S.PortTitle>포트 공개 정보</S.PortTitle>
            {project.ports.length === 0 ? (
              <p>공개된 포트가 없습니다.</p>
            ) : (
              project.ports.map((port) => (
                <S.PortInputRow key={port.id}>
                  <S.PortInputGroup>
                    <S.PortLabel>From ({port.from_ip})</S.PortLabel>
                    <S.PortInput type="text" value={port.from_port} readOnly />
                  </S.PortInputGroup>
                  <S.PortInputGroup>
                    <S.PortLabel>To Port</S.PortLabel>
                    <S.PortInput type="text" value={port.port_number} readOnly />
                  </S.PortInputGroup>
                </S.PortInputRow>
              ))
            )}
          </S.PortSection>
        </S.RightPanel>
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
          />
          <Input
            label="CPU (0.1v ~ 4.0v)"
            name="cpu"
            value={editForm.cpu}
            onChange={handleEditChange}
            placeholder="예: 0.3"
          />
          <Input
            label="MEMORY (32MB ~ 4096MB)"
            name="memory"
            value={editForm.memory}
            onChange={handleEditChange}
            placeholder="예: 4096"
          />
          <Input
            label="DISK (32MB ~ 50GB)"
            name="disk"
            value={editForm.disk}
            onChange={handleEditChange}
            placeholder="예: 4096"
          />
          <S.ModalText>※ 변경할 항목만 입력해주세요. 비워두면 기존 값이 유지됩니다.</S.ModalText>
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
          <S.ModalTitle>사용자 초대</S.ModalTitle>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <Input
              name="inviteSearch"
              placeholder="사용자명을 입력해주세요."
              value={inviteSearchQuery}
              onChange={(e) => setInviteSearchQuery(e.target.value)}
              width="100%"
            />
          </div>

          <S.MemberList>
            {membersData?.items.filter(member =>
              member.username.toLowerCase().includes(inviteSearchQuery.toLowerCase())
            ).map((member) => (
              <S.MemberItem key={member.user_id}>
                <S.MemberInfoWrapper>
                  <S.AvatarImage $imageUrl={member.profile_image || undefined} />
                  <S.MemberName>{member.username}</S.MemberName>
                  {member.role === 'OWNER' && <S.OwnerBadge>오너</S.OwnerBadge>}
                </S.MemberInfoWrapper>
                {member.role !== 'OWNER' && <S.KickButton>추방</S.KickButton>}
              </S.MemberItem>
            )) || <p>멤버를 불러오는 중입니다.</p>}
          </S.MemberList>

          <S.ModalButtonGroup>
            <Button variant="cancel" onClick={() => setIsInviteModalOpen(false)}>
              뒤로가기
            </Button>
            <Button variant="confirm" onClick={() => alert('초대 기능은 아직 준비 중입니다.')}>
              초대
            </Button>
          </S.ModalButtonGroup>
        </S.ModalContent>
      </Modal>
    </S.PageWrapper>
  );
}