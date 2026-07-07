'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { useGithubAllowedRepositoriesQuery } from '@/services/app/app.query';
import { useUpdateGithubInfoMutation } from '@/services/app/app.mutation';
import * as S from './style';

export default function GithubConnectContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appId = searchParams.get('appId');
  const projectId = searchParams.get('projectId');
  const appName = (searchParams.get('appName') || '').trim();

  const { data: repositories, isLoading } = useGithubAllowedRepositoriesQuery(appId);
  const updateGithubInfoMutation = useUpdateGithubInfoMutation();

  const [selectedOwner, setSelectedOwner] = useState<{ name: string, profile: string } | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  const [isOwnerOpen, setIsOwnerOpen] = useState(false);
  const [isRepoOpen, setIsRepoOpen] = useState(false);

  const ownerRef = useRef<HTMLDivElement>(null);
  const repoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ownerRef.current && !ownerRef.current.contains(event.target as Node)) {
        setIsOwnerOpen(false);
      }
      if (repoRef.current && !repoRef.current.contains(event.target as Node)) {
        setIsRepoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ownersMap = new Map<string, string>();
  repositories?.forEach(repo => {
    const parts = repo.repository_full_name.split('/');
    if (parts.length >= 2) {
      ownersMap.set(parts[0], repo.repository_profile);
    } else {
      ownersMap.set(repo.repository_full_name, repo.repository_profile);
    }
  });
  const ownersList = Array.from(ownersMap.entries()).map(([name, profile]) => ({ name, profile }));

  useEffect(() => {
    if (!selectedOwner && ownersList.length > 0) {
      setSelectedOwner(ownersList[0]);
    }
  }, [selectedOwner, ownersList]);

  const availableRepos = repositories
    ?.filter(repo => selectedOwner && repo.repository_full_name.startsWith(selectedOwner.name + '/'))
    .map(repo => {
      const parts = repo.repository_full_name.split('/');
      return parts.length >= 2 ? parts.slice(1).join('/') : repo.repository_full_name;
    }) || [];

  useEffect(() => {
    setSelectedRepo(null);
  }, [selectedOwner?.name]);

  const handleSelectSubmit = async () => {
    if (!selectedOwner || !selectedRepo) {
      alert('조직과 저장소를 모두 선택해주세요.');
      return;
    }
    if (!appId) {
      alert('앱 식별자가 없습니다.');
      router.push('/project/manage');
      return;
    }

    try {
      await updateGithubInfoMutation.mutateAsync({
        appDeploymentId: appId,
        owner: selectedOwner.name,
        repository: selectedRepo,
      });
      alert('GitHub 저장소가 등록되었습니다.');
      if (projectId) {
        const nextQuery = new URLSearchParams();
        if (appName) nextQuery.set('appName', appName);
        router.push(`/project/manage/${projectId}/application${nextQuery.toString() ? `?${nextQuery.toString()}` : ''}`);
        return;
      }
      router.push('/project/manage');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('저장소 연결에 실패했습니다.');
      }
    }
  };

  const Chevron = ({ isOpen }: { isOpen: boolean }) => (
    <S.ChevronWrapper isOpen={isOpen}>
      <Image src="/icons/sidebar/chevron-right.svg" alt="chevron" width={18} height={18} />
    </S.ChevronWrapper>
  );

  return (
    <S.PageWrapper>
      <S.GithubLogoContainer>
        <Image src="/icons/github.svg" alt="GitHub" width={100} height={100} />
      </S.GithubLogoContainer>

      <S.Title>내 GitHub 저장소 API 등록하기</S.Title>

      <S.SelectsRow>
        <S.SelectWrapper width="35%" ref={ownerRef}>
          <S.SelectHeader onClick={() => setIsOwnerOpen(!isOwnerOpen)}>
            {selectedOwner ? (
              <S.SelectValue>
                {selectedOwner.profile ?
                  <S.ProfileImage src={selectedOwner.profile} alt="avatar" /> :
                  <S.DefaultIcon />
                }
                <span>{selectedOwner.name.length > 10 ? selectedOwner.name.substring(0, 10) + '...' : selectedOwner.name}</span>
              </S.SelectValue>
            ) : (
              <span>조직 선택</span>
            )}
            <Chevron isOpen={isOwnerOpen} />
          </S.SelectHeader>

          {isOwnerOpen && ownersList.length > 0 && (
            <S.DropdownList>
              {ownersList.map(owner => (
                <S.DropdownItem
                  key={owner.name}
                  onClick={() => {
                    setSelectedOwner(owner);
                    setIsOwnerOpen(false);
                  }}
                >
                  {owner.profile ?
                    <S.ProfileImage src={owner.profile} alt="avatar" /> :
                    <S.DefaultIcon />
                  }
                  <span>{owner.name}</span>
                </S.DropdownItem>
              ))}
            </S.DropdownList>
          )}
        </S.SelectWrapper>

        <S.SelectWrapper width="65%" ref={repoRef}>
          <S.SelectHeader onClick={() => setIsRepoOpen(!isRepoOpen)}>
            <S.SelectValue>
              <span>{selectedRepo || '저장소를 선택하세요'}</span>
            </S.SelectValue>
            <Chevron isOpen={isRepoOpen} />
          </S.SelectHeader>

          {isRepoOpen && availableRepos.length > 0 && (
            <S.DropdownList>
              {availableRepos.map(repoName => (
                <S.DropdownItem
                  key={repoName}
                  onClick={() => {
                    setSelectedRepo(repoName);
                    setIsRepoOpen(false);
                  }}
                >
                  {repoName}
                </S.DropdownItem>
              ))}
            </S.DropdownList>
          )}
          {isRepoOpen && availableRepos.length === 0 && (
            <S.DropdownList>
              <S.DropdownItem style={{ color: '#8b949e', cursor: 'default' }}>
                {isLoading ? '로딩 중...' : '저장소가 없습니다.'}
              </S.DropdownItem>
            </S.DropdownList>
          )}
        </S.SelectWrapper>
      </S.SelectsRow>

      <S.AppInstallPrompt>
        찾으시는 저장소가 없나요?
        <a href="https://github.com/apps/m-adp/installations/new" target="_blank" rel="noopener noreferrer">
          GitHub App 설치하기
        </a>
      </S.AppInstallPrompt>

      <S.SubmitButton onClick={handleSelectSubmit} disabled={updateGithubInfoMutation.isPending}>
        {updateGithubInfoMutation.isPending ? '등록 중...' : '선택'}
      </S.SubmitButton>

    </S.PageWrapper>
  );
}
