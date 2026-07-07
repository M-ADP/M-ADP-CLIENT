'use client';

import { use } from 'react';
import styled from '@emotion/styled';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button/ui';
import { postLogout } from '@/services/login/login.api';
import { useAcceptProjectMemberInvitationMutation } from '@/services/project/project.mutation';
import { useUserProfileQuery } from '@/services/user/user.query';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { black, gray } from '@/styles/colors';
import { FONT_FAMILY, fontWeights } from '@/styles/typography';

interface PageProps {
  params: Promise<{
    projectId: string;
    token: string;
  }>;
}

export default function ProjectInvitationPage({ params }: PageProps) {
  const router = useRouter();
  const setStep = useAuthStore((state) => state.setStep);
  const setUser = useUserStore((state) => state.setUser);
  const acceptInvitationMutation = useAcceptProjectMemberInvitationMutation();
  const { projectId, token } = use(params);
  const isLoggedIn = Boolean(Cookies.get('token'));
  const { data: currentUser, isLoading: isUserLoading } = useUserProfileQuery(isLoggedIn);
  const nextPath = `/projects/${projectId}/member-invitations/${encodeURIComponent(token)}`;

  const handleAccept = async () => {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    try {
      await acceptInvitationMutation.mutateAsync({
        projectId,
        token,
      });
      alert('프로젝트 초대를 수락했습니다.');
      router.replace(`/project/manage/${projectId}`);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('초대 수락에 실패했습니다.');
      }
    }
  };

  const handleSwitchAccount = async () => {
    try {
      await postLogout();
    } catch {
    } finally {
      Cookies.remove('token', { path: '/' });
      setUser(null);
      setStep('google');
      router.push(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  };

  return (
    <PageWrapper>
      <Card>
        <Header>
          <Eyebrow>프로젝트 멤버 초대</Eyebrow>
          <Title>이 계정으로 초대를 수락할까요?</Title>
          <Description>수락 후에는 프로젝트 멤버로 바로 참여하게 됩니다.</Description>
        </Header>

        <AccountSection>
          <SectionLabel>현재 로그인한 계정</SectionLabel>
          {isLoggedIn ? (
            <>
              <AccountCard>
                <Avatar $imageUrl={currentUser?.profile} />
                <AccountContent>
                  {isUserLoading ? (
                    <>
                      <AccountName>계정 정보를 불러오는 중...</AccountName>
                      <AccountMeta>잠시만 기다려주세요.</AccountMeta>
                    </>
                  ) : (
                    <>
                      <AccountName>{currentUser?.nickname || currentUser?.github_id || '계정 정보 없음'}</AccountName>
                      <AccountMeta>
                        {currentUser?.github_id ? `@${currentUser.github_id}` : 'GitHub 계정 정보 없음'}
                      </AccountMeta>
                    </>
                  )}
                </AccountContent>
              </AccountCard>
              <SwitchAccountButton type="button" onClick={handleSwitchAccount}>
                다른 계정으로 로그인
              </SwitchAccountButton>
            </>
          ) : (
            <EmptyStateCard>
              <EmptyStateTitle>로그인이 필요합니다.</EmptyStateTitle>
              <EmptyStateText>초대를 수락할 계정으로 로그인한 뒤 다시 진행해 주세요.</EmptyStateText>
            </EmptyStateCard>
          )}
        </AccountSection>

        <ButtonGroup>
          <Button variant="cancel" onClick={() => router.push('/')}>
            나중에
          </Button>
          <Button variant="confirm" onClick={handleAccept} disabled={acceptInvitationMutation.isPending}>
            {acceptInvitationMutation.isPending
              ? '처리 중...'
              : isLoggedIn
                ? '초대 수락'
                : '로그인하러 가기'}
          </Button>
        </ButtonGroup>
      </Card>
    </PageWrapper>
  );
}

const PageWrapper = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8f9fc;
`;

const Card = styled.section`
  width: min(100%, 36rem);
  border: 1px solid ${gray[200]};
  border-radius: 18px;
  background: #ffffff;
  padding: 2rem;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Eyebrow = styled.p`
  margin: 0;
  color: ${black[75]};
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
  font-weight: ${fontWeights.medium};
`;

const Title = styled.h1`
  margin: 0;
  color: ${black[300]};
  font-family: ${FONT_FAMILY};
  font-size: 2.25rem;
  font-weight: ${fontWeights.semibold};
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  margin: 1rem 0 0;
  color: ${black[100]};
  font-family: ${FONT_FAMILY};
  font-size: 1rem;
  line-height: 1.6;
`;

const AccountSection = styled.div`
  margin: 1.5rem 0 0;
`;

const SectionLabel = styled.p`
  margin: 0 0 0.75rem;
  color: ${black[75]};
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
  font-weight: ${fontWeights.medium};
`;

const AccountCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.125rem;
  border: 1px solid ${gray[200]};
  border-radius: 14px;
  background: ${gray[50]};
`;

const Avatar = styled.div<{ $imageUrl?: string }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: ${gray[200]};
  background-image: ${({ $imageUrl }) => ($imageUrl ? `url(${$imageUrl})` : 'none')};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const AccountContent = styled.div`
  min-width: 0;
`;

const AccountName = styled.p`
  margin: 0;
  color: ${black[300]};
  font-family: ${FONT_FAMILY};
  font-size: 1.125rem;
  font-weight: ${fontWeights.semibold};
`;

const AccountMeta = styled.p`
  margin: 0.3rem 0 0;
  color: ${black[75]};
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
`;

const SwitchAccountButton = styled.button`
  margin-top: 0.75rem;
  padding: 0;
  border: none;
  background: transparent;
  color: ${black[75]};
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
  font-weight: ${fontWeights.medium};
  cursor: pointer;

  &:hover {
    color: ${black[300]};
  }
`;

const EmptyStateCard = styled.div`
  padding: 1rem 1.125rem;
  border: 1px solid ${gray[200]};
  border-radius: 14px;
  background: ${gray[50]};
`;

const EmptyStateTitle = styled.p`
  margin: 0;
  color: ${black[300]};
  font-family: ${FONT_FAMILY};
  font-size: 1rem;
  font-weight: ${fontWeights.semibold};
`;

const EmptyStateText = styled.p`
  margin: 0.35rem 0 0;
  color: ${black[75]};
  font-family: ${FONT_FAMILY};
  font-size: 0.875rem;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;
